import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import styles from './Stepper.module.css'

const STEPS = [
  { label: 'Data' },
  { label: 'Horário' },
  { label: 'Pagamento' },
  { label: 'Comprovan.' },
]

export const Stepper = ({ currentStep }) => {
  return (
    <nav className={styles.stepper}>
      <div className={styles.stepperTrack}>
        {STEPS.map((step, index) => {
          const stepNumber = index + 1
          const isActive = currentStep === stepNumber
          const isDone = currentStep > stepNumber

          return (
            <React.Fragment key={index}>
              <div
                className={`${styles.stepperStep} ${
                  isActive ? styles['stepperStep--active'] : ''
                } ${isDone ? styles['stepperStep--done'] : ''}`}
              >
                <div className={styles.stepperCircle}>
                  {isDone ? (
                    <FaCheckCircle size={16} />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                <span className={styles.stepperLabel}>{step.label}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`${styles.stepperLine} ${
                    isDone ? styles['stepperLine--done'] : ''
                  }`}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </nav>
  )
}
