import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step1Schema } from '../../lib/schemas'
import { AlertCircle, ArrowRight } from 'lucide-react'

export default function Step1({ data, onNext }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: data,
    mode: 'onChange',
  })

  const onSubmit = (values) => onNext(values)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="step-enter" noValidate>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            placeholder="John"
            className={`form-input ${errors.firstName ? 'error' : ''}`}
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className="form-error">
              <AlertCircle size={12} />
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            placeholder="Doe"
            className={`form-input ${errors.lastName ? 'error' : ''}`}
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className="form-error">
              <AlertCircle size={12} />
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="dateOfBirth">Date of Birth</label>
        <input
          id="dateOfBirth"
          type="date"
          className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
          {...register('dateOfBirth')}
        />
        {errors.dateOfBirth && (
          <p className="form-error">
            <AlertCircle size={12} />
            {errors.dateOfBirth.message}
          </p>
        )}
      </div>

      <div className="wizard-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isValid}
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  )
}
