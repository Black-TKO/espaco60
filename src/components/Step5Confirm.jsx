import { formatCurrency } from '../utils/helpers';

export default function Step5({ formattedDate, currentSlot, totalPrice, bookingId, resetApp }) {
  return (
    <section className="section section--confirm">
      <div className="confirm">
        <div className="confirm__emoji">🎊</div>
        <h2 className="confirm__title">Pedido Enviado!</h2>
        <p className="confirm__text">
          Seu agendamento foi enviado para o WhatsApp do salão. Aguarde a confirmação em breve!
        </p>
        <div className="confirm__card">
          <div className="confirm__row">
            <span>📅 Data</span><strong>{formattedDate}</strong>
          </div>
          <div className="confirm__row">
            <span>⏰ Horário</span><strong>{currentSlot?.time}</strong>
          </div>
          <div className="confirm__row">
            <span>💰 Total</span><strong>{formatCurrency(totalPrice)}</strong>
          </div>
          <div className="confirm__row">
            <span>🆔 Código</span><strong>#{bookingId}</strong>
          </div>
        </div>
        <p className="confirm__hint">
          📱 Uma janela do WhatsApp foi aberta. <strong>Não esqueça de enviar o comprovante em anexo!</strong>
        </p>
        <button className="btn btn--primary btn--full" onClick={resetApp}>+ Nova Reserva</button>
      </div>
    </section>
  );
}
