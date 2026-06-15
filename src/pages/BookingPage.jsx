import Header from '../components/Header';
import Stepper from '../components/Stepper';
import Toast from '../components/Toast';
import Step1Date from '../components/Step1Date';
import Step2Slots from '../components/Step2Slots';
import Step3Payment from '../components/Step3Payment';
import Step4Receipt from '../components/Step4Receipt';
import Step5Confirm from '../components/Step5Confirm';
import { useBooking } from '../hooks/useBooking';
import { useToast } from '../hooks/useToast';

export default function BookingPage() {
  const booking = useBooking();
  const { toast, showToast } = useToast();

  return (
    <>
      <Header />
      <Stepper step={booking.step} goToStep={booking.goToStep} />
      <main className="main">
        {booking.step === 1 && (
          <Step1Date
            currentMonth={booking.currentMonth}
            currentYear={booking.currentYear}
            selectedDate={booking.selectedDate}
            formattedDate={booking.formattedDate}
            onDayClick={booking.handleDayClick}
            onPrevMonth={booking.prevMonth}
            onNextMonth={booking.nextMonth}
            nextStep={booking.nextStep}
          />
        )}
        {booking.step === 2 && (
          <Step2Slots
            selectedDate={booking.selectedDate}
            selectedSlot={booking.selectedSlot}
            setSelectedSlot={booking.setSelectedSlot}
            formattedDate={booking.formattedDate}
            customerName={booking.customerName}
            setCustomerName={booking.setCustomerName}
            customerPhone={booking.customerPhone}
            setCustomerPhone={booking.setCustomerPhone}
            peopleCount={booking.peopleCount}
            setPeopleCount={booking.setPeopleCount}
            customerNotes={booking.customerNotes}
            setCustomerNotes={booking.setCustomerNotes}
            canStep2={booking.canStep2}
            nextStep={booking.nextStep}
            prevStep={booking.prevStep}
          />
        )}
        {booking.step === 3 && (
          <Step3Payment
            formattedDate={booking.formattedDate}
            currentSlot={booking.currentSlot}
            customerName={booking.customerName}
            customerPhone={booking.customerPhone}
            peopleCount={booking.peopleCount}
            customerNotes={booking.customerNotes}
            totalPrice={booking.totalPrice}
            qrCodeSvg={booking.qrCodeSvg}
            pixCopied={booking.pixCopied}
            copyPix={booking.copyPix}
            showToast={showToast}
            nextStep={booking.nextStep}
            prevStep={booking.prevStep}
          />
        )}
        {booking.step === 4 && (
          <Step4Receipt
            receipt={booking.receipt}
            receiptFileName={booking.receiptFileName}
            isImageFile={booking.isImageFile}
            onReceiptChange={booking.onReceiptChange}
            finalize={booking.finalize}
            prevStep={booking.prevStep}
          />
        )}
        {booking.step === 5 && (
          <Step5Confirm
            formattedDate={booking.formattedDate}
            currentSlot={booking.currentSlot}
            totalPrice={booking.totalPrice}
            bookingId={booking.bookingId}
            resetApp={booking.resetApp}
          />
        )}
      </main>
      <Toast toast={toast} />
    </>
  );
}
