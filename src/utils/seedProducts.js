import { collection, doc, writeBatch, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { PRODUCTS } from '../data/products'

export async function seedProducts() {
  const batch = writeBatch(db)
  PRODUCTS.forEach(({ id: _numericId, ...data }) => {
    batch.set(doc(collection(db, 'products')), data)
  })
  await batch.commit()
}

export async function reseedProducts() {
  const snap = await getDocs(collection(db, 'products'))
  const deletePromises = snap.docs.map(d => deleteDoc(d.ref))
  await Promise.all(deletePromises)
  await seedProducts()
}
