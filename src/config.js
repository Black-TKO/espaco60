/* ============================================================
   CONFIGURAÇÃO — Altere conforme necessário
   ============================================================ */
export const CONFIG = {
  salonName:      'Espaço da 60',
  whatsappNumber: '5521999999999',      // 55 + DDD + número (sem espaços/símbolos)
  pixKey:         '(21) 99999-9999',    // Sua chave PIX
  pixKeyType:     'Telefone',           // Telefone | CPF | E-mail | Aleatória
  adminPassword:  'admin2024',          // ⚠️  Altere esta senha!
  closedDays:     [0],                  // 0=Dom, 6=Sáb  (dias sem atendimento)
  timeSlots: [
    { id: 1, label: 'Manhã',        time: '09:00 – 13:00', price: 800,  icon: '🌅' },
    { id: 2, label: 'Tarde',        time: '14:00 – 18:00', price: 800,  icon: '☀️'  },
    { id: 3, label: 'Noite',        time: '19:00 – 23:00', price: 1000, icon: '🌙' },
    { id: 4, label: 'Dia Completo', time: '09:00 – 23:00', price: 2200, icon: '✨' },
  ],
};
