const STEPS = [
  { label: 'Personal Info' },
  { label: 'Account Details' },
  { label: 'Review & Submit' },
]

export default function ProgressBar({ currentStep }) {
  // currentStep is 1-indexed
  const pct = ((currentStep - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="progress-header">
      <p className="progress-label">Step {currentStep} of {STEPS.length}</p>
      <h2 className="progress-title">{STEPS[currentStep - 1].label}</h2>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="progress-steps">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`progress-step-dot ${
              i + 1 === currentStep ? 'active' :
              i + 1 <  currentStep ? 'done'   : ''
            }`}
          />
        ))}
      </div>
    </div>
  )
}
