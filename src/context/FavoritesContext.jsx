import { createContext, useContext, useState, useEffect } from 'react'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext()

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    if (!user) { setFavorites([]); return }
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      setFavorites(snap.data()?.favorites ?? [])
    })
    return unsub
  }, [user])

  const toggle = async (id) => {
    if (!user) return
    const next = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id]
    setFavorites(next)
    await updateDoc(doc(db, 'users', user.uid), { favorites: next })
  }

  const isFavorite = (id) => favorites.includes(id)

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)
