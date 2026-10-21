import { useMemo, useState } from 'react'
import { money } from '../../utils/format'

export default function MortgageCalculator({ price }) {
  const [down, setDown] = useState(20)
  const [rate, setRate] = useState(6.5)
  const [years, setYears] = useState(30)

  const calc = useMemo(() => {
    const loan = price * (1 - down / 100)
    const r = Math.max(0, Number(rate) || 0) / 100 / 12
    const n = years * 12
    const pi = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n))
    const tax = (price * 0.011) / 12
    const ins = (price * 0.0035) / 12
    return { loan, pi, tax, ins, total: pi + tax + ins }
  }, [price, down, rate, years])

  const parts = [
    ['Principal & interest', calc.pi, 'bg-spruce'],
    ['Property tax (est.)', calc.tax, 'bg-spruce-500'],
    ['Insurance (est.)', calc.ins, 'bg-marigold'],
  ]

  return (
    <div className="surface p-5 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="mc-down" className="field-label">Down payment: {down}%</label>
          <input id="mc-down" type="range" min="5" max="50" step="5" value={down} onChange={(e) => setDown(Number(e.target.value))} className="w-full accent-spruce" />
          <p className="mt-1 text-[13px] text-slate">{money((price * down) / 100)}</p>
        </div>
        <div>
          <label htmlFor="mc-rate" className="field-label">Interest rate (%)</label>
          <input id="mc-rate" type="number" min="0" max="20" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="input" />
        </div>
        <div>
          <label htmlFor="mc-term" className="field-label">Loan term</label>
          <select id="mc-term" value={years} onChange={(e) => setYears(Number(e.target.value))} className="input">
            {[15, 20, 30].map((y) => <option key={y} value={y}>{y} years</option>)}
          </select>
        </div>
      </div>

      <div className="mt-6 flex items-baseline justify-between gap-3">
        <p className="text-sm text-slate">Estimated monthly payment</p>
        <p className="font-display text-3xl font-bold text-spruce">{money(Math.round(calc.total))}</p>
      </div>
      <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-spruce-50" aria-hidden="true">
        {parts.map(([label, v, cls]) => (
          <div key={label} className={`${cls} transition-all duration-300`} style={{ width: `${(v / calc.total) * 100}%` }} />
        ))}
      </div>
      <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        {parts.map(([label, v, cls]) => (
          <li key={label} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${cls}`} />
            <span className="text-slate">{label}</span>
            <span className="ml-auto font-semibold sm:ml-0">{money(Math.round(v))}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-slate-soft">Illustration only. Taxes and insurance use flat estimates; your lender’s figures will differ.</p>
    </div>
  )
}
