import React from 'react'
import styles from './Button.module.css'

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  full = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClass = styles.btn
  const variantClass = styles[`btn--${variant}`]
  const sizeClass = styles[`btn--${size}`]
  const fullClass = full ? styles['btn--full'] : ''

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClass} ${variantClass} ${sizeClass} ${fullClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
