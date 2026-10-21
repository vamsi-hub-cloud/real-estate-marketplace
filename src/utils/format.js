const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const num = new Intl.NumberFormat('en-US')

export const money = (n) => usd.format(n)
export const number = (n) => num.format(n)
export const priceLabel = (p) => (p.status === 'rent' ? `${money(p.price)}/mo` : money(p.price))

export const compact = (n) => {
  if (n >= 1e6) return `$${Number((n / 1e6).toFixed(2))}M`
  if (n >= 1e3) return `$${Math.round(n / 1e3)}K`
  return `$${n}`
}

export const postedLabel = (d) => {
  if (d === 0) return 'Listed today'
  if (d === 1) return 'Listed yesterday'
  if (d < 30) return `Listed ${d} days ago`
  return `Listed ${Math.floor(d / 30)} mo ago`
}

export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
