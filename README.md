# Keystead – Real Estate Marketplace

A responsive real estate marketplace built with **React 18, Vite, Tailwind CSS and Framer Motion**. Browse homes for sale and rent, filter and sort results, compare listings side by side, save favorites, view agent profiles and publish your own listing.

> Sample data and generated illustrations are used throughout. There is no backend: wishlist, comparison, accounts and submitted listings are kept in `localStorage` on the visitor’s device.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | React 18 + Vite 5 |
| Routing | React Router 6 (routes are lazy-loaded) |
| Styling | Tailwind CSS 3 with a custom palette and two variable fonts (Bricolage Grotesque, Figtree) |
| Animation | Framer Motion (respects `prefers-reduced-motion`) |
| Icons | lucide-react |

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the build at http://localhost:4173
```

Requires Node.js 18 or newer.

### Demo account

| Email | Password |
| --- | --- |
| `demo@keystead.com` | `Keystead1` |

The sign-in page also has a “Fill in demo account” button. You can register your own account too; passwords are hashed (SHA-256) before being stored locally. This is a UI demonstration only and is not real authentication.

## Implemented features

**Landing page**
- Hero with a skyline whose windows light up on load, plus a Buy/Rent search form that opens the listings with the chosen filters
- Live stats, featured homes, browse by property type, explore by city, agent highlights and a “list your property” call to action

**Listings**
- Text search (title, neighborhood, street, city), debounced
- Filters: Buy/Rent, property type, city, min/max price with presets, bedrooms, bathrooms, amenities
- Sorting: newest, price (both directions), largest, most bedrooms
- Pagination (9 per page), grid and list layouts, removable filter chips, empty state
- All state lives in the URL, so searches can be bookmarked and shared; filters open in a slide-in drawer on mobile

**Property detail**
- Image gallery with thumbnails, keyboard navigation and a full-screen lightbox
- Key facts, description, amenity grid with icons, property details table
- Location section with a schematic neighborhood map and nearby places with walking times
- Mortgage calculator for sales, move-in cost summary for rentals
- Agent card, validated “Book a tour” form, similar homes, copy-link button

**Wishlist and comparison**
- Heart button on every card and detail page, dedicated wishlist page
- Compare up to three homes: floating compare bar, side-by-side table with “Best” highlights and an amenity checklist

**Agents**
- Directory with search and city filter, profile pages with stats, specialties, languages, their listings and a contact form

**Authentication UI**
- Sign in and register pages with validation, password visibility toggle and strength meter
- Protected routes (`/submit`, `/my-listings`) redirect to sign in and return afterwards

**Property submission**
- Four-step form (basics, location and size, details and photos, review) with per-step validation
- Photo upload with client-side resizing; submitted listings appear in search immediately and can be removed from “My listings”

**Quality**
- Responsive from 360px up to wide desktop; tested layouts for mobile, tablet and desktop
- Semantic markup, labelled form fields, visible keyboard focus, skip link, reduced-motion support
- Reusable components and a clear separation of data, utilities, context and pages

## Project structure

```
src/
├── components/
│   ├── common/      Button, PropertyArt, PropertyImage, Pagination, EmptyState, AgentAvatar, ...
│   ├── layout/      Navbar, Footer, Layout, RequireAuth
│   └── property/    PropertyCard, FilterPanel, Gallery, NeighborhoodMap, MortgageCalculator, ContactForm, CompareBar, ...
├── context/         AppContext (properties, wishlist, compare, auth, toasts)
├── data/            properties, agents, cities
├── hooks/           useLocalStorage, useTitle
├── pages/           Home, Listings, PropertyDetail, Wishlist, Compare, Agents, AgentProfile, Login, Register, SubmitProperty, MyListings, NotFound
└── utils/           filters (parse/apply/sort), format, hash
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Landing page |
| `/properties` | Listings (query: `q`, `status`, `type`, `city`, `min`, `max`, `beds`, `baths`, `am`, `sort`, `page`) |
| `/properties/:id` | Property detail |
| `/wishlist`, `/compare` | Saved homes, comparison |
| `/agents`, `/agents/:id` | Agent directory and profile |
| `/login`, `/register` | Authentication UI |
| `/submit`, `/my-listings` | Protected: add a listing, manage your listings |

## Deployment

The app is a static single-page app. Rewrites for client-side routing are included:

- **Vercel**: import the repository; `vercel.json` already rewrites all paths to `index.html`. Build command `npm run build`, output directory `dist`.
- **Netlify**: build command `npm run build`, publish directory `dist`; `public/_redirects` handles routing.

## Screenshots

With the production build running (`npm run build && npm run preview`), run:

```bash
npx playwright install chromium   # first time only
npm run screenshots
```

Images are saved to `screenshots/desktop`, `screenshots/tablet` and `screenshots/mobile`. Playwright is not listed in `package.json`; `npx` fetches it on demand if you prefer, or run `npm i -D playwright`.

## Submission checklist

- [ ] Push the source to the assigned GitHub repository
- [ ] Deploy and add the live URL to this README
- [ ] Generate and commit the screenshots
- [ ] Send the daily EOD update (completed, in progress, blockers)

## Notes and limitations

- Listing images are generated SVG illustrations, so the app never depends on third-party photo hosts. Uploaded photos replace them on user listings.
- Prices are in USD. Mortgage figures use flat estimates for tax and insurance.
- Data and accounts live in the browser; clearing site data resets them.
