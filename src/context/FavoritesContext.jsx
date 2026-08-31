import { createContext, useContext, useState, useEffect } from 'react'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext()
const KEY = 'aromascba_favorites'

const loadLocal = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}
const saveLocal = (list) => {
  try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* ignore */ }
}

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState(loadLocal)

  // Con usuario: escucha Firestore y fusiona con lo guardado localmente.
  useEffect(() => {
    if (!user) { setFavorites(loadLocal()); return }
    const ref = doc(db, 'users', user.uid)
    const unsub = onSnapshot(ref, (snap) => {
      const remote = snap.data()?.favorites ?? []
      const local  = loadLocal()
      const merged = [...new Set([...remote, ...local])]
      setFavorites(merged)
      saveLocal(merged)
      if (merged.length !== remote.length) {
        updateDoc(ref, { favorites: merged }).catch(() => {})
      }
    })
    return unsub
  }, [user])

  const toggle = (id) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id]
      saveLocal(next)
      if (user) {
        updateDoc(doc(db, 'users', user.uid), { favorites: next }).catch(() => {})
      }
      return next
    })
  }

  const isFavorite = (id) => favorites.includes(id)

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)
