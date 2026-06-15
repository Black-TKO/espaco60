import { formatCurrency } from '../utils/helpers';

export default function Step3({ formattedDate, currentSlot, customerName, customerPhone, peopleCount, customerNotes, totalPrice, qrCodeSvg, pixCopied, copyPix, nextStep, prevStep, showToast }) {
  return (
    <section className="section">
      <div className="section__head">
        <h2 className="section__title">Resumo & Pagamento</h2>
        <p className="section__desc">Confira os dados e realize o pagamento</p>
      </div>

      <div className="cart">
        <div className="cart__row"><span className="cart__key">📅 Data</span><span className="cart__val">{formattedDate}</span></div>
        <div className="cart__row"><span className="cart__key">⏰ Horário</span><span className="cart__val">{currentSlot?.time}</span></div>
        <div className="cart__row"><span className="cart__key">🎉 Turno</span><span className="cart__val">{currentSlot?.label}</span></div>
        <div className="cart__row"><span className="cart__key">👤 Nome</span><span className="cart__val">{customerName}</span></div>
        <div className="cart__row"><span className="cart__key">📞 WhatsApp</span><span className="cart__val">{customerPhone}</span></div>
        <div className="cart__row"><span className="cart__key">👥 Convidados</span><span className="cart__val">{peopleCount} pessoas</span></div>
        {customerNotes && <div className="cart__row"><span className="cart__key">📝 Obs.</span><span className="cart__val cart__val--notes">{customerNotes}</span></div>}
        <div className="cart__divider" />
        <div className="cart__total">
          <span className="cart__total-label">Total</span>
          <span className="cart__total-price">{formatCurrency(totalPrice)}</span>
        </div>
      </div>

      <div className="pix-card">
        <div className="pix-card__header">
          <span className="pix-card__title">Pague via PIX</span>
          <span className="pix-card__subtitle">Instantâneo e seguro</span>
        </div>
        <div className="pix-card__qr" dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
        <div className="pix-card__amount">
          <span>Valor: </span><strong>{formatCurrency(totalPrice)}</strong>
        </div>
        <div className="pix-card__key-box">
          <div className="pix-card__key-info">
            <span className="pix-card__key-type">Telefone</span>
            <span className="pix-card__key-value">(21) 99999-9999</span>
          </div>
          <button className={`pix-card__copy${pixCopied ? ' pix-card__copy--ok' : ''}`} onClick={() => copyPix(showToast)}>
            {pixCopied ? '✓ Copiado!' : 'Copiar Chave'}
          </button>
        </div>
        <p className="pix-card__warning">⚠️ Após pagar, avance e envie o comprovante</p>
      </div>

      <div className="action-bar action-bar--split">
        <button className="btn btn--ghost" onClick={prevStep}>← Voltar</button>
        <button className="btn btn--primary" onClick={nextStep}>Enviar Comprovante →</button>
      </div>
    </section>
  );
}
