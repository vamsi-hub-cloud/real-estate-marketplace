import { cities } from './cities'
import { agentForCity } from './agents'
import { photoMap } from './photos'

export const AMENITIES = [
  'Parking',
  'Air Conditioning',
  'Balcony',
  'Garden',
  'Swimming Pool',
  'Gym',
  'Security',
  'Elevator',
  'Pet Friendly',
  'Fireplace',
  'Wi-Fi',
  'Smart Home',
  'Furnished',
  'Backup Power',
  'Laundry',
  'Rooftop Terrace',
]

export const PROPERTY_TYPES = ['House', 'Villa', 'Apartment', 'Townhouse']

const POOLS = {
  House: ['Parking', 'Air Conditioning', 'Garden', 'Fireplace', 'Pet Friendly', 'Wi-Fi', 'Smart Home', 'Laundry', 'Backup Power'],
  Villa: ['Parking', 'Air Conditioning', 'Garden', 'Swimming Pool', 'Gym', 'Security', 'Smart Home', 'Backup Power', 'Wi-Fi', 'Rooftop Terrace'],
  Apartment: ['Air Conditioning', 'Balcony', 'Elevator', 'Gym', 'Security', 'Wi-Fi', 'Pet Friendly', 'Furnished', 'Laundry', 'Rooftop Terrace', 'Parking'],
  Townhouse: ['Parking', 'Air Conditioning', 'Balcony', 'Pet Friendly', 'Wi-Fi', 'Smart Home', 'Laundry', 'Fireplace', 'Rooftop Terrace', 'Garden'],
}

// title, type, status, city, neighborhood, beds, baths, sq ft, price, featured
const rows = [
  ['Sunlit Craftsman near Zilker Park', 'House', 'buy', 'Austin', 'Zilker', 4, 3, 2450, 845000, true],
  ['Glass-Walled Villa with Plunge Pool', 'Villa', 'buy', 'Miami', 'Coconut Grove', 5, 5, 4800, 2450000, true],
  ['Corner Apartment above Capitol Hill', 'Apartment', 'rent', 'Seattle', 'Capitol Hill', 2, 2, 1020, 3100],
  ['Brick Townhouse on a Quiet Wicker Park Block', 'Townhouse', 'buy', 'Chicago', 'Wicker Park', 3, 3, 1980, 925000],
  ['Light-Filled Loft in the West Loop', 'Apartment', 'buy', 'Chicago', 'West Loop', 2, 2, 1340, 610000, true],
  ['Mountain-View Home in Wash Park', 'House', 'buy', 'Denver', 'Wash Park', 4, 3, 3100, 1150000],
  ['Garden Cottage in Alberta Arts', 'House', 'rent', 'Portland', 'Alberta Arts', 2, 1, 1100, 2650],
  ['Skyline Residence in Brickell', 'Apartment', 'buy', 'Miami', 'Brickell', 3, 3, 2600, 1890000, true],
  ['Modern Townhome in Mueller', 'Townhouse', 'rent', 'Austin', 'Mueller', 3, 3, 1650, 3400],
  ['Family Villa with Pool in Coral Gables', 'Villa', 'buy', 'Miami', 'Coral Gables', 5, 4, 4200, 1980000],
  ['Cozy Studio in the Pearl District', 'Apartment', 'rent', 'Portland', 'Pearl District', 1, 1, 540, 1750],
  ['Ballard Bungalow with Backyard Studio', 'House', 'buy', 'Seattle', 'Ballard', 3, 2, 1850, 1090000],
  ['Warehouse-Style Apartment in RiNo', 'Apartment', 'rent', 'Denver', 'RiNo', 1, 1, 880, 2250],
  ['Lincoln Park Greystone Townhouse', 'Townhouse', 'buy', 'Chicago', 'Lincoln Park', 4, 4, 3350, 1475000, true],
  ['Queen Anne Hilltop Villa', 'Villa', 'buy', 'Seattle', 'Queen Anne', 4, 4, 3900, 2150000],
  ['East Austin Courtyard Home', 'House', 'buy', 'Austin', 'East Austin', 3, 2, 1720, 735000],
  ['Wynwood Art District Apartment', 'Apartment', 'rent', 'Miami', 'Wynwood', 2, 2, 1180, 3650],
  ['Hawthorne Family Home with Porch', 'House', 'rent', 'Portland', 'Hawthorne', 4, 2, 2200, 3900],
  ['Cherry Creek Terrace Apartment', 'Apartment', 'buy', 'Denver', 'Cherry Creek', 2, 2, 1480, 780000],
  ['Logan Square Greystone Flat', 'Apartment', 'rent', 'Chicago', 'Logan Square', 2, 1, 1050, 2400],
  ['Fremont Canal-Side Townhouse', 'Townhouse', 'buy', 'Seattle', 'Fremont', 3, 3, 1760, 985000],
  ['Hyde Park Tudor Revival', 'House', 'buy', 'Austin', 'Hyde Park', 4, 3, 2780, 1320000, true],
  ['LoHi Rooftop Townhome', 'Townhouse', 'rent', 'Denver', 'LoHi', 3, 3, 1900, 4200],
  ['Sellwood Riverside Cottage', 'House', 'buy', 'Portland', 'Sellwood', 2, 2, 1320, 690000],
  ['Brickell Bay Studio', 'Apartment', 'rent', 'Miami', 'Brickell', 1, 1, 610, 2450],
  ['Zilker Hillside Villa', 'Villa', 'rent', 'Austin', 'Zilker', 4, 4, 3600, 8900],
  ['Capitol Hill Walk-Up Duplex', 'Townhouse', 'buy', 'Seattle', 'Capitol Hill', 3, 2, 1540, 865000],
  ['West Loop Designer Penthouse', 'Apartment', 'buy', 'Chicago', 'West Loop', 3, 3, 2400, 1650000],
  ['RiNo Creative Townhouse', 'Townhouse', 'buy', 'Denver', 'RiNo', 3, 3, 1780, 845000],
  ['Pearl District Two-Bed with Courtyard', 'Apartment', 'buy', 'Portland', 'Pearl District', 2, 2, 1210, 735000],
  ['Wash Park Garden Flat', 'Apartment', 'rent', 'Denver', 'Wash Park', 2, 1, 960, 2350],
  ['Coconut Grove Garden Home', 'House', 'rent', 'Miami', 'Coconut Grove', 3, 3, 2100, 6200],
  ['Wicker Park Studio Loft', 'Apartment', 'rent', 'Chicago', 'Wicker Park', 1, 1, 720, 1900],
  ['Alberta Arts Modern Duplex', 'Townhouse', 'buy', 'Portland', 'Alberta Arts', 3, 2, 1650, 820000],
  ['Mueller Family House', 'House', 'buy', 'Austin', 'Mueller', 4, 3, 2600, 965000],
  ['Ballard Harbor Apartment', 'Apartment', 'rent', 'Seattle', 'Ballard', 2, 2, 1090, 2950],
]

const STREETS = ['Maple', 'Juniper', 'Larkspur', 'Alder', 'Cedar', 'Linden', 'Harbor', 'Willow', 'Orchard', 'Summit', 'Bristol', 'Calloway']
const SUFFIX = ['St', 'Ave', 'Ln', 'Ct', 'Way', 'Blvd']

// Small deterministic PRNG so the dataset is identical on every load.
function rng(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick(r, arr) {
  return arr[Math.floor(r() * arr.length)]
}

function shuffle(r, arr) {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const OPENERS = {
  House: ['A well-kept detached home', 'A detached home with real character', 'A comfortable family house'],
  Villa: ['A statement villa', 'A private villa built for entertaining', 'A light-drenched villa'],
  Apartment: ['A bright, well-planned apartment', 'An airy apartment', 'A smartly laid-out apartment'],
  Townhouse: ['A well-proportioned townhouse', 'A three-level townhouse', 'A modern attached townhouse'],
}

function describe(r, row, extras) {
  const [, type, status, city, hood, beds, baths, area] = row
  const vibe = cities[city].hoods[hood].vibe
  const open = pick(r, OPENERS[type])
  const verb = status === 'rent' ? 'available to lease' : 'on the market'
  const p1 = `${open} in ${hood}, ${city}, now ${verb}. With ${beds} bedroom${beds > 1 ? 's' : ''}, ${baths} bathroom${baths > 1 ? 's' : ''} and ${area.toLocaleString('en-US')} sq ft of living space, the plan keeps the main living areas open and the bedrooms quiet. Built in ${extras.year}, it has been kept up carefully, with ${pick(r, ['refinished oak floors', 'a renovated kitchen', 'updated windows throughout', 'fresh interior paint', 'a recently serviced HVAC system'])}.`
  const p2 = `${hood} is known for ${vibe}. ${pick(r, ['Everyday errands are easy on foot.', 'Transit and main roads are close by.', 'Schools, groceries and parks are all within a short trip.'])} ${status === 'rent' ? 'The landlord accepts 12-month leases and responds to requests within a day.' : 'Our agent can arrange a showing or a video walkthrough within 48 hours.'}`
  return [p1, p2]
}

export const baseProperties = rows.map((row, i) => {
  const [title, type, status, city, hood, beds, baths, area, price, featured] = row
  const r = rng((i + 3) * 2654435761)
  const hoodInfo = cities[city].hoods[hood]
  const modern = type === 'Apartment' || type === 'Villa'
  const year = modern ? 1996 + Math.floor(r() * 28) : 1924 + Math.floor(r() * 90)
  const amenityCount = 6 + Math.floor(r() * 3)
  const amenities = shuffle(r, POOLS[type]).slice(0, amenityCount)
  if (status === 'rent' && type === 'Apartment' && r() > 0.5 && !amenities.includes('Furnished')) amenities.push('Furnished')
  const parking = amenities.includes('Parking') ? 1 + Math.floor(r() * 2) : 0
  const num = 100 + Math.floor(r() * 880)
  const agent = agentForCity(city)
  return {
    id: String(i + 1),
    seed: (i + 1) * 7919,
    title,
    type,
    status,
    price,
    city,
    state: cities[city].state,
    neighborhood: hood,
    address: `${num} ${pick(r, STREETS)} ${pick(r, SUFFIX)}`,
    beds,
    baths,
    area,
    year,
    parking,
    featured: Boolean(featured),
    daysAgo: Math.floor(r() * 60),
    amenities,
    description: describe(r, row, { year }),
    pos: [hoodInfo.pos[0] + (r() - 0.5) * 8, hoodInfo.pos[1] + (r() - 0.5) * 8],
    agentId: agent.id,
    photos: photoMap[String(i + 1)] || [],
  }
})
