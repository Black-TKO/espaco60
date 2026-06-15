import React, { useState } from 'react'
import { Header } from '../../components/common/Header'
import { Stepper } from '../../components/booking/Stepper'
import { Calendar } from '../../components/booking/Calendar'
import { Button } from '../../components/common/Button'
import { useFormattingUtils } from '../../hooks/useFormattingUtils'
import { useToast } from '../../context/ToastContext'
import { useBooking } from '../../context/BookingContext'
import { CONFIG } from '../../config'
import styles from './BookingPage.module.css'

export const BookingPage = () => {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [peopleCount, setPeopleCount] = useState(50)
  const [customerNotes, setCustomerNotes] = useState('')
  const [receipt, setReceipt] = useState(null)
  const [receiptFileName, setReceiptFileName] = useState('')
  const [bookingId, setBookingId] = useState('')

  const { formatCurrency, formatDate, formatPhone } = useFormattingUtils()
  const { showToast } = useToast()
  const { addBooking } = useBooking()

  const currentSlot = CONFIG.timeSlots.find(s => s.id === selectedSlot)
  const totalPrice = currentSlot ? currentSlot.price : 0
  const formattedDate = selectedDate ? formatDate(selectedDate) : ''

  const canStep2 =
    selectedSlot &&
    customerName.trim() &&
    customerPhone.trim().length >= 14 &&
    peopleCount > 0

  const handlePhoneMask = (e) => {
    const formatted = formatPhone(e.target.value)
    setCustomerPhone(formatted)
  }

  const handleReceiptChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setReceiptFileName(file.name)

    const reader = new FileReader()
    reader.onload = ev => {
      setReceipt(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleFinalize = () => {
    const id = Date.now().toString()
    setBookingId(id)

    const booking = {
      id,
      date: selectedDate,
      timeSlot: currentSlot?.time,
      slotLabel: currentSlot?.label,
      slotId: selectedSlot,
      people: peopleCount,
      price: totalPrice,
      customerName,
      customerPhone,
      customerNotes,
      status: 'pending',
      createdAt: new Date().toISOString(),
      receipt,
      receiptFileName,
    }

    addBooking(booking)

    const lines = [
      `🎉 *NOVO AGENDAMENTO – ${CONFIG.salonName}*`,
      ``,
      `👤 *Nome:* ${booking.customerName}`,
      `📞 *WhatsApp:* ${booking.customerPhone}`,
      `📅 *Data:* ${formattedDate}`,
      `⏰ *Horário:* ${booking.timeSlot} (${booking.slotLabel})`,
      `👥 *Convidados:* ${booking.people} pessoas`,
      `💰 *Valor:* ${formatCurrency(booking.price)}`,
      booking.customerNotes ? `📝 *Obs.:* ${booking.customerNotes}` : null,
      ``,
      `✅ Comprovante de pagamento enviado em anexo`,
      `🆔 *Código:* #${id}`,
      ``,
      `_Agendado em: ${new Date().toLocaleString('pt-BR')}_`,
    ]
      .filter(l => l !== null)
      .join('\n')

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(lines)}`
    window.open(url, '_blank')

    setStep(5)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    setStep(1)
    setSelectedDate(null)
    setSelectedSlot(null)
    setCustomerName('')
    setCustomerPhone('')
    setPeopleCount(50)
    setCustomerNotes('')
    setReceipt(null)
    setReceiptFileName('')
    setBookingId('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Header />
      {step < 5 && <Stepper currentStep={step} />}

      <main className={styles.main}>
        {/* Step 1 - Calendar */}
        {step === 1 && (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Escolha a Data</h2>
              <p className={styles.sectionDesc}>Selecione o dia disponível para sua festa</p>
            </div>

            <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

            {selectedDate && (
              <div className={styles.infoBanner}>
                <span className={styles.infoBannerIcon}>📅</span>
                <span>
                  Data selecionada: <strong>{formattedDate}</strong>
                </span>
              </div>
            )}

            <div className={styles.actionBar}>
              <Button
                full
                disabled={!selectedDate}
                onClick={() => {
                  setStep(2)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                Escolher Horário →
              </Button>
            </div>
          </section>
        )}

        {/* Step 2 - Slots & Data */}
        {step === 2 && (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Horário & Dados</h2>
              <p className={styles.sectionDesc}>{formattedDate}</p>
            </div>

            <div className={styles.slots}>
              {CONFIG.timeSlots.map(slot => {
                const isBooked = false
                return (
                  <div
                    key={slot.id}
                    className={`${styles.slot} ${
                      selectedSlot === slot.id ? styles['slot--selected'] : ''
                    } ${isBooked ? styles['slot--booked'] : ''}`}
                    onClick={() => !isBooked && setSelectedSlot(slot.id)}
                  >
                    <span className={styles.slotIcon}>{slot.label.charAt(0)}</span>
                    <div className={styles.slotBody}>
                      <strong className={styles.slotName}>{slot.label}</strong>
                      <span className={styles.slotTime}>{slot.time}</span>
                    </div>
                    <div className={styles.slotRight}>
                      <span className={styles.slotPrice}>{formatCurrency(slot.price)}</span>
                      {isBooked && <span className={styles.slotBadge}>Ocupado</span>}
                      {selectedSlot === slot.id && !isBooked && (
                        <span className={`${styles.slotBadge} ${styles['slotBadge--ok']}`}>✓</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className={styles.form}>
              <h3 className={styles.formTitle}>Seus Dados</h3>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Nome completo *</label>
                <input
                  className={styles.formInput}
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>WhatsApp *</label>
                <input
                  className={styles.formInput}
                  type="tel"
                  value={customerPhone}
                  onChange={handlePhoneMask}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Número de convidados *</label>
                <div className={styles.counter}>
                  <button
                    className={styles.counterBtn}
                    onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                  >
                    −
                  </button>
                  <input
                    className={styles.counterInput}
                    type="number"
                    value={peopleCount}
                    onChange={e => setPeopleCount(Number(e.target.value))}
                    min="1"
                    max="300"
                  />
                  <button
                    className={styles.counterBtn}
                    onClick={() => setPeopleCount(Math.min(300, peopleCount + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Observações</label>
                <textarea
                  className={`${styles.formInput} ${styles['formInput--ta']}`}
                  value={customerNotes}
                  onChange={e => setCustomerNotes(e.target.value)}
                  rows="3"
                  placeholder="Tema da festa, decoração, necessidades especiais..."
                />
              </div>
            </div>

            <div className={`${styles.actionBar} ${styles['actionBar--split']}`}>
              <Button
                variant="ghost"
                onClick={() => {
                  setStep(1)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                ← Voltar
              </Button>
              <Button disabled={!canStep2} onClick={() => {
                setStep(3)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}>
                Ver Resumo →
              </Button>
            </div>
          </section>
        )}

        {/* Step 3 - Payment */}
        {step === 3 && (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Resumo & Pagamento</h2>
              <p className={styles.sectionDesc}>Confira os dados e realize o pagamento</p>
            </div>

            <div className={styles.cart}>
              <div className={styles.cartRow}>
                <span className={styles.cartKey}>📅 Data</span>
                <span className={styles.cartVal}>{formattedDate}</span>
              </div>
              <div className={styles.cartRow}>
                <span className={styles.cartKey}>⏰ Horário</span>
                <span className={styles.cartVal}>{currentSlot?.time}</span>
              </div>
              <div className={styles.cartRow}>
                <span className={styles.cartKey}>🎉 Turno</span>
                <span className={styles.cartVal}>{currentSlot?.label}</span>
              </div>
              <div className={styles.cartRow}>
                <span className={styles.cartKey}>👤 Nome</span>
                <span className={styles.cartVal}>{customerName}</span>
              </div>
              <div className={styles.cartRow}>
                <span className={styles.cartKey}>📞 WhatsApp</span>
                <span className={styles.cartVal}>{customerPhone}</span>
              </div>
              <div className={styles.cartRow}>
                <span className={styles.cartKey}>👥 Convidados</span>
                <span className={styles.cartVal}>{peopleCount} pessoas</span>
              </div>
              {customerNotes && (
                <div className={styles.cartRow}>
                  <span className={styles.cartKey}>📝 Obs.</span>
                  <span className={`${styles.cartVal} ${styles['cartVal--notes']}`}>
                    {customerNotes}
                  </span>
                </div>
              )}
              <div className={styles.cartDivider} />
              <div className={styles.cartTotal}>
                <span className={styles.cartTotalLabel}>Total</span>
                <span className={styles.cartTotalPrice}>{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <div className={styles.pixCard}>
              <div className={styles.pixCardHeader}>
                <span className={styles.pixCardTitle}>Pague via PIX</span>
                <span className={styles.pixCardSubtitle}>Instantâneo e seguro</span>
              </div>
              <div className={styles.pixCardKey}>
                <div className={styles.pixCardKeyInfo}>
                  <span className={styles.pixCardKeyType}>{CONFIG.pixKeyType}</span>
                  <span className={styles.pixCardKeyValue}>{CONFIG.pixKey}</span>
                </div>
              </div>
              <p className={styles.pixCardWarning}>⚠️ Após pagar, avance e envie o comprovante</p>
            </div>

            <div className={`${styles.actionBar} ${styles['actionBar--split']}`}>
              <Button
                variant="ghost"
                onClick={() => {
                  setStep(2)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                ← Voltar
              </Button>
              <Button onClick={() => {
                setStep(4)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}>
                Enviar Comprovante →
              </Button>
            </div>
          </section>
        )}

        {/* Step 4 - Receipt */}
        {step === 4 && (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Comprovante</h2>
              <p className={styles.sectionDesc}>Anexe o comprovante do pagamento PIX</p>
            </div>

            <label className={`${styles.upload} ${receipt ? styles['upload--filled'] : ''}`} htmlFor="receipt-file">
              {!receipt ? (
                <div className={styles.uploadEmpty}>
                  <span className={styles.uploadIco}>📎</span>
                  <p className={styles.uploadText}>Toque para selecionar o comprovante</p>
                  <p className={styles.uploadHint}>JPG, PNG ou PDF aceitos</p>
                </div>
              ) : (
                <div className={styles.uploadFilledInner}>
                  {receipt.startsWith('data:image') ? (
                    <img src={receipt} className={styles.uploadPreviewImg} alt="Comprovante" />
                  ) : (
                    <div className={styles.uploadPdfPreview}>
                      <span className={styles.uploadPdfIco}>📄</span>
                      <span className={styles.uploadPdfName}>{receiptFileName}</span>
                    </div>
                  )}
                  <span className={styles.uploadChangeHint}>Toque para trocar</span>
                </div>
              )}
            </label>
            <input
              id="receipt-file"
              type="file"
              className={styles.uploadInput}
              accept="image/*,.pdf"
              onChange={handleReceiptChange}
            />

            <div className={`${styles.actionBar} ${styles['actionBar--split']}`}>
              <Button
                variant="ghost"
                onClick={() => {
                  setStep(3)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                ← Voltar
              </Button>
              <Button variant="success" disabled={!receipt} onClick={handleFinalize}>
                🚀 Finalizar Agendamento
              </Button>
            </div>
          </section>
        )}

        {/* Step 5 - Confirmation */}
        {step === 5 && (
          <section className={`${styles.section} ${styles['section--confirm']}`}>
            <div className={styles.confirm}>
              <div className={styles.confirmEmoji}>🎊</div>
              <h2 className={styles.confirmTitle}>Pedido Enviado!</h2>
              <p className={styles.confirmText}>
                Seu agendamento foi enviado para o WhatsApp do salão. Aguarde a confirmação em
                breve!
              </p>
              <div className={styles.confirmCard}>
                <div className={styles.confirmRow}>
                  <span>📅 Data</span>
                  <strong>{formattedDate}</strong>
                </div>
                <div className={styles.confirmRow}>
                  <span>⏰ Horário</span>
                  <strong>{currentSlot?.time}</strong>
                </div>
                <div className={styles.confirmRow}>
                  <span>💰 Total</span>
                  <strong>{formatCurrency(totalPrice)}</strong>
                </div>
                <div className={styles.confirmRow}>
                  <span>🆔 Código</span>
                  <strong>#{bookingId}</strong>
                </div>
              </div>
              <p className={styles.confirmHint}>
                📱 Uma janela do WhatsApp foi aberta. <strong>Não esqueça de enviar o comprovante em anexo!</strong>
              </p>
              <Button full onClick={handleReset}>
                + Nova Reserva
              </Button>
            </div>
          </section>
        )}
      </main>
    </>
  )
}
