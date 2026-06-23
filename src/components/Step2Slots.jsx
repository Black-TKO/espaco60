import { getBookings, formatCurrency, phoneMask, getPricing } from '../utils/helpers';
import { Icons } from './Icons/Icons';

export default function Step2({
  timeSlots, // recebido do BookingPage/useBooking
  selectedDate,
  selectedSlot,
  setSelectedSlot,
  formattedDate,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  peopleCount,
  setPeopleCount,
  customerNotes,
  setCustomerNotes,
  canStep2,
  nextStep,
  prevStep
}) {
  const bookings = getBookings();
  const slots = Array.isArray(timeSlots) ? timeSlots : [];
  const pricing = getPricing();

  const calcPrice = (people = peopleCount) => {
    const base = Number(pricing.basePrice) || 0;
    const included = Number(pricing.includedGuests) || 0;
    const extra = Number(pricing.extraPerGuest) || 0;
    const over = Math.max(0, Number(people) - included);
    return base + (over * extra);
  };

  const availableSlots = slots.map(s => ({
    ...s,
    booked: !!selectedDate && bookings.some(
      b => b.date === selectedDate && b.timeSlot === s.time && b.status !== 'cancelled'
    ),
    computedPrice: calcPrice(peopleCount)
  }));

  return (
    <section className="section">
      <div className="section__head">
        <h2 className="section__title">Horário & Dados</h2>
        <p className="section__desc">{formattedDate}</p>
      </div>

      <div className="slots">
        {availableSlots.map(slot => {
          const IconComp = slot.icon && Icons[slot.icon] ? Icons[slot.icon] : null;
          return (
            <div
              key={slot.id}
              className={`slot${String(selectedSlot) === String(slot.id) ? ' slot--selected' : ''}${slot.booked ? ' slot--booked' : ''}`}
              onClick={() => !slot.booked && setSelectedSlot(slot.id)}
            >
              <span className="slot__icon">
                {IconComp ? <IconComp size={20} /> : (slot.icon || '')}
              </span>
              <div className="slot__body">
                <strong className="slot__name">{slot.label}</strong>
                <span className="slot__time">{slot.time}</span>
              </div>
              <div className="slot__right">
                <span className="slot__price">{formatCurrency(slot.computedPrice)}</span>
                {slot.booked
                  ? <span className="slot__badge slot__badge--busy">Ocupado</span>
                  : String(selectedSlot) === String(slot.id) && <span className="slot__badge slot__badge--ok">✓</span>
                }
              </div>
            </div>
          );
        })}
        {slots.length === 0 && (
          <div className="empty-state">
            <p>Nenhum turno disponível.</p>
          </div>
        )}
      </div>

      <div className="form">
        <h3 className="form__title">Seus Dados</h3>
        <div className="form__field">
          <label className="form__label">Nome completo *</label>
          <input className="form__input" type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Seu nome completo" />
        </div>
        <div className="form__field">
          <label className="form__label">WhatsApp *</label>
          <input className="form__input" type="tel" value={customerPhone} onChange={e => setCustomerPhone(phoneMask(e.target.value))} placeholder="(00) 00000-0000" />
        </div>
        <div className="form__field">
          <label className="form__label">Número de convidados *</label>
          <div className="counter">
            <button className="counter__btn" onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}>−</button>
            <input className="counter__input" type="number" value={peopleCount} onChange={e => setPeopleCount(Number(e.target.value))} min="1" max="300" />
            <button className="counter__btn" onClick={() => setPeopleCount(Math.min(300, peopleCount + 1))}>+</button>
          </div>
          <div style={{ marginTop: 8 }}>Preço estimado: <strong>{formatCurrency(calcPrice(peopleCount))}</strong></div>
        </div>
        <div className="form__field">
          <label className="form__label">Observações</label>
          <textarea className="form__input form__input--ta" value={customerNotes} onChange={e => setCustomerNotes(e.target.value)} rows="3" placeholder="Tema da festa, decoração, necessidades especiais..." />
        </div>
      </div>

      <div className="action-bar action-bar--split">
        <button className="btn btn--ghost" onClick={prevStep}>← Voltar</button>
        <button className="btn btn--primary" disabled={!canStep2} onClick={nextStep}>Ver Resumo →</button>
      </div>
    </section>
  );
}
