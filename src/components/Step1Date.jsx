import Calendar from '../components/Calendar';

export default function Step1({ currentMonth, currentYear, selectedDate, formattedDate, onDayClick, onPrevMonth, onNextMonth, nextStep }) {
  return (
    <section className="section">
      <div className="section__head">
        <h2 className="section__title">Escolha a Data</h2>
        <p className="section__desc">Selecione o dia disponível para sua festa</p>
      </div>

      <Calendar
        currentMonth={currentMonth}
        currentYear={currentYear}
        selectedDate={selectedDate}
        onDayClick={onDayClick}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />

      {selectedDate && (
        <div className="info-banner">
          <span>📅</span>
          <span>Data selecionada: <strong>{formattedDate}</strong></span>
        </div>
      )}

      <div className="action-bar">
        <button className="btn btn--primary btn--full" disabled={!selectedDate} onClick={nextStep}>
          Escolher Horário →
        </button>
      </div>
    </section>
  );
}
