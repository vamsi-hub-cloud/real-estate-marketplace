// Captures desktop, tablet and mobile screenshots of the main pages.
// Usage:
//   npm run build && npm run preview        (in one terminal, serves http://localhost:4173)
//   npx playwright install chromium         (first time only)
//   npm run screenshots                     (in another terminal)
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.BASE_URL || 'http://localhost:4173'
const viewports = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 820, height: 1180 },
  mobile: { width: 390, height: 844 },
}
const pages = {
  home: '/',
  listings: '/properties',
  'listings-rent': '/properties?status=rent&sort=price-asc',
  detail: '/properties/1',
  agents: '/agents',
  'agent-profile': '/agents/maya-okafor',
  login: '/login',
  register: '/register',
}

const browser = await chromium.launch()
for (const [device, size] of Object.entries(viewports)) {
  await mkdir(`screenshots/${device}`, { recursive: true })
  const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  for (const [name, path] of Object.entries(pages)) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1800) // let the hero windows finish lighting up
    await page.screenshot({ path: `screenshots/${device}/${name}.png`, fullPage: true })
    console.log(`${device}/${name}.png`)
  }
  await ctx.close()
}
await browser.close()
