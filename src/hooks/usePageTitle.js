import { useEffect } from 'react'

const BRAND = 'Aura — Aromas Córdoba'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BRAND}` : BRAND
    return () => { document.title = BRAND }
  }, [title])
}
