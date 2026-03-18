import { useState, useCallback, useRef } from 'react'

let _show = null

export function useToast() {
  const [toast, setToast] = useState({ visible: false, msg: '', icon: '' })
  const timerRef = useRef(null)

  const show = useCallback((msg, icon = '✓') => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ visible: true, msg, icon })
    timerRef.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2200)
  }, [])

  return { toast, show }
}

export function Toast({ toast }) {
  return (
    <div className={`toast ${toast.visible ? 'show' : ''}`}>
      <span className="toast-icon">{toast.icon}</span>
      {toast.msg}
    </div>
  )
}
