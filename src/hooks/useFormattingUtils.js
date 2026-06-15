export const useFormattingUtils = () => {
  const formatCurrency = (value) => {
    return `R$ ${Number(value || 0)
      .toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}/${y}`
  }

  const formatDateTime = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPhone = (value) => {
    let v = value.replace(/\D/g, '')
    if (v.length > 11) v = v.slice(0, 11)
    if (v.length > 6) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`
    else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`
    else if (v.length > 0) v = `(${v}`
    return v
  }

  return {
    formatCurrency,
    formatDate,
    formatDateTime,
    formatPhone,
  }
}
