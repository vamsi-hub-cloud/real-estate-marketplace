import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import { Compass } from 'lucide-react'
import { useTitle } from '../hooks/useTitle'

export default function NotFound() {
  useTitle('Page not found')
  return (
    <div className="container-page py-20">
      <EmptyState icon={Compass} title="This page has moved out" action={<><Button to="/">Go home</Button><Button to="/properties" variant="outline">Browse homes</Button></>}>
        The address doesn’t match any page on Keystead.
      </EmptyState>
    </div>
  )
}
