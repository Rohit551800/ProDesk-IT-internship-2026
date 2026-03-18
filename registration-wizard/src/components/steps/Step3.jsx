import { ArrowLeft, Send } from 'lucide-react'

function ReviewItem({ label, value }) {
  return (
    <div className="review-item">
      <span className="review-item-label">{label}</span>
      <span className="review-item-value">{value}</span>
    </div>
  )
}

export default function Step3({ data, onBack, onSubmit }) {
  const handleSubmit = () => {
    const payload = {
      firstName:    data.firstName,
      lastName:     data.lastName,
      dateOfBirth:  data.dateOfBirth,
      email:        data.email,
      password:     data.password,
    }
    console.log('✅ Registration Payload:', payload)
    onSubmit()
  }

  const formatDate = (d) => {
    if (!d) return '—'
    const date = new Date(d)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="step-enter">
      <div className="review-section">
        <p className="review-section-title">Personal Info</p>
        <ReviewItem label="First Name"    value={data.firstName || '—'} />
        <ReviewItem label="Last Name"     value={data.lastName  || '—'} />
        <ReviewItem label="Date of Birth" value={formatDate(data.dateOfBirth)} />
      </div>

      <div className="review-section">
        <p className="review-section-title">Account Details</p>
        <ReviewItem label="Email" value={data.email || '—'} />
        <ReviewItem
          label="Password"
          value={
            <span className="review-password">
              {'•'.repeat(data.password?.length || 8)}
            </span>
          }
        />
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '0.5rem' }}>
        By submitting, you agree to our{' '}
        <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Terms of Service</a>{' '}
        and{' '}
        <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Privacy Policy</a>.
      </p>

      <div className="wizard-actions">
        <button type="button" className="btn btn-outline" onClick={onBack}>
          <ArrowLeft size={16} />
          Back
        </button>
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
          Submit
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
