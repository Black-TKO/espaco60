import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CONFIG } from '../config/config.js';
import { getBookings, saveBookings, formatCurrency, formatDateDisplay, formatDateTime, statusLabel } from '../utils/helpers';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { Icons } from '../components/Icons/Icons.jsx';
import { Logo } from '../components/Logo/Logo.jsx';
import PricingEditor from '../components/PricingEditor';
import { getPricing } from '../utils/helpers';
import "../styles/PricingEditor.scss";


const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const FILTERS = [
  { label: 'Todos', value: 'all' },
  { label: 'Pendentes', value: 'pending' },
  { label: 'Confirmados', value: 'confirmed' },
  { label: 'Concluídos', value: 'completed' },
  { label: 'Cancelados', value: 'cancelled' },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();
  const now = new Date();

  // Bookings state & controls
  const [bookings, setBookings] = useState(() => getBookings());
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [revenueMonth, setRevenueMonth] = useState(now.getMonth());
  const [revenueYear, setRevenueYear] = useState(now.getFullYear());
  const [receiptModal, setReceiptModal] = useState(null);

  const years = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

  function persist(next) {
    setBookings(next);
    saveBookings(next);
  }

  function updateStatus(id, status) {
    const next = bookings.map(b => b.id === id ? { ...b, status } : b);
    persist(next);
    showToast(`Status atualizado para "${statusLabel(status)}"`, 'success');
  }

  function confirmCancel(id) {
    if (window.confirm('Cancelar este agendamento?')) updateStatus(id, 'cancelled');
  }

  function confirmDelete(id) {
    if (window.confirm('Excluir permanentemente? Essa ação não pode ser desfeita.')) {
      persist(bookings.filter(b => b.id !== id));
      showToast('Agendamento excluído.', 'info');
    }
  }

  function sumRevenue(year, month) {
    return bookings
      .filter(b => { if (b.status === 'cancelled') return false; const [y,m] = (b.date||'').split('-').map(Number); return y===year && m===month; })
      .reduce((s, b) => s + (b.price || 0), 0);
  }

  const totalBookings = bookings.length;
  const monthRevenue = sumRevenue(now.getFullYear(), now.getMonth() + 1);
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const upcomingCount = bookings.filter(b => {
    if (b.status === 'cancelled') return false;
    return new Date(b.date + 'T00:00:00').getTime() >= new Date().setHours(0,0,0,0);
  }).length;

  const selectedMonthRevenue = sumRevenue(revenueYear, revenueMonth + 1);

  const revenueByStatus = useMemo(() => {
    const res = { pending: 0, confirmed: 0, completed: 0 };
    bookings.forEach(b => {
      if (b.status === 'cancelled') return;
      const [y, m] = (b.date || '').split('-').map(Number);
      if (y !== revenueYear || m !== revenueMonth + 1) return;
      if (res[b.status] !== undefined) res[b.status] += (b.price || 0);
    });
    return res;
  }, [bookings, revenueYear, revenueMonth]);

  const filteredBookings = useMemo(() => {
    let list = [...bookings];
    if (activeFilter !== 'all') list = list.filter(b => b.status === activeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(b =>
        (b.customerName || '').toLowerCase().includes(q) ||
        (b.customerPhone || '').includes(q) ||
        (b.id || '').includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [bookings, activeFilter, searchQuery]);

  const exportBookings = useMemo(() =>
    bookings.filter(b => {
      if (b.status === 'cancelled') return false;
      const [y,m] = (b.date||'').split('-').map(Number);
      return y === revenueYear && m === revenueMonth + 1;
    }).sort((a,b) => a.date.localeCompare(b.date)),
    [bookings, revenueYear, revenueMonth]
  );

  async function exportPDF() {
    try {
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default?.jsPDF || jsPDFModule.default || jsPDFModule;
      const autoTableModule = await import('jspdf-autotable');
      const autoTable = autoTableModule.default || autoTableModule;
      try {
        if (typeof autoTable === 'function' && typeof jsPDF === 'function') {
          autoTable(jsPDF);
        }
      } catch (regErr) {
        console.warn('Registro do jspdf-autotable falhou (pode ser ok):', regErr);
      }
      const doc = new jsPDF({ orientation: 'landscape' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(194, 24, 91);
      doc.text(CONFIG.salonName, 14, 18);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.text(`Extrato — ${MONTHS[revenueMonth]} ${revenueYear}`, 14, 28);
      doc.text(`Faturamento: ${formatCurrency(selectedMonthRevenue)}`, 14, 36);

      const rows = exportBookings.map(b => [
        `#${String(b.id || '').slice(-8)}`,
        b.customerName || '—',
        b.customerPhone || '—',
        formatDateDisplay(b.date),
        b.timeSlot || '—',
        b.slotLabel || '—',
        String(b.people || 0),
        formatCurrency(b.price || 0),
        statusLabel(b.status),
        formatDateTime(b.createdAt),
      ]);

      const tableOptions = {
        startY: 44,
        head: [['ID','Nome','Telefone','Data','Horário','Turno','Convidados','Valor','Status','Criado em']],
        body: rows,
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [194, 24, 91], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [252, 228, 236] },
      };

      if (typeof doc.autoTable === 'function') {
        doc.autoTable(tableOptions);
      } else if (typeof autoTable === 'function') {
        try {
          autoTable(doc, tableOptions);
        } catch (innerErr) {
          console.error('autoTable fallback failed:', innerErr);
          throw innerErr;
        }
      } else {
        throw new Error('doc.autoTable não disponível e plugin não exportou função utilizável.');
      }

      doc.save(`agendamentos-${MONTHS[revenueMonth]}-${revenueYear}.pdf`);
      showToast('PDF exportado!', 'success');
    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
      showToast('Erro ao exportar PDF. Veja o console para mais detalhes.', 'error');
    }
  }

  async function exportExcel() {
    try {
      const XLSX = await import('xlsx');
      const wb = XLSX.utils.book_new();
      const header = ['ID','Nome','Telefone','Data','Horário','Turno','Convidados','Valor (R$)','Status','Criado em'];
      const rows = exportBookings.map(b => [
        `#${b.id.slice(-8)}`, b.customerName||'', b.customerPhone||'',
        formatDateDisplay(b.date), b.timeSlot||'', b.slotLabel||'',
        b.people||0, b.price||0, statusLabel(b.status), formatDateTime(b.createdAt),
      ]);
      const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
      ws['!cols'] = [10,26,18,12,18,14,12,14,14,22].map(wch => ({ wch }));
      XLSX.utils.book_append_sheet(wb, ws, 'Agendamentos');
      XLSX.writeFile(wb, `agendamentos-${MONTHS[revenueMonth]}-${revenueYear}.xlsx`);
      showToast('Excel exportado!', 'success');
    } catch { showToast('Erro ao exportar Excel.', 'error'); }
  }

  async function exportImage() {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const el = document.getElementById('export-table');
      if (!el) return;
      showToast('Gerando imagem...', 'info');
      const canvas = await html2canvas(el, { backgroundColor: '#FFFFFF', scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = `agendamentos-${MONTHS[revenueMonth]}-${revenueYear}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Imagem exportada!', 'success');
    } catch { showToast('Erro ao exportar imagem.', 'error'); }
  }

  function handleLogout() {
    sessionStorage.removeItem('adminAuth');
    navigate('/admin/login', { replace: true });
  }

  return (
    <>
      <header className="admin-header">
        <div className="admin-header__inner">
          <div className="admin-header__brand">
            <span className="admin-header__logo header__logo"><Logo /></span>
            <div>
              <h1 className="admin-header__title">{CONFIG.salonName}</h1>
              <span className="admin-header__role">Painel Administrativo</span>
            </div>
          </div>
          <div className="admin-header__actions">
            <Link to="/" className="admin-header__link">Ver Site</Link>
            <button className="btn btn--ghost btn--sm" onClick={handleLogout}>Sair</button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {/* Stats */}
        <section className="stats">
          <div className="stat-card stat-card--purple">
            <span className="stat-card__icon"><Icons.User /></span>
            <div className="stat-card__body">
              <span className="stat-card__value">{totalBookings}</span>
              <span className="stat-card__label">Total de Reservas</span>
            </div>
          </div>
          <div className="stat-card stat-card--green">
            <span className="stat-card__icon"><Icons.Cart /></span>
            <div className="stat-card__body">
              <span className="stat-card__value">{formatCurrency(monthRevenue)}</span>
              <span className="stat-card__label">Faturamento do Mês</span>
            </div>
          </div>
          <div className="stat-card stat-card--orange">
            <span className="stat-card__icon"><Icons.Clock /></span>
            <div className="stat-card__body">
              <span className="stat-card__value">{pendingCount}</span>
              <span className="stat-card__label">Pendentes</span>
            </div>
          </div>
          <div className="stat-card stat-card--blue">
            <span className="stat-card__icon"><Icons.Calendar /></span>
            <div className="stat-card__body">
              <span className="stat-card__value">{upcomingCount}</span>
              <span className="stat-card__label">Próximas</span>
            </div>
          </div>
        </section>

        {/* Revenue */}
        <section className="revenue-section">
          <div className="revenue-section__head">
            <h2 className="admin-title">Faturamento Mensal</h2>
            <div className="revenue-section__controls">
              <select className="select" value={revenueMonth} onChange={e => setRevenueMonth(Number(e.target.value))}>
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <select className="select" value={revenueYear} onChange={e => setRevenueYear(Number(e.target.value))}>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div className="revenue-cards">
            <div className="rev-card"><span className="rev-card__label">Confirmados</span><strong className="rev-card__val">{formatCurrency(revenueByStatus.confirmed)}</strong></div>
            <div className="rev-card"><span className="rev-card__label">Concluídos</span><strong className="rev-card__val">{formatCurrency(revenueByStatus.completed)}</strong></div>
            <div className="rev-card"><span className="rev-card__label">Pendentes</span><strong className="rev-card__val">{formatCurrency(revenueByStatus.pending)}</strong></div>
            <div className="rev-card rev-card--total"><span className="rev-card__label">Total do Mês</span><strong className="rev-card__val">{formatCurrency(selectedMonthRevenue)}</strong></div>
          </div>
          <div className="export-bar">
            <span className="export-bar__label">Exportar extrato:</span>
            <button className="btn-export btn-export--pdf" onClick={exportPDF}><Icons.File /> <span>PDF</span></button>
            <button className="btn-export btn-export--xls" onClick={exportExcel}><Icons.Clip /> <span>Excel</span></button>
            <button className="btn-export btn-export--img" onClick={exportImage}><Icons.Image /> <span>Imagem</span></button>
          </div>
        </section>

	{/* Pricing editor */}
	<section className="pricing-section">
	  <h2 className="admin-title">Configurações de Preço</h2>
	  <PricingEditor />
	</section>

        {/* Bookings */}
        <section className="bookings-section" id="export-table">
          <div className="bookings-section__head">
            <h2 className="admin-title">Agendamentos</h2>
            <input className="search-input" type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Buscar por nome..." />
          </div>
          <div className="filter-tabs">
            {FILTERS.map(f => (
              <button key={f.value} className={`filter-tab${activeFilter === f.value ? ' filter-tab--active' : ''}`} onClick={() => setActiveFilter(f.value)}>
                {f.label}
                <span className="filter-tab__badge">
                  {f.value === 'all' ? bookings.length : bookings.filter(b => b.status === f.value).length}
                </span>
              </button>
            ))}
          </div>
          {filteredBookings.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state__ico"><Icons.File /></span>
              <p className="empty-state__text">Nenhum agendamento encontrado.</p>
            </div>
          ) : (
            <div className="booking-cards">
              {filteredBookings.map(b => (
                <div key={b.id} className="booking-card">
                  <div className="booking-card__header">
                    <div className="booking-card__customer">
                      <strong className="booking-card__name">{b.customerName}</strong>
                      <span className="booking-card__phone">{b.customerPhone}</span>
                    </div>
                    <span className={`booking-card__badge booking-card__badge--${b.status}`}>{statusLabel(b.status)}</span>
                  </div>
                  <div className="booking-card__details">
                    <div className="booking-card__detail"><span className="booking-card__detail-ico"><Icons.Calendar /></span><span>{formatDateDisplay(b.date)}</span></div>
                    <div className="booking-card__detail"><span className="booking-card__detail-ico"><Icons.Clock /></span><span>{b.timeSlot}</span></div>
                    <div className="booking-card__detail"><span className="booking-card__detail-ico"><Icons.User /></span><span>{b.people} convidados</span></div>
                    <div className="booking-card__detail"><span className="booking-card__detail-ico"><Icons.Cart /></span><span><strong>{formatCurrency(b.price)}</strong></span></div>
                  </div>
                  {b.customerNotes && <div className="booking-card__notes"><Icons.Clip /> {b.customerNotes}</div>}
                  <div className="booking-card__meta">
                    <span className="booking-card__id">#{b.id}</span>
                    <span className="booking-card__created">{formatDateTime(b.createdAt)}</span>
                  </div>
                  {b.receipt && (
                    <div className="booking-card__receipt">
                      <button className="btn-link" onClick={() => setReceiptModal(b)}><Icons.Clip /> Ver Comprovante</button>
                    </div>
                  )}
                  <div className="booking-card__actions">
                    {b.status === 'pending' && <button className="btn-action btn-action--confirm" onClick={() => updateStatus(b.id, 'confirmed')}><Icons.Check /> ✓ Confirmar</button>}
                    {b.status === 'confirmed' && <button className="btn-action btn-action--complete" onClick={() => updateStatus(b.id, 'completed')}><Icons.Check /> 🏁 Concluir</button>}
                    {b.status !== 'cancelled' && b.status !== 'completed' && <button className="btn-action btn-action--cancel" onClick={() => confirmCancel(b.id)}><Icons.X /> ✕ Cancelar</button>}
                    <button className="btn-action btn-action--delete" onClick={() => confirmDelete(b.id)}><Icons.Trash /> 🗑 Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Receipt Modal */}
      {receiptModal && (
        <div className="modal" onClick={e => e.target === e.currentTarget && setReceiptModal(null)}>
          <div className="modal__box">
            <button className="modal__close" onClick={() => setReceiptModal(null)}><Icons.X /></button>
            <h3 className="modal__title">Comprovante de Pagamento</h3>
            <p className="modal__sub">{receiptModal.customerName} – {formatCurrency(receiptModal.price)}</p>
            {receiptModal.receipt?.startsWith('data:image')
              ? <img src={receiptModal.receipt} className="modal__img" alt="Comprovante" />
              : <p className="modal__pdf-msg"><Icons.File /> Arquivo PDF – não é possível pré-visualizar aqui.</p>
            }
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </>
  );
}
