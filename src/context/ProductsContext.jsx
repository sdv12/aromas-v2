import { createContext, useContext, useState, useEffect } from 'react'
import { PRODUCTS } from '../data/products'

const ProductsContext = createContext()

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('aromascba_products')
    return saved ? JSON.parse(saved) : PRODUCTS
  })

  // Simulates async load — replace setTimeout with real fetch in backend phase
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    localStorage.setItem('aromascba_products', JSON.stringify(products))
  }, [products])

  const addProduct = product => {
    const newProduct = {
      ...product,
      id: Date.now(),
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      tags: product.tags || [],
    }
    setProducts(prev => [...prev, newProduct])
  }

  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const deleteProduct = id => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const resetToDefault = () => {
    setProducts(PRODUCTS)
    localStorage.removeItem('aromascba_products')
  }

  const offers   = products.filter(p => p.isOffer)
  const featured = products.filter(p => p.isFeatured)

  return (
    <ProductsContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, resetToDefault, offers, featured }}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => useContext(ProductsContext)
