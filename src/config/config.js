/* ============================================================
   CONFIGURAÇÃO — Altere conforme necessário
   ============================================================ */
// src/config/config.js
// Lê configurações de runtime/build a partir das variáveis de ambiente do Vite (import.meta.env)
// Valores padrão são usados caso a variável não esteja definida.

function parseClosedDays(envValue) {
  if (!envValue) return [0]; // domingo por padrão
  return envValue.split(',').map(s => {
    const n = Number(s.trim());
    return Number.isFinite(n) ? n : 0;
  });
}

function normalizePhone(v) {
  if (!v) return '';
  // remove tudo que não for dígito
  return String(v).replace(/\D/g, '');
}

export const CONFIG = {
  salonName:      import.meta.env.VITE_SALON_NAME || 'Espaço da 60',
  whatsappNumber: normalizePhone(import.meta.env.VITE_WHATSAPP_NUMBER || '5521999999999'),
  pixKey:         import.meta.env.VITE_PIX_KEY || '(21) 99999-9999',
  pixKeyType:     import.meta.env.VITE_PIX_KEY_TYPE || 'Telefone',
  adminPassword:  import.meta.env.VITE_ADMIN_PASSWORD || 'admin2024',
  closedDays:     parseClosedDays(import.meta.env.VITE_CLOSED_DAYS),
  // timeSlots continuam vindo de src/data/timeSlots.json
};
