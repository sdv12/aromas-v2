import { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthContext'

const OrdersContext = createContext()

export function OrdersProvider({ children }) {
  const { user } = useAuth()

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('aromascba_orders')
    return saved ? JSON.parse(saved) : []
  })

  const addOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      userId: user?.id,
      date: new Date().toISOString(),
      status: 'pendiente',
      ...orderData,
    }
    setOrders(prev => {
      const updated = [newOrder, ...prev]
      localStorage.setItem('aromascba_orders', JSON.stringify(updated))
      return updated
    })
    return newOrder
  }

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, status } : o)
      localStorage.setItem('aromascba_orders', JSON.stringify(updated))
      return updated
    })
  }

  const userOrders = orders.filter(o => o.userId === user?.id)

  return (
    <OrdersContext.Provider value={{ orders: userOrders, addOrder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => useContext(OrdersContext)
