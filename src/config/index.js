export const CONFIG = {
  salonName: 'Agendamento Online Espaço da 60',
  whatsappNumber: '5521999999999',
  pixKey: '(21) 99999-9999',
  pixKeyType: 'Telefone',
  adminPassword: 'admin2024',
  closedDays: [0],
  timeSlots: [
    { id: 1, label: 'Manhã', time: '09:00 – 13:00', price: 800 },
    { id: 2, label: 'Tarde', time: '14:00 – 18:00', price: 800 },
    { id: 3, label: 'Noite', time: '19:00 – 23:00', price: 1000 },
    { id: 4, label: 'Dia Completo', time: '09:00 – 23:00', price: 2200 },
  ],
}

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}
