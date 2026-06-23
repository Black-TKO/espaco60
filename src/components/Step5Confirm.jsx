import { formatCurrency } from '../utils/helpers';
import { Icons } from './Icons/Icons';

export default function Step5({ formattedDate, currentSlot, totalPrice, bookingId, resetApp }) {
  return (
    <section className="section section--confirm">
      <div className="confirm">
        <div className="confirm__emoji"><Icons.Star size={40} /></div>
        <h2 className="confirm__title">Pedido Enviado!</h2>
        <p className="confirm__text">
          Seu agendamento foi enviado para o WhatsApp do salão. Aguarde a confirmação em breve!
        </p>
        <div className="confirm__card">
          <div className="confirm__row">
            <span><Icons.Calendar size={16} /> Data</span><strong>{formattedDate}</strong>
          </div>
          <div className="confirm__row">
            <span><Icons.Clock size={16} /> Horário</span><strong>{currentSlot?.time}</strong>
          </div>
          <div className="confirm__row">
            <span><Icons.Cart size={16} /> Total</span><strong>{formatCurrency(totalPrice)}</strong>
          </div>
          <div className="confirm__row">
            <span><Icons.User size={16} /> Código</span><strong>#{bookingId}</strong>
          </div>
        </div>
        <p className="confirm__hint">
          <Icons.Phone size={14} /> Uma janela do WhatsApp foi aberta. <strong>Não esqueça de enviar o comprovante em anexo!</strong>
        </p>
        <button className="btn btn--primary btn--full" onClick={resetApp}><Icons.Rocket /> + Nova Reserva</button>
      </div>
    </section>
  );
}
