import { useEffect } from 'react'

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} – Keystead` : 'Keystead – Homes to buy and rent'
  }, [title])
}
