import { useState } from 'react';
import { CONFIG } from '../config';
import { getBookings, saveBookings, generateQRCodeSvg } from '../utils/helpers';

export function useBooking() {
  const [step, setStep] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [peopleCount, setPeopleCount] = useState(50);
  const [customerNotes, setCustomerNotes] = useState('');
  const [pixCopied, setPixCopied] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [receiptFileName, setReceiptFileName] = useState('');
  const [isImageFile, setIsImageFile] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const qrCodeSvg = generateQRCodeSvg(CONFIG.pixKey);

  const nextStep = () => {
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToStep = (n) => {
    if (n < step) {
      setStep(n);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevMonth = () => {
    const now = new Date();
    const isCurrentMonth = currentYear === now.getFullYear() && currentMonth === now.getMonth();
    if (isCurrentMonth) return;
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
    setSelectedDate(null);
  };

  const handleDayClick = (d) => {
    if (d.empty || d.isPast || d.isClosed || d.isFullyBooked) return;
    setSelectedDate(d.dateStr);
    setSelectedSlot(null);
  };

  const formattedDate = selectedDate
    ? (() => { const [y, m, d] = selectedDate.split('-'); return `${d}/${m}/${y}`; })()
    : '';

  const currentSlot = CONFIG.timeSlots.find(s => s.id === selectedSlot) || null;
  const totalPrice = currentSlot ? currentSlot.price : 0;

  const canStep2 = !!(
    selectedSlot &&
    customerName.trim() &&
    customerPhone.trim().length >= 14 &&
    peopleCount > 0
  );

  const copyPix = (showToast) => {
    navigator.clipboard.writeText(CONFIG.pixKey).then(() => {
      setPixCopied(true);
      showToast('Chave PIX copiada!', 'success');
      setTimeout(() => setPixCopied(false), 3000);
    }).catch(() => {
      showToast('Não foi possível copiar. Copie manualmente.', 'error');
    });
  };

  const onReceiptChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReceiptFileName(file.name);
    setIsImageFile(file.type.startsWith('image/'));
    const reader = new FileReader();
    reader.onload = ev => setReceipt(ev.target.result);
    reader.readAsDataURL(file);
  };

  const finalize = () => {
    const id = Date.now().toString();
    setBookingId(id);

    const booking = {
      id,
      date:          selectedDate,
      timeSlot:      currentSlot?.time,
      slotLabel:     currentSlot?.label,
      slotId:        selectedSlot,
      people:        peopleCount,
      price:         totalPrice,
      customerName,
      customerPhone,
      customerNotes,
      status:        'pending',
      createdAt:     new Date().toISOString(),
      receipt,
      receiptFileName,
    };

    const all = getBookings();
    all.push(booking);
    saveBookings(all);

    const lines = [
      `🎉 *NOVO AGENDAMENTO – ${CONFIG.salonName}*`,
      ``,
      `👤 *Nome:* ${booking.customerName}`,
      `📞 *WhatsApp:* ${booking.customerPhone}`,
      `📅 *Data:* ${formattedDate}`,
      `⏰ *Horário:* ${booking.timeSlot} (${booking.slotLabel})`,
      `👥 *Convidados:* ${booking.people} pessoas`,
      `💰 *Valor:* R$ ${Number(totalPrice).toFixed(2).replace('.', ',')},`,
      booking.customerNotes ? `📝 *Obs.:* ${booking.customerNotes}` : null,
      ``,
      `✅ Comprovante de pagamento enviado em anexo`,
      `🆔 *Código:* #${id}`,
      ``,
      `_Agendado em: ${new Date().toLocaleString('pt-BR')}_`,
    ].filter(l => l !== null).join('\n');

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(lines)}`;
    window.open(url, '_blank');

    setStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetApp = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedSlot(null);
    setCustomerName('');
    setCustomerPhone('');
    setPeopleCount(50);
    setCustomerNotes('');
    setReceipt(null);
    setReceiptFileName('');
    setBookingId('');
    setCurrentMonth(new Date().getMonth());
    setCurrentYear(new Date().getFullYear());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    step, currentMonth, currentYear, selectedDate, selectedSlot,
    customerName, setCustomerName,
    customerPhone, setCustomerPhone,
    peopleCount, setPeopleCount,
    customerNotes, setCustomerNotes,
    pixCopied, receipt, receiptFileName, isImageFile,
    bookingId, qrCodeSvg,
    nextStep, prevStep, goToStep,
    prevMonth, nextMonth, handleDayClick,
    setSelectedSlot,
    formattedDate, currentSlot, totalPrice, canStep2,
    copyPix, onReceiptChange, finalize, resetApp,
  };
}
