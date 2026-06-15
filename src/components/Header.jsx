import { Link } from 'react-router-dom';
import { CONFIG } from '../config';

export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          <div className="header__logo">🎉</div>
          <div className="header__brand-text">
            <h1 className="header__name">{CONFIG.salonName}</h1>
            <span className="header__tagline">Agendamento Online</span>
          </div>
        </div>
        <Link to="/admin" className="header__admin-link">Painel Admin</Link>
      </div>
    </header>
  );
}
