import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const max      = action.product.stock || 9999
      const existing = state.find(i => i.id === action.product.id)
      if (existing) {
        if (existing.qty >= max) return state
        return state.map(i =>
          i.id === action.product.id ? { ...i, qty: Math.min(i.qty + 1, max) } : i
        )
      }
      if (action.product.stock === 0) return state
      return [...state, { ...action.product, qty: 1 }]
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id)
    case 'UPDATE_QTY': {
      if (action.qty <= 0) return state.filter(i => i.id !== action.id)
      const item = state.find(i => i.id === action.id)
      const max  = item?.stock || 9999
      return state.map(i =>
        i.id === action.id ? { ...i, qty: Math.min(action.qty, max) } : i
      )
    }
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], () => {
    const saved = localStorage.getItem('aromascba_cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('aromascba_cart', JSON.stringify(items))
  }, [items])

  // Returns a status object the caller can use to show toasts
  const addItem = (product) => {
    const existing   = items.find(i => i.id === product.id)
    const currentQty = existing?.qty || 0
    const stock      = product.stock ?? 9999

    if (stock === 0)           return { status: 'out_of_stock' }
    if (currentQty >= stock)   return { status: 'at_limit', max: stock }

    dispatch({ type: 'ADD', product })

    const newQty    = currentQty + 1
    const remaining = stock - newQty

    if (remaining === 0)  return { status: 'took_last' }
    if (remaining <= 3)   return { status: 'low_stock', remaining }
    return { status: 'ok' }
  }

  const removeItem = id          => dispatch({ type: 'REMOVE', id })
  const updateQty  = (id, qty)   => dispatch({ type: 'UPDATE_QTY', id, qty })
  const clearCart  = ()          => dispatch({ type: 'CLEAR' })

  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const subtotal   = (wholesale) =>
    items.reduce((s, i) => s + (wholesale ? i.wholesalePrice : i.price) * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
