import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import RequireAuth from './components/layout/RequireAuth'
import Home from './pages/Home'

const Listings = lazy(() => import('./pages/Listings'))
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Compare = lazy(() => import('./pages/Compare'))
const Agents = lazy(() => import('./pages/Agents'))
const AgentProfile = lazy(() => import('./pages/AgentProfile'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const SubmitProperty = lazy(() => import('./pages/SubmitProperty'))
const MyListings = lazy(() => import('./pages/MyListings'))
const NotFound = lazy(() => import('./pages/NotFound'))

function Fallback() {
  return (
    <div className="container-page grid min-h-[50vh] place-items-center" role="status" aria-label="Loading">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-spruce-100 border-t-spruce" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="properties" element={<Listings />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="compare" element={<Compare />} />
          <Route path="agents" element={<Agents />} />
          <Route path="agents/:id" element={<AgentProfile />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="submit" element={<RequireAuth><SubmitProperty /></RequireAuth>} />
          <Route path="my-listings" element={<RequireAuth><MyListings /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
