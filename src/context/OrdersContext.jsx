import { createContext, useContext, useState, useEffect } from 'react'
import {
  collection, doc, addDoc, updateDoc,
  query, where, onSnapshot, orderBy,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './AuthContext'

const OrdersContext = createContext()
const LOCAL_KEY = 'aromascba_orders'

const loadLocal = () => {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [] } catch { return [] }
}
const saveLocal = (list) => {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(list.slice(0, 20))) } catch { /* ignore */ }
}

export function OrdersProvider({ children }) {
  const { user } = useAuth()
  const [orders, setOrders] = useState(loadLocal)

  useEffect(() => {
    if (!user) { setOrders(loadLocal()); return }
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc'),
    )
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [user])

  const addOrder = async (orderData) => {
    const base = { date: new Date().toISOString(), status: 'pendiente', ...orderData }

    if (user) {
      const data = { userId: user.uid, ...base }
      const ref = await addDoc(collection(db, 'orders'), data)
      return { id: ref.id, ...data }
    }

    // Invitado: se guarda localmente (el pedido llega al comercio por WhatsApp/email)
    const order = { id: `local-${Date.now()}`, guest: true, ...base }
    const list = [order, ...loadLocal()]
    saveLocal(list)
    setOrders(list)
    return order
  }

  const updateOrderStatus = (orderId, status) => {
    if (String(orderId).startsWith('local-')) {
      const list = loadLocal().map(o => (o.id === orderId ? { ...o, status } : o))
      saveLocal(list); setOrders(list)
      return Promise.resolve()
    }
    return updateDoc(doc(db, 'orders', orderId), { status })
  }

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => useContext(OrdersContext)
