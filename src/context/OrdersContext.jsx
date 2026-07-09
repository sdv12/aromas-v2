import { createContext, useContext, useState, useEffect } from 'react'
import {
  collection, doc, addDoc, updateDoc,
  query, where, onSnapshot, orderBy,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './AuthContext'

const OrdersContext = createContext()

export function OrdersProvider({ children }) {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (!user) { setOrders([]); return }
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
    const data = {
      userId:    user.uid,
      date:      new Date().toISOString(),
      status:    'pendiente',
      ...orderData,
    }
    const ref = await addDoc(collection(db, 'orders'), data)
    return { id: ref.id, ...data }
  }

  const updateOrderStatus = (orderId, status) =>
    updateDoc(doc(db, 'orders', orderId), { status })

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => useContext(OrdersContext)
