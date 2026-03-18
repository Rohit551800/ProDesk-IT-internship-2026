import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { step2Schema } from '../../lib/schemas'
import { AlertCircle, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react'

function PasswordStrength({ password = '' }) {
  const checks = [
    { label: '8+ chars',      pass: password.length >= 8 },
    { label: 'Uppercase',     pass: /[A-Z]/.test(password) },
    { label: 'Number',        pass: /[0-9]/.test(password) },
    { label: 'Special char',  pass: /[^a-zA-Z0-9]/.test(password) },
  ]
  const score = checks.filter((c) => c.pass).length

  const color =
    score === 0 ? 'var(--border)' :
    score <= 1  ? 'var(--accent)'  :
    score <= 2  ? 'var(--accent2)' :
    score === 3 ? '#f0d060'        :
                  '#2ecc71'

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '0.4rem' }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '3px',
              borderRadius: '99px',
              background: i <= score ? color : 'var(--border)',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {checks.map((c) => (
          <span
            key={c.label}
            style={{
              fontSize: '0.68rem',
              color: c.pass ? '#2ecc71' : 'var(--muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              transition: 'color 0.2s',
            }}
          >
            <span style={{ fontSize: '0.6rem' }}>{c.pass ? '✓' : '○'}</span>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Step2({ data, onNext, onBack }) {
  const [showPwd, setShowPwd]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: data,
    mode: 'onChange',
  })

  const passwordValue = watch('password', '')
  const onSubmit = (values) => onNext(values)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="step-enter" noValidate>
      <div className="form-group">
        <label className="form-label" htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="john@example.com"
          className={`form-input ${errors.email ? 'error' : ''}`}
          {...register('email')}
        />
        {errors.email && (
          <p className="form-error">
            <AlertCircle size={12} />
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="password">Password</label>
        <div className="password-wrapper">
          <input
            id="password"
            type={showPwd ? 'text' : 'password'}
            placeholder="Create a strong password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            style={{ paddingRight: '2.8rem' }}
            {...register('password')}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPwd((p) => !p)}
            aria-label={showPwd ? 'Hide password' : 'Show password'}
          >
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <PasswordStrength password={passwordValue} />
        {errors.password && (
          <p className="form-error" style={{ marginTop: '0.35rem' }}>
            <AlertCircle size={12} />
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
        <div className="password-wrapper">
          <input
            id="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Repeat your password"
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            style={{ paddingRight: '2.8rem' }}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirm((p) => !p)}
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="form-error">
            <AlertCircle size={12} />
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="wizard-actions">
        <button type="button" className="btn btn-outline" onClick={onBack}>
          <ArrowLeft size={16} />
          Back
        </button>
        <button type="submit" className="btn btn-primary" disabled={!isValid}>
          Review
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  )
}
