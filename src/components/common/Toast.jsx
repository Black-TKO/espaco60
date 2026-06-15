import React from 'react'
import { useToast } from '../../context/ToastContext'
import styles from './Toast.module.css'

export const Toast = () => {
  const { toast } = useToast()

  if (!toast) return null

  return (
    <div className={`${styles.toast} ${styles[`toast--${toast.type}`]}`}>
      {toast.message}
    </div>
  )
}
