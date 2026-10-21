import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../components/common/AuthShell'
import PasswordField from '../components/common/PasswordField'
import { useApp } from '../context/AppContext'
import { useTitle } from '../hooks/useTitle'

function strength(pw) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) s++
  return s
}

const LABELS = ['Too short', 'Weak', 'Fair', 'Good', 'Strong']
const COLORS = ['bg-red-400', 'bg-red-400', 'bg-marigold', 'bg-spruce-500', 'bg-spruce']

export default function Register() {
  const { user, register, toast } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const [v, setV] = useState({ name: '', email: '', password: '', confirm: '', terms: false })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  useTitle('Create account')

  if (user) return <Navigate to={from} replace />

  const set = (k) => (e) => setV((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const score = strength(v.password)

  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (v.name.trim().length < 2) er.name = 'Enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(v.email)) er.email = 'Enter a valid email address.'
    if (v.password.length < 8 || !/\d/.test(v.password) || !/[A-Za-z]/.test(v.password)) er.password = 'Use at least 8 characters with a letter and a number.'
    if (v.confirm !== v.password) er.confirm = 'Passwords don’t match.'
    if (!v.terms) er.terms = 'Accept the terms to continue.'
    setErrors(er)
    if (Object.keys(er).length) return
    setBusy(true)
    const res = await register(v)
    setBusy(false)
    if (!res.ok) {
      setErrors({ form: res.error })
      return
    }
    toast('Account created. Welcome to Keystead!')
    navigate(from, { replace: true })
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Save homes, list a property and message agents."
      footer={<>Already registered? <Link to="/login" state={location.state} className="font-semibold text-spruce-500 hover:text-spruce">Sign in</Link></>}
    >
      <form onSubmit={submit} noValidate className="space-y-5">
        {errors.form && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</p>}
        <div>
          <label htmlFor="reg-name" className="field-label">Full name</label>
          <input id="reg-name" autoComplete="name" className={errors.name ? 'input input-error' : 'input'} value={v.name} onChange={set('name')} aria-invalid={Boolean(errors.name)} />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="reg-email" className="field-label">Email</label>
          <input id="reg-email" type="email" autoComplete="email" className={errors.email ? 'input input-error' : 'input'} value={v.email} onChange={set('email')} aria-invalid={Boolean(errors.email)} />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>
        <div>
          <PasswordField id="reg-password" label="Password" autoComplete="new-password" value={v.password} onChange={set('password')} error={errors.password} hint="At least 8 characters, with a letter and a number." />
          {v.password && (
            <div className="mt-2" aria-live="polite">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${score >= i ? COLORS[score] : 'bg-spruce-100'}`} />)}
              </div>
              <p className="mt-1 text-xs text-slate">Strength: {LABELS[score]}</p>
            </div>
          )}
        </div>
        <PasswordField id="reg-confirm" label="Confirm password" autoComplete="new-password" value={v.confirm} onChange={set('confirm')} error={errors.confirm} />
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input type="checkbox" checked={v.terms} onChange={set('terms')} className="mt-0.5 h-4 w-4 rounded accent-spruce" />
            <span>I agree to the terms of use and privacy policy.</span>
          </label>
          {errors.terms && <p className="field-error">{errors.terms}</p>}
        </div>
        <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full">{busy ? 'Creating account…' : 'Create account'}</button>
      </form>
    </AuthShell>
  )
}
