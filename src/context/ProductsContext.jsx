import { createContext, useContext, useState, useEffect } from 'react'
import {
  collection, doc,
  onSnapshot, addDoc, updateDoc, deleteDoc,
} from 'firebase/firestore'
import { db } from '../config/firebase'

const ProductsContext = createContext()

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [])

  const addProduct = (product) =>
    addDoc(collection(db, 'products'), {
      ...product,
      rating:    product.rating    ?? 4.5,
      reviews:   product.reviews   ?? 0,
      tags:      product.tags      ?? [],
      createdAt: new Date().toISOString(),
    })

  const updateProduct = (id, updates) =>
    updateDoc(doc(db, 'products', id), updates)

  const deleteProduct = (id) =>
    deleteDoc(doc(db, 'products', id))

  const offers   = products.filter(p => p.isOffer)
  const featured = products.filter(p => p.isFeatured)

  return (
    <ProductsContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, offers, featured }}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => useContext(ProductsContext)
