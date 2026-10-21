// Neighbourhood positions are on a 0–100 grid used by the schematic city map.
export const cities = {
  Austin: {
    state: 'TX',
    hoods: {
      Zilker: { pos: [30, 68], vibe: 'trailheads, live oaks and Barton Springs a short ride away' },
      'East Austin': { pos: [74, 56], vibe: 'coffee roasters, taquerias and a fast-changing creative scene' },
      'Hyde Park': { pos: [46, 26], vibe: 'porch-front bungalows and tree-lined streets' },
      Mueller: { pos: [70, 24], vibe: 'a planned community of parks, lakes and weekend markets' },
    },
  },
  Seattle: {
    state: 'WA',
    hoods: {
      'Capitol Hill': { pos: [58, 56], vibe: 'late-night cafes, record shops and a light rail stop' },
      Ballard: { pos: [22, 22], vibe: 'a working harbor, breweries and a Sunday farmers market' },
      Fremont: { pos: [42, 34], vibe: 'canal-side paths and quirky public art' },
      'Queen Anne': { pos: [40, 66], vibe: 'sweeping views and quiet hilltop streets' },
    },
  },
  Denver: {
    state: 'CO',
    hoods: {
      LoHi: { pos: [34, 34], vibe: 'rooftop dining with views of the downtown skyline' },
      'Wash Park': { pos: [52, 74], vibe: 'a big lake loop, tennis courts and old brick homes' },
      RiNo: { pos: [64, 30], vibe: 'murals, breweries and converted warehouses' },
      'Cherry Creek': { pos: [76, 62], vibe: 'boutiques, galleries and walkable creekside trails' },
    },
  },
  Miami: {
    state: 'FL',
    hoods: {
      Wynwood: { pos: [48, 22], vibe: 'street murals, galleries and late dinners' },
      'Coconut Grove': { pos: [40, 74], vibe: 'waterfront parks, canopy streets and sailing clubs' },
      Brickell: { pos: [62, 52], vibe: 'high-rise living a few steps from the Metromover' },
      'Coral Gables': { pos: [24, 56], vibe: 'Mediterranean-revival architecture and wide shaded avenues' },
    },
  },
  Chicago: {
    state: 'IL',
    hoods: {
      'Lincoln Park': { pos: [66, 24], vibe: 'the lakefront, the zoo and leafy brownstone blocks' },
      'Wicker Park': { pos: [34, 38], vibe: 'vintage shops, live music and the Blue Line' },
      'West Loop': { pos: [50, 62], vibe: 'acclaimed restaurants and converted loft buildings' },
      'Logan Square': { pos: [22, 22], vibe: 'boulevards, craft cocktails and a farmers market' },
    },
  },
  Portland: {
    state: 'OR',
    hoods: {
      'Pearl District': { pos: [38, 26], vibe: 'galleries, bookshops and the streetcar at your door' },
      'Alberta Arts': { pos: [64, 18], vibe: 'murals, food carts and a monthly art walk' },
      Hawthorne: { pos: [60, 56], vibe: 'independent cinemas, thrift stores and bike lanes' },
      Sellwood: { pos: [52, 82], vibe: 'antique shops and the river trail' },
    },
  },
}

export const cityNames = Object.keys(cities)
