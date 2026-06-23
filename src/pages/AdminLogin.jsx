import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CONFIG } from '../config/index.js';

export default function AdminLogin() {
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  function doLogin() {
    if (loginPassword === CONFIG.adminPassword) {
      sessionStorage.setItem('adminAuth', '1');
      setLoginError(false);
      setLoginPassword('');
      navigate(from, { replace: true });
    } else {
      setLoginError(true);
      setLoginPassword('');
    }
  }

  return (
    <div className="login-screen">
      <div className="login">
        <div className="login__logo">🔐</div>
        <h1 className="login__title">Painel Admin</h1>
        <p className="login__sub">Acesso restrito ao proprietário</p>
        <div className="login__form">
          <input
            className="login__input"
            type="password"
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
            placeholder="Senha de acesso"
            onKeyDown={e => e.key === 'Enter' && doLogin()}
          />
          <button className="btn btn--primary btn--full" onClick={doLogin}>Entrar</button>
          {loginError && <p className="login__error">Senha incorreta. Tente novamente.</p>}
        </div>
        <Link to="/" className="login__back">← Voltar ao site</Link>
      </div>
    </div>
  );
}
