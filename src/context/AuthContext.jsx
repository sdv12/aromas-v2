import { createContext, useContext, useState } from 'react'

export const ROLES = {
  GENERAL:      'general',
  CLIENTE:      'cliente',
  MINORISTA:    'minorista',
  MAYORISTA:    'mayorista',
  EMPLEADO:     'empleado',
  ADMINISTRADOR:'administrador',
}

const MOCK_USERS = [
  { id: 1, email: 'admin@aromascba.com',   password: '1234', name: 'Admin',      role: ROLES.ADMINISTRADOR },
  { id: 2, email: 'empleado@aromascba.com',password: '1234', name: 'Empleado',   role: ROLES.EMPLEADO },
  { id: 3, email: 'mayorista@test.com',    password: '1234', name: 'Mayorista',  role: ROLES.MAYORISTA },
  { id: 4, email: 'cliente@test.com',      password: '1234', name: 'Cliente',    role: ROLES.CLIENTE },
  { id: 5, email: 'minorista@test.com',    password: '1234', name: 'Minorista',  role: ROLES.MINORISTA },
]

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aromascba_user')
    return saved ? JSON.parse(saved) : null
  })
  const [authModal, setAuthModal] = useState(false)
  const [authTab, setAuthTab] = useState('login')

  const login = (email, password) => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password)
    if (!found) return { error: 'Email o contraseña incorrectos.' }
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    localStorage.setItem('aromascba_user', JSON.stringify(safeUser))
    setAuthModal(false)
    return { success: true }
  }

  const loginWithGoogle = () => {
    const mockUser = { id: 99, email: 'google@user.com', name: 'Usuario Google', role: ROLES.CLIENTE }
    setUser(mockUser)
    localStorage.setItem('aromascba_user', JSON.stringify(mockUser))
    setAuthModal(false)
  }

  const register = (name, email, role = ROLES.CLIENTE) => {
    const newUser = { id: Date.now(), email, name, role }
    setUser(newUser)
    localStorage.setItem('aromascba_user', JSON.stringify(newUser))
    setAuthModal(false)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('aromascba_user')
  }

  const openLogin  = () => { setAuthTab('login');    setAuthModal(true) }
  const openSignup = () => { setAuthTab('register'); setAuthModal(true) }

  const isWholesale = user?.role === ROLES.MAYORISTA || user?.role === ROLES.EMPLEADO || user?.role === ROLES.ADMINISTRADOR
  const canBuy      = user && user.role !== ROLES.GENERAL
  const isAdmin     = user?.role === ROLES.ADMINISTRADOR
  const isEmployee  = user?.role === ROLES.EMPLEADO || user?.role === ROLES.ADMINISTRADOR

  return (
    <AuthContext.Provider value={{
      user, login, loginWithGoogle, register, logout,
      authModal, setAuthModal, authTab, setAuthTab,
      openLogin, openSignup,
      isWholesale, canBuy, isAdmin, isEmployee,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
