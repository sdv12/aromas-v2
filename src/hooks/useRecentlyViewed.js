import { useState, useCallback } from 'react'

const KEY = 'aromascba_recently_viewed'
const MAX = 8

export function useRecentlyViewed() {
  const [ids, setIds] = useState(() => {
    const saved = localStorage.getItem(KEY)
    return saved ? JSON.parse(saved) : []
  })

  const trackView = useCallback((productId) => {
    setIds(prev => {
      const next = [productId, ...prev.filter(id => id !== productId)].slice(0, MAX)
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setIds([])
    localStorage.removeItem(KEY)
  }, [])

  return { ids, trackView, clear }
}
