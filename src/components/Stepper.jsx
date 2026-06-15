const STEPS = [
  { icon: '📅', label: 'Data' },
  { icon: '⏰', label: 'Horário' },
  { icon: '🛒', label: 'Pagamento' },
  { icon: '📎', label: 'Comprovan.' },
];

export default function Stepper({ step, goToStep }) {
  if (step >= 5) return null;
  return (
    <nav className="stepper">
      <div className="stepper__track">
        {STEPS.map((s, i) => (
          <>
            <div
              key={i}
              className={`stepper__step${step === i + 1 ? ' stepper__step--active' : ''}${step > i + 1 ? ' stepper__step--done' : ''}`}
              onClick={() => step > i + 1 ? goToStep(i + 1) : null}
            >
              <div className="stepper__circle">
                {step > i + 1
                  ? <span className="stepper__check">✓</span>
                  : <span className="stepper__icon">{s.icon}</span>
                }
              </div>
              <span className="stepper__label">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div key={`line-${i}`} className={`stepper__line${step > i + 1 ? ' stepper__line--done' : ''}`} />
            )}
          </>
        ))}
      </div>
    </nav>
  );
}
