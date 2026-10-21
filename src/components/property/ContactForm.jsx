import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function ContactForm({ property, agent }) {
  const { user, toast } = useApp()
  const [values, setValues] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    date: '',
    message: `Hi ${agent.name.split(' ')[0]}, I’m interested in ${property.title}. Could we arrange a viewing?`,
  })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const validate = () => {
    const er = {}
    if (values.name.trim().length < 2) er.name = 'Enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(values.email)) er.email = 'Enter a valid email address.'
    if (values.phone && !/^[\d\s()+-]{7,}$/.test(values.phone)) er.phone = 'Enter a valid phone number.'
    if (values.message.trim().length < 10) er.message = 'Write at least 10 characters.'
    return er
  }

  const submit = (e) => {
    e.preventDefault()
    const er = validate()
    setErrors(er)
    if (Object.keys(er).length) return
    setSent(true)
    toast(`Message sent to ${agent.name}`)
  }

  const err = (k) => (errors[k] ? 'input input-error' : 'input')

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 text-center">
          <CheckCircle2 size={44} className="text-spruce-500" />
          <h3 className="mt-3 text-xl font-bold text-spruce">Message sent</h3>
          <p className="mt-1 text-sm text-slate">{agent.name} usually replies within a few hours.</p>
          <button type="button" onClick={() => setSent(false)} className="btn btn-outline btn-sm mt-5">Send another message</button>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div>
            <label htmlFor="cf-name" className="field-label">Full name</label>
            <input id="cf-name" className={err('name')} value={values.name} onChange={set('name')} autoComplete="name" aria-invalid={Boolean(errors.name)} />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="cf-email" className="field-label">Email</label>
            <input id="cf-email" type="email" className={err('email')} value={values.email} onChange={set('email')} autoComplete="email" aria-invalid={Boolean(errors.email)} />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div>
              <label htmlFor="cf-phone" className="field-label">Phone <span className="font-normal text-slate">(optional)</span></label>
              <input id="cf-phone" type="tel" className={err('phone')} value={values.phone} onChange={set('phone')} autoComplete="tel" aria-invalid={Boolean(errors.phone)} />
              {errors.phone && <p className="field-error">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="cf-date" className="field-label">Preferred tour date</label>
              <input id="cf-date" type="date" className="input" value={values.date} onChange={set('date')} min={new Date().toISOString().slice(0, 10)} />
            </div>
          </div>
          <div>
            <label htmlFor="cf-message" className="field-label">Message</label>
            <textarea id="cf-message" rows="4" className={err('message')} value={values.message} onChange={set('message')} aria-invalid={Boolean(errors.message)} />
            {errors.message && <p className="field-error">{errors.message}</p>}
          </div>
          <button type="submit" className="btn btn-primary w-full">Request a tour</button>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
