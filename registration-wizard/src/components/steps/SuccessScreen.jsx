import { CheckCircle } from 'lucide-react'

export default function SuccessScreen({ onReset }) {
  return (
    <div className="success-screen step-enter">
      <div className="success-icon">
        <CheckCircle size={40} color="#2ecc71" strokeWidth={1.5} />
      </div>

      <h2 className="success-title">YOU'RE IN!</h2>

      <p className="success-subtitle">
        Your account has been created successfully. Welcome to the platform — we're glad to have you.
      </p>

      <button className="btn btn-primary" onClick={onReset} style={{ margin: '0 auto' }}>
        Start Over
      </button>
    </div>
  )
}
