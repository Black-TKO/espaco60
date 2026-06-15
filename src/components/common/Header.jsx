import React from 'react'
import { Link } from 'react-router-dom'
import { FaCalendar } from 'react-icons/fa'
import styles from './Header.module.css'
import { CONFIG } from '../../config'

export const Header = ({ isAdmin = false }) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to={isAdmin ? '/admin/dashboard' : '/'} className={styles.headerBrand}>
          <div className={styles.headerLogo}>
            <FaCalendar size={28} />
          </div>
          <div className={styles.brandText}>
            <h1 className={styles.headerName}>{CONFIG.salonName}</h1>
            {!isAdmin && <span className={styles.headerTagline}>Agendamento Online</span>}
            {isAdmin && <span className={styles.headerTagline}>Painel Administrativo</span>}
          </div>
        </Link>
        <div className={styles.headerActions}>
          {!isAdmin && (
            <Link to="/admin" className={styles.headerAdminLink}>
              Painel Admin
            </Link>
          )}
          {isAdmin && (
            <Link to="/" className={styles.headerAdminLink}>
              Ver Site
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
