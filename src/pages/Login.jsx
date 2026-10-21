import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../components/common/AuthShell'
import PasswordField from '../components/common/PasswordField'
import { DEMO_ACCOUNT, useApp } from '../context/AppContext'
import { useTitle } from '../hooks/useTitle'

export default function Login() {
  const { user, login, toast } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  useTitle('Sign in')

  if (user) return <Navigate to={from} replace />

  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) er.email = 'Enter a valid email address.'
    if (!password) er.password = 'Enter your password.'
    setErrors(er)
    if (Object.keys(er).length) return
    setBusy(true)
    const res = await login(email, password)
    setBusy(false)
    if (!res.ok) {
      setErrors({ form: res.error })
      return
    }
    toast('Welcome back')
    navigate(from, { replace: true })
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Welcome back. Pick up where you left off."
      footer={<>New to Keystead? <Link to="/register" state={location.state} className="font-semibold text-spruce-500 hover:text-spruce">Create an account</Link></>}
    >
      {location.state?.notice && <p className="mb-5 rounded-xl bg-marigold-100 px-4 py-3 text-sm">{location.state.notice}</p>}
      <form onSubmit={submit} noValidate className="space-y-5">
        {errors.form && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</p>}
        <div>
          <label htmlFor="login-email" className="field-label">Email</label>
          <input id="login-email" type="email" autoComplete="email" className={errors.email ? 'input input-error' : 'input'} value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(errors.email)} />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>
        <PasswordField id="login-password" label="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full">{busy ? 'Signing in…' : 'Sign in'}</button>
        <button
          type="button"
          className="btn btn-outline w-full"
          onClick={() => { setEmail(DEMO_ACCOUNT.email); setPassword(DEMO_ACCOUNT.password); setErrors({}) }}
        >
          Fill in demo account
        </button>
      </form>
    </AuthShell>
  )
}
