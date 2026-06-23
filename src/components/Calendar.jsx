import { useMemo } from 'react';
import { CONFIG } from '../config/config';
import { getBookings, isDateFull } from '../utils/helpers';

const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                     'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const WEEKDAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

export default function Calendar({ currentMonth, currentYear, selectedDate, onDayClick, onPrevMonth, onNextMonth }) {
  const now = new Date();
  const isCurrentMonth = currentYear === now.getFullYear() && currentMonth === now.getMonth();

  const calendarDays = useMemo(() => {
    const Y = currentYear, M = currentMonth;
    const firstWeekDay = new Date(Y, M, 1).getDay();
    const daysInMonth = new Date(Y, M + 1, 0).getDate();
    const todayMs = new Date().setHours(0, 0, 0, 0);
    const bookings = getBookings();
    const days = [];
    for (let i = 0; i < firstWeekDay; i++) days.push({ empty: true });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(Y, M, d);
      const dateStr = `${Y}-${String(M + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const isPast = date.getTime() < todayMs;
      const isClosed = CONFIG.closedDays.includes(date.getDay());
      const isFullyBooked = !isPast && !isClosed && isDateFull(dateStr, bookings, CONFIG.timeSlots);
      days.push({
        day: d, dateStr, isPast, isClosed, isFullyBooked,
        isSelected: selectedDate === dateStr,
        isToday: date.getTime() === todayMs,
      });
    }
    return days;
  }, [currentMonth, currentYear, selectedDate]);

  return (
    <div className="calendar">
      <div className="calendar__nav">
        <button className="calendar__arrow" onClick={onPrevMonth} disabled={isCurrentMonth}>&#8249;</button>
        <span className="calendar__month-label">{MONTH_NAMES[currentMonth]} {currentYear}</span>
        <button className="calendar__arrow" onClick={onNextMonth}>&#8250;</button>
      </div>
      <div className="calendar__weekdays">
        {WEEKDAYS.map(wd => <span key={wd} className="calendar__wd">{wd}</span>)}
      </div>
      <div className="calendar__grid">
        {calendarDays.map((d, i) => {
          let cls = 'calendar__cell';
          if (d.empty) cls += ' calendar__cell--empty';
          else if (d.isPast) cls += ' calendar__cell--past';
          else if (d.isClosed) cls += ' calendar__cell--closed';
          else if (d.isFullyBooked) cls += ' calendar__cell--full';
          else if (d.isSelected) cls += ' calendar__cell--selected';
          else cls += ' calendar__cell--avail';
          if (!d.empty && d.isToday) cls += ' calendar__cell--today';
          return (
            <div key={i} className={cls} onClick={() => onDayClick(d)}>
              {!d.empty && <span className="calendar__day-num">{d.day}</span>}
              {!d.empty && d.isToday && !d.isSelected && <span className="calendar__today-dot" />}
            </div>
          );
        })}
      </div>
      <div className="calendar__legend">
        <span className="calendar__leg"><span className="calendar__dot calendar__dot--avail" />Disponível</span>
        <span className="calendar__leg"><span className="calendar__dot calendar__dot--selected" />Selecionado</span>
        <span className="calendar__leg"><span className="calendar__dot calendar__dot--full" />Lotado</span>
        <span className="calendar__leg"><span className="calendar__dot calendar__dot--past" />Indisponível</span>
      </div>
    </div>
  );
}
