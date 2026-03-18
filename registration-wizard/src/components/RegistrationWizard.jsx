import { useState } from 'react'
import ProgressBar    from './ui/ProgressBar'
import Step1          from './steps/Step1'
import Step2          from './steps/Step2'
import Step3          from './steps/Step3'
import SuccessScreen  from './steps/SuccessScreen'

const INITIAL_DATA = {
  // Step 1
  firstName:       '',
  lastName:        '',
  dateOfBirth:     '',
  // Step 2
  email:           '',
  password:        '',
  confirmPassword: '',
}

export default function RegistrationWizard() {
  const [step, setStep]       = useState(1)       // 1 | 2 | 3
  const [done, setDone]       = useState(false)
  const [formData, setFormData] = useState(INITIAL_DATA)

  // Merge partial data from each step into global state, then advance
  const handleNext = (partialData) => {
    setFormData((prev) => ({ ...prev, ...partialData }))
    setStep((s) => s + 1)
  }

  const handleBack = () => setStep((s) => s - 1)

  const handleSubmit = () => setDone(true)

  const handleReset = () => {
    setFormData(INITIAL_DATA)
    setStep(1)
    setDone(false)
  }

  if (done) {
    return (
      <div className="wizard-card">
        <SuccessScreen onReset={handleReset} />
        <div className="wizard-card-accent-bar" />
      </div>
    )
  }

  return (
    <div className="wizard-card">
      <ProgressBar currentStep={step} />

      {step === 1 && (
        <Step1
          data={formData}
          onNext={handleNext}
        />
      )}

      {step === 2 && (
        <Step2
          data={formData}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {step === 3 && (
        <Step3
          data={formData}
          onBack={handleBack}
          onSubmit={handleSubmit}
        />
      )}

      <div className="wizard-card-accent-bar" />
    </div>
  )
}
