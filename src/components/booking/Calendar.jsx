import React, { useState, useMemo } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import styles from './Calendar.module.css'
import { MONTHS, WEEKDAYS, CONFIG } from '../../config'
import { useBooking } from '../../context/BookingContext'

export const Calendar = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const { bookings } = useBooking()

  const isCurrentMonth =
    currentYear === new Date().getFullYear() &&
    currentMonth === new Date().getMonth()

  const calendarDays = useMemo(() => {
    const firstWeekDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const todayMs = new Date().setHours(0, 0, 0, 0)

    const days = []

    for (let i = 0; i < firstWeekDay; i++) {
      days.push({ empty: true })
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, currentMonth, d)
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const isPast = date.getTime() < todayMs
      const isClosed = CONFIG.closedDays.includes(date.getDay())
      const isFullyBooked = isDateFull(dateStr)

      days.push({
        day: d,
        dateStr,
        isPast,
        isClosed,
        isFullyBooked,
        isSelected: selectedDate === dateStr,
        isToday: date.getTime() === todayMs,
      })
    }
    return days
  }, [currentMonth, currentYear, selectedDate, bookings])

  const isDateFull = (dateStr) => {
    const occupied = bookings
      .filter(b => b.date === dateStr && b.status !== 'cancelled')
      .map(b => b.timeSlot)
    return CONFIG.timeSlots.every(s => occupied.includes(s.time))
  }

  const handlePrevMonth = () => {
    if (isCurrentMonth) return
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDayClick = (day) => {
    if (day.empty || day.isPast || day.isClosed || day.isFullyBooked) return
    onDateSelect(day.dateStr)
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarNav}>
        <button
          className={styles.calendarArrow}
          onClick={handlePrevMonth}
          disabled={isCurrentMonth}
        >
          <FaChevronLeft size={22} />
        </button>
        <span className={styles.calendarMonthLabel}>
          {MONTHS[currentMonth]} {currentYear}
        </span>
        <button className={styles.calendarArrow} onClick={handleNextMonth}>
          <FaChevronRight size={22} />
        </button>
      </div>

      <div className={styles.calendarWeekdays}>
        {WEEKDAYS.map(wd => (
          <span key={wd} className={styles.calendarWd}>
            {wd}
          </span>
        ))}
      </div>

      <div className={styles.calendarGrid}>
        {calendarDays.map((day, idx) => (
          <div
            key={idx}
            className={`${styles.calendarCell} ${
              day.empty ? styles['calendarCell--empty'] : ''
            } ${day.isPast ? styles['calendarCell--past'] : ''} ${
              day.isClosed ? styles['calendarCell--closed'] : ''
            } ${day.isFullyBooked ? styles['calendarCell--full'] : ''} ${
              day.isSelected ? styles['calendarCell--selected'] : ''
            } ${
              !day.empty &&
              !day.isPast &&
              !day.isClosed &&
              !day.isFullyBooked &&
              !day.isSelected
                ? styles['calendarCell--avail']
                : ''
            } ${day.isToday ? styles['calendarCell--today'] : ''}`}
            onClick={() => handleDayClick(day)}
          >
            {!day.empty && <span className={styles.calendarDayNum}>{day.day}</span>}
            {!day.empty && day.isToday && !day.isSelected && (
              <span className={styles.calendarTodayDot} />
            )}
          </div>
        ))}
      </div>

      <div className={styles.calendarLegend}>
        <span className={styles.calendarLeg}>
          <span className={`${styles.calendarDot} ${styles['calendarDot--avail']}`} />
          Disponível
        </span>
        <span className={styles.calendarLeg}>
          <span className={`${styles.calendarDot} ${styles['calendarDot--selected']}`} />
          Selecionado
        </span>
        <span className={styles.calendarLeg}>
          <span className={`${styles.calendarDot} ${styles['calendarDot--full']}`} />
          Lotado
        </span>
        <span className={styles.calendarLeg}>
          <span className={`${styles.calendarDot} ${styles['calendarDot--past']}`} />
          Indisponível
        </span>
      </div>
    </div>
  )
}
