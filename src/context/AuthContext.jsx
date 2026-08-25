import { createContext, useContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import { FEATURE_LOGIN } from '../config/features'

export const ROLES = {
  CLIENTE:       'cliente',       // cliente final (default al registrarse)
  MINORISTA:     'minorista',     // comprador retail con cuenta
  MAYORISTA:     'mayorista',     // comprador mayorista — ve precios especiales
  DISTRIBUIDOR:  'distribuidor',  // distribuidor — precios y productos exclusivos
  ADMINISTRADOR: 'administrador', // acceso total
}

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authModal, setAuthModal]     = useState(false)
  const [authTab, setAuthTab]         = useState('login')

  useEffect(() => {
    let unsubProfile = null

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (unsubProfile) { unsubProfile(); unsubProfile = null }

      if (firebaseUser) {
        unsubProfile = onSnapshot(doc(db, 'users', firebaseUser.uid), (snap) => {
          if (snap.exists()) {
            setUser({ uid: firebaseUser.uid, ...snap.data() })
          } else {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, name: firebaseUser.displayName || '', role: ROLES.CLIENTE })
          }
          setAuthLoading(false)
        })
      } else {
        setUser(null)
        setAuthLoading(false)
      }
    })

    return () => { unsubAuth(); if (unsubProfile) unsubProfile() }
  }, [])

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setAuthModal(false)
      return { success: true }
    } catch (err) {
      return { error: mapError(err.code) }
    }
  }

  const register = async (name, email, password, role = ROLES.CLIENTE) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', cred.user.uid), {
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
        favorites: [],
      })
      setAuthModal(false)
      return { success: true }
    } catch (err) {
      return { error: mapError(err.code) }
    }
  }

  const logout = () => signOut(auth)

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (err) {
      return { error: mapError(err.code) }
    }
  }

  // Con FEATURE_LOGIN desactivado las funciones de apertura de modal son noop
  const openLogin  = () => { if (FEATURE_LOGIN) { setAuthTab('login');    setAuthModal(true) } }
  const openSignup = () => { if (FEATURE_LOGIN) { setAuthTab('register'); setAuthModal(true) } }

  // Con login suspendido todos pueden comprar (flujo sin cuenta)
  const canBuy         = FEATURE_LOGIN ? !!user : true
  const isWholesale    = user?.role === ROLES.MAYORISTA    || user?.role === ROLES.DISTRIBUIDOR  || user?.role === ROLES.ADMINISTRADOR
  const isDistributor  = user?.role === ROLES.DISTRIBUIDOR || user?.role === ROLES.ADMINISTRADOR
  const isAdmin        = user?.role === ROLES.ADMINISTRADOR
  // isEmployee se mantiene para compatibilidad — admin puede acceder al panel
  const isEmployee     = user?.role === ROLES.ADMINISTRADOR

  return (
    <AuthContext.Provider value={{
      user, authLoading,
      login, register, logout, resetPassword,
      authModal, setAuthModal, authTab, setAuthTab,
      openLogin, openSignup,
      canBuy, isWholesale, isDistributor, isAdmin, isEmployee,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

function mapError(code) {
  const map = {
    'auth/user-not-found':        'No existe una cuenta con ese email.',
    'auth/wrong-password':        'Contraseña incorrecta.',
    'auth/invalid-credential':    'Email o contraseña incorrectos.',
    'auth/email-already-in-use':  'Ya existe una cuenta con ese email.',
    'auth/weak-password':         'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-email':         'El email no es válido.',
    'auth/too-many-requests':     'Demasiados intentos. Intentá más tarde.',
    'auth/network-request-failed':'Error de red. Verificá tu conexión.',
  }
  return map[code] || 'Ocurrió un error. Intentá de nuevo.'
}
