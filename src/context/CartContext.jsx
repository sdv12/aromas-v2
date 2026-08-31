import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()
const KEY = 'aromascba_cart'

const topeStock = (v) => (Number.isFinite(v) && v >= 0 ? v : 9999)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const max      = topeStock(action.product.stock)
      const existing = state.find(i => i.id === action.product.id)
      if (existing) {
        if (existing.qty >= max) return state
        return state.map(i =>
          i.id === action.product.id ? { ...i, qty: Math.min(i.qty + 1, max) } : i
        )
      }
      if (max === 0) return state
      return [...state, { ...action.product, qty: 1 }]
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id)
    case 'UPDATE_QTY': {
      const item = state.find(i => i.id === action.id)
      if (!item) return state
      const max = topeStock(item.stock)
      if (action.qty <= 0) return state.filter(i => i.id !== action.id)
      return state.map(i =>
        i.id === action.id ? { ...i, qty: Math.max(1, Math.min(action.qty, max)) } : i
      )
    }
    // Re-sincroniza stock / precio / imagen con el catálogo actual del panel
    case 'SYNC': {
      const byId = new Map(action.products.map(p => [String(p.id), p]))
      return state
        .map(i => {
          const p = byId.get(String(i.id))
          if (!p) return { ...i, stock: 0, _missing: true }
          const stock = topeStock(p.stock)
          return {
            ...i,
            name: p.name,
            image: p.image,
            price: p.price,
            wholesalePrice: p.wholesalePrice,
            stock: p.stock,
            _missing: false,
            qty: Math.max(1, Math.min(i.qty, stock || 1)),
          }
        })
        // saca del carrito lo que ya no existe o quedó sin stock
        .filter(i => !i._missing && (i.stock == null || i.stock > 0))
    }
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)) } catch { /* ignore */ }
  }, [items])

  const addItem = (product) => {
    const existing   = items.find(i => i.id === product.id)
    const currentQty = existing?.qty || 0
    const stock      = topeStock(product.stock)

    if (stock === 0)         return { status: 'out_of_stock' }
    if (currentQty >= stock) return { status: 'at_limit', max: stock }

    dispatch({ type: 'ADD', product })

    const remaining = stock - (currentQty + 1)
    if (remaining === 0) return { status: 'took_last' }
    if (remaining <= 3)  return { status: 'low_stock', remaining }
    return { status: 'ok' }
  }

  const removeItem  = id        => dispatch({ type: 'REMOVE', id })
  const updateQty   = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty })
  const clearCart   = ()        => dispatch({ type: 'CLEAR' })
  const syncCatalog = products  => dispatch({ type: 'SYNC', products })

  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const subtotal   = (wholesale) =>
    items.reduce((s, i) => s + (wholesale ? i.wholesalePrice : i.price) * i.qty, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, syncCatalog, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
