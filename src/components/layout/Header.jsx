import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Search, ShoppingCart, Heart, User, Menu, X, Sun, Moon,
  ChevronDown, LogOut, Settings, Package, Crown, Store, LayoutDashboard, ClipboardList
} from 'lucide-react'
import { useTheme }          from '../../context/ThemeContext'
import { useAuth, ROLES }    from '../../context/AuthContext'
import { FEATURE_LOGIN }     from '../../config/features'
import { useCart }           from '../../context/CartContext'
import { useFavorites }      from '../../context/FavoritesContext'
import LogoHeader            from '../ui/Logo'
import SearchAutocomplete    from '../ui/SearchAutocomplete'

const NAV_LINKS = [
  { to: '/',           label: 'Inicio' },
  { to: '/catalogo',   label: 'Productos' },
  { to: '/mayorista',  label: 'Venta Mayorista' },
  { to: '/ofertas',    label: 'Ofertas' },
  { to: '/nosotros',   label: 'Contacto' },
]

const ROLE_LABELS = {
  general:       { label: 'Visitante',     color: 'text-gray-500', icon: User },
  cliente:       { label: 'Cliente',       color: 'text-primary-600', icon: User },
  minorista:     { label: 'Minorista',     color: 'text-primary-600', icon: Store },
  mayorista:     { label: 'Mayorista',     color: 'text-yellow-600', icon: Crown },
  empleado:      { label: 'Empleado',      color: 'text-blue-600',  icon: Package },
  administrador: { label: 'Administrador', color: 'text-red-500',   icon: Settings },
}

export default function Header() {
  const { theme, toggle } = useTheme()
  const { user, logout, openLogin, isEmployee } = useAuth()
  const { totalItems }  = useCart()
  const { favorites }   = useFavorites()
  const navigate        = useNavigate()
  const location        = useLocation()

  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const [searchOpen,   setSearchOpen]   = useState(false)

  const dropdownRef = useRef()

  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setUserDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setMobileOpen(false); setSearchOpen(false) }, [location.pathname])

  const roleInfo = user ? ROLE_LABELS[user.role] : null
  const RoleIcon = roleInfo?.icon || User

  const isActive = to => location.pathname === to

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-navy-900/95 backdrop-blur-md border-b border-cream-300 dark:border-navy-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="shrink-0">
            <LogoHeader />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`btn-ghost text-sm px-3 py-2 ${
                  isActive(to)
                    ? 'text-primary-700 dark:text-accent-400 bg-cream-200 dark:bg-navy-800 font-semibold'
                    : ''
                }`}
              >
                {label}
              </Link>
            ))}
            {isEmployee && (
              <Link
                to="/admin/catalogo"
                className={`btn-ghost text-sm px-3 py-2 flex items-center gap-1.5 ${
                  location.pathname.startsWith('/admin') ? 'text-primary-700 bg-cream-200 dark:bg-navy-800 font-semibold' : ''
                }`}
              >
                <LayoutDashboard size={15} /> Admin
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5">

            {/* Search */}
            {searchOpen ? (
              <div className="absolute left-0 right-0 top-0 h-16 px-4 flex items-center bg-white/95 dark:bg-navy-950/98 backdrop-blur-md z-10">
                <div className="w-full max-w-2xl mx-auto">
                  <SearchAutocomplete onClose={() => setSearchOpen(false)} />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="btn-ghost p-2 rounded-full"
                aria-label="Buscar"
              >
                <Search size={20} />
              </button>
            )}

            {/* Favorites */}
            <Link to="/catalogo?tab=favoritos" className="btn-ghost p-2 rounded-full relative" aria-label="Favoritos">
              <Heart size={20} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/carrito" className="btn-ghost p-2 rounded-full relative" aria-label="Carrito">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-600 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Theme */}
            <button onClick={toggle} className="btn-ghost p-2 rounded-full" aria-label="Cambiar tema">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User */}
            {user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setUserDropdown(s => !s)}
                  className="flex items-center gap-2 btn-ghost px-3 py-2 rounded-full"
                >
                  <div className={`w-7 h-7 rounded-full bg-cream-200 dark:bg-navy-800 flex items-center justify-center ${roleInfo?.color}`}>
                    <RoleIcon size={15} />
                  </div>
                  <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown size={14} className={`transition-transform ${userDropdown ? 'rotate-180' : ''}`} />
                </button>
                {userDropdown && (
                  <div className="absolute right-0 top-12 w-52 bg-white dark:bg-navy-800 rounded-xl shadow-2xl border border-cream-300 dark:border-navy-700 py-1 z-10">
                    <div className="px-4 py-2 border-b border-cream-200 dark:border-navy-850">
                      <p className="text-sm font-semibold text-gray-900 dark:text-blue-100 truncate">{user.name}</p>
                      <p className={`text-xs font-medium ${roleInfo?.color}`}>{roleInfo?.label}</p>
                    </div>
                    <Link to="/mis-pedidos" onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-blue-200 hover:bg-cream-200 dark:hover:bg-navy-700 transition-colors">
                      <ClipboardList size={15} /> Mis Pedidos
                    </Link>
                    <Link to="/catalogo?tab=favoritos" onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-blue-200 hover:bg-cream-200 dark:hover:bg-navy-700 transition-colors">
                      <Heart size={15} /> Favoritos
                    </Link>
                    {isEmployee && (
                      <Link to="/admin/catalogo" onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-cream-200 dark:hover:bg-navy-700 transition-colors font-semibold">
                        <LayoutDashboard size={15} /> Panel Admin
                      </Link>
                    )}
                    <button onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                      <LogOut size={15} /> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : FEATURE_LOGIN ? (
              <button onClick={openLogin} className="btn-primary text-sm hidden sm:flex items-center gap-1.5">
                <User size={16} /> Ingresar
              </button>
            ) : null}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(s => !s)}
              className="btn-ghost p-2 rounded-full md:hidden"
              aria-label="Menú"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-navy-900 border-t border-cream-300 dark:border-navy-800 shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`btn-ghost text-sm justify-start ${isActive(to) ? 'text-primary-700 bg-cream-200 dark:bg-navy-800 font-semibold' : ''}`}
              >
                {label}
              </Link>
            ))}
            {isEmployee && (
              <Link to="/admin/catalogo" className="btn-ghost text-sm justify-start flex items-center gap-1.5 text-primary-600 font-semibold">
                <LayoutDashboard size={15} /> Panel Admin
              </Link>
            )}
            {!user && FEATURE_LOGIN && (
              <button onClick={() => { openLogin(); setMobileOpen(false) }} className="btn-primary mt-2 text-sm">
                Ingresar / Registrarse
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
