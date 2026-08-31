import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  collection, doc,
  onSnapshot, addDoc, updateDoc, deleteDoc,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { CATEGORIES, BRANDS } from '../data/products'
import { fetchCatalog, USING_PANEL } from '../services/catalogApi'

const ProductsContext = createContext()

/** Cada cuántos ms refrescar el catálogo del panel (0 = solo al montar). */
const POLL_MS = 5 * 60 * 1000

export function ProductsProvider({ children }) {
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState(CATEGORIES)
  const [brands,     setBrands]     = useState(BRANDS)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  // ---------- Fuente: Panel de administración (API pública) ----------
  const cargarDesdePanel = useCallback(async (signal) => {
    try {
      const { products, categories, brands } = await fetchCatalog(signal)
      setProducts(products)
      if (categories.length) setCategories(categories)
      if (brands.length) setBrands(brands)
      setError(null)
    } catch (e) {
      if (e.name !== 'AbortError') setError(e)
      // eslint-disable-next-line no-console
      console.error('[catálogo] no se pudo cargar del panel:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!USING_PANEL) return
    const ctrl = new AbortController()
    cargarDesdePanel(ctrl.signal)
    const t = POLL_MS ? setInterval(() => cargarDesdePanel(), POLL_MS) : null
    return () => { ctrl.abort(); if (t) clearInterval(t) }
  }, [cargarDesdePanel])

  // ---------- Fuente: Firestore (legacy) ----------
  useEffect(() => {
    if (USING_PANEL) return
    const unsub = onSnapshot(collection(db, 'products'), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [])

  // ---------- Mutaciones ----------
  const noEditable = () => {
    const msg = 'El catálogo se administra desde el Panel de Administración.'
    // eslint-disable-next-line no-console
    console.warn(msg)
    return Promise.reject(new Error(msg))
  }

  const addProduct = USING_PANEL
    ? noEditable
    : (product) =>
        addDoc(collection(db, 'products'), {
          ...product,
          rating:    product.rating    ?? 4.5,
          reviews:   product.reviews   ?? 0,
          tags:      product.tags      ?? [],
          createdAt: new Date().toISOString(),
        })

  const updateProduct = USING_PANEL
    ? noEditable
    : (id, updates) => updateDoc(doc(db, 'products', id), updates)

  const deleteProduct = USING_PANEL
    ? noEditable
    : (id) => deleteDoc(doc(db, 'products', id))

  const offers   = products.filter(p => p.isOffer)
  const featured = products.filter(p => p.isFeatured)

  return (
    <ProductsContext.Provider
      value={{
        products, loading, error,
        categories, brands,
        addProduct, updateProduct, deleteProduct,
        offers, featured,
        readOnly: USING_PANEL,
        refresh: () => cargarDesdePanel(),
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => useContext(ProductsContext)
