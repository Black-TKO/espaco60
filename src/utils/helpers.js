export function formatCurrency(v) {
  return `R$ ${Number(v || 0)
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

export function formatDateDisplay(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function phoneMask(value) {
  let v = value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 6)  v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
  else if (v.length > 0) v = `(${v}`;
  return v;
}

export function getBookings() {
  try { return JSON.parse(localStorage.getItem('salonBookings') || '[]'); }
  catch { return []; }
}

export function saveBookings(bookings) {
  localStorage.setItem('salonBookings', JSON.stringify(bookings));
}

export function isDateFull(dateStr, bookings, timeSlots) {
  const occupied = bookings.filter(
    b => b.date === dateStr && b.status !== 'cancelled'
  ).map(b => b.timeSlot);
  return timeSlots.every(s => occupied.includes(s.time));
}

export function statusLabel(status) {
  const map = {
    pending:   'Pendente',
    confirmed: 'Confirmado',
    completed: 'Concluído',
    cancelled: 'Cancelado',
  };
  return map[status] || status;
}

export function generateQRCodeSvg(pixKey) {
  const M = 21;
  const C = 8;
  const PAD = 12;

  const g = Array.from({ length: M }, () => new Array(M).fill(false));

  const finder = (r0, c0) => {
    for (let dr = 0; dr < 7; dr++) {
      for (let dc = 0; dc < 7; dc++) {
        const r = r0 + dr, c = c0 + dc;
        if (r < M && c < M) {
          const border = dr === 0 || dr === 6 || dc === 0 || dc === 6;
          const inner  = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
          g[r][c] = border || inner;
        }
      }
    }
  };
  finder(0, 0);
  finder(0, 14);
  finder(14, 0);

  for (let i = 8; i <= 12; i++) {
    g[6][i] = i % 2 === 0;
    g[i][6] = i % 2 === 0;
  }
  g[13][8] = true;

  let seed = 0;
  for (const ch of pixKey)
    seed = ((seed * 31) + ch.charCodeAt(0)) >>> 0;
  const rand = () => {
    seed = ((seed * 1664525) + 1013904223) >>> 0;
    return (seed >>> 0) / 0x100000000;
  };

  for (let r = 0; r < M; r++) {
    for (let c = 0; c < M; c++) {
      const inTL = r < 9 && c < 9;
      const inTR = r < 9 && c >= 13;
      const inBL = r >= 13 && c < 9;
      if (inTL || inTR || inBL || r === 6 || c === 6 || g[r][c]) continue;
      g[r][c] = rand() > 0.52;
    }
  }

  const rects = [];
  for (let r = 0; r < M; r++) {
    for (let c = 0; c < M; c++) {
      if (g[r][c]) {
        rects.push(`<rect x="${c * C + PAD}" y="${r * C + PAD}" width="${C}" height="${C}"/>`);
      }
    }
  }

  const size = M * C + PAD * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="190" height="190">
  <rect width="${size}" height="${size}" fill="white" rx="10"/>
  <g fill="#1C0A00">${rects.join('')}</g>
</svg>`;
}
