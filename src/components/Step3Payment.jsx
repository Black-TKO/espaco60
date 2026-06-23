import { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/helpers';
import { CONFIG } from '../config/config';
import { Icons } from './Icons/Icons';

// CRC16 (X25 / CCITT) — usado para calcular o CRC do payload EMV
function crc16ccitt(input) {
  const polynomial = 0x1021;
  let crc = 0xffff;
  for (let i = 0; i < input.length; i++) {
    crc ^= input.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ polynomial) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function tlv(id, value) {
  const len = String(value.length).padStart(2, '0');
  return `${id}${len}${value}`;
}

function buildPixPayload({ pixKey, merchant, city, amount, txid }) {
  const payload = [];
  payload.push(tlv('00', '01')); // Payload format indicator
  // Merchant account information (PIX)
  const mai = [];
  mai.push(tlv('00', 'br.gov.bcb.pix'));
  mai.push(tlv('01', pixKey));
  payload.push(tlv('26', mai.join('')));
  payload.push(tlv('52', '0000')); // MCC
  payload.push(tlv('53', '986'));  // Currency BRL
  if (amount && Number(amount) > 0) payload.push(tlv('54', Number(amount).toFixed(2)));
  payload.push(tlv('58', 'BR'));
  payload.push(tlv('59', (merchant || '').slice(0, 25)));
  payload.push(tlv('60', (city || '').slice(0, 15)));
  // Additional data field template (txid)
  const add = [];
  add.push(tlv('05', (txid || '*')));
  payload.push(tlv('62', add.join('')));
  const assembled = payload.join('') + '6304';
  const crc = crc16ccitt(assembled);
  return assembled + crc;
}

// normaliza chave PIX:
// - emails passam direto
// - CPF/CNPJ (11/14 dígitos) mantêm só dígitos
// - UUID-like mantem
// - telefones: transforma para +55 + digits (E.164)
function normalizePixKey(raw) {
  if (!raw) return '';
  const s = String(raw).trim();
  if (s.includes('@')) return s; // e-mail
  if (/^[0-9a-fA-F\-]{36}$/.test(s)) return s; // uuid
  const digits = s.replace(/\D/g, '');
  if (digits.length === 11 || digits.length === 14) return digits; // CPF/CNPJ
  if (digits.length === 10 || digits.length === 11) return `+55${digits}`; // telefone local -> E.164 BR
  // se já começa com + e tem digits, retorna
  if (s.startsWith('+')) return s;
  return s;
}

// remove acentos e caracteres problemáticos para merchant/city
function normalizeText(t) {
  if (!t) return '';
  return String(t)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^\w\s\-.,]/g, '')     // remove chars estranhos
    .trim();
}

export default function Step3({
  formattedDate,
  currentSlot,
  customerName,
  customerPhone,
  peopleCount,
  customerNotes,
  totalPrice,
  qrCodeSvg,     // fallback existing svg from hook
  pixCopied,
  copyPix,
  nextStep,
  prevStep,
  showToast
}) {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [qrError, setQrError] = useState(null);
  const [loadingQr, setLoadingQr] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function generate() {
      setLoadingQr(true);
      setQrError(null);
      try {
        // valores do CONFIG e do .env
        const pixKeyRaw = CONFIG?.pixKey || import.meta.env.VITE_PIX_KEY || '';
        const pixKey = normalizePixKey(pixKeyRaw);
        const merchantRaw = CONFIG?.salonName || import.meta.env.VITE_SALON_NAME || 'Espaco';
        const merchant = normalizeText(merchantRaw).slice(0, 25);
        // cidade: prefer env, senão use Marica (user forneceu)
        const cityRaw = import.meta.env.VITE_SALON_CITY || 'Maricá';
        const city = normalizeText(cityRaw).slice(0, 15);

        // valor: usa totalPrice se disponível, senão usa 350 (padrão)
        const amountValue = Number(totalPrice) || 350;

        if (!pixKey) {
          setQrError('Chave PIX não configurada.');
          setLoadingQr(false);
          return;
        }

        // monta payload EMV
        const payload = buildPixPayload({
          pixKey,
          merchant,
          city,
          amount: amountValue,
          txid: '*'
        });

        // log do payload para debug (para colar em validadores)
        // eslint-disable-next-line no-console
        console.log('EMV PIX payload gerado:', payload);

        // tenta gerar dataURL com 'qrcode' (import dinâmico)
        try {
          const qrcode = await import('qrcode');
          if (!mounted) return;
          const opts = { errorCorrectionLevel: 'M', margin: 1, scale: 6 };
          const dataUrl = await qrcode.toDataURL(payload, opts);
          if (!mounted) return;
          setQrDataUrl(dataUrl);
        } catch (err) {
          console.warn('qrcode lib import falhou/erro ao gerar QR:', err);
          if (!mounted) return;
          setQrDataUrl(null);
          setQrError(err?.message || String(err));
        }
      } catch (err) {
        console.error('Erro gerando QR PIX:', err);
        if (!mounted) return;
        setQrError(err?.message || String(err));
        setQrDataUrl(null);
      } finally {
        if (mounted) setLoadingQr(false);
      }
    }
    generate();
    return () => { mounted = false; };
  }, [totalPrice]);

  return (
    <section className="section">
      <div className="section__head">
        <h2 className="section__title">Resumo & Pagamento</h2>
        <p className="section__desc">Confira os dados e realize o pagamento</p>
      </div>

      <div className="cart">
        <div className="cart__row">
          <span className="cart__key"><Icons.Calendar size={18} /> Data</span>
          <span className="cart__val">{formattedDate}</span>
        </div>
        <div className="cart__row">
          <span className="cart__key"><Icons.Clock size={18} /> Horário</span>
          <span className="cart__val">{currentSlot?.time}</span>
        </div>
        <div className="cart__row">
          <span className="cart__key"><Icons.Gift size={18} /> Turno</span>
          <span className="cart__val">{currentSlot?.label}</span>
        </div>
        <div className="cart__row">
          <span className="cart__key"><Icons.User size={18} /> Nome</span>
          <span className="cart__val">{customerName}</span>
        </div>
        <div className="cart__row">
          <span className="cart__key"><Icons.Phone size={18} /> WhatsApp</span>
          <span className="cart__val">{customerPhone}</span>
        </div>
        <div className="cart__row">
          <span className="cart__key"><Icons.User size={18} /> Convidados</span>
          <span className="cart__val">{peopleCount} pessoas</span>
        </div>
        {customerNotes && (
          <div className="cart__row">
            <span className="cart__key"><Icons.Clip size={18} /> Obs.</span>
            <span className="cart__val cart__val--notes">{customerNotes}</span>
          </div>
        )}
        <div className="cart__divider" />
        <div className="cart__total">
          <span className="cart__total-label">Total</span>
          <span className="cart__total-price">{formatCurrency(Number(totalPrice) || 350)}</span>
        </div>
      </div>

      <div className="pix-card">
        <div className="pix-card__header">
          <span className="pix-card__title">Pague via PIX</span>
          <span className="pix-card__subtitle">Instantâneo e seguro</span>
        </div>

        <div className="pix-card__qr" style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {loadingQr && <div>Gerando QR...</div>}
          {!loadingQr && qrDataUrl && (
            <img src={qrDataUrl} alt="QR Pix" style={{ maxWidth: 260, borderRadius: 8 }} />
          )}
          {!loadingQr && !qrDataUrl && (
            <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
          )}
        </div>

        <div className="pix-card__amount">
          <span>Valor: </span><strong>{formatCurrency(Number(totalPrice) || 350)}</strong>
        </div>

        <div className="pix-card__key-box">
          <div className="pix-card__key-info">
            <span className="pix-card__key-type">{CONFIG.pixKeyType || 'Chave'}</span>
            <span className="pix-card__key-value">{CONFIG.pixKey || import.meta.env.VITE_PIX_KEY || ''}</span>
          </div>
          <button
            className={`pix-card__copy${pixCopied ? ' pix-card__copy--ok' : ''}`}
            onClick={() => copyPix(showToast)}
          >
            {pixCopied ? <><Icons.Check /> Copiado!</> : <><Icons.Clip /> Copiar Chave</>}
          </button>
        </div>

        {(qrError || qrDataUrl === null) && (
          <div className="pix-card__lib-warning" style={{ color: '#c04', marginTop: 8 }}>
            (Aviso) QR não pôde ser gerado com a(s) biblioteca(s) instaladas; usando fallback. {qrError ? `Detalhe: ${qrError}` : ''}
          </div>
        )}

        <p className="pix-card__warning"><Icons.Star /> Após pagar, avance e envie o comprovante</p>
      </div>

      <div className="action-bar action-bar--split">
        <button className="btn btn--ghost" onClick={prevStep}><Icons.X /> Voltar</button>
        <button className="btn btn--primary" onClick={nextStep}><Icons.Clip /> Enviar Comprovante →</button>
      </div>
    </section>
  );
}
