import { useState } from 'react'
import { X, Eye, EyeOff, Mail, Lock, User, Crown } from 'lucide-react'
import { useAuth, ROLES } from '../../context/AuthContext'

export default function AuthModal() {
  const { authModal, setAuthModal, authTab, setAuthTab, login, loginWithGoogle, register, resetPassword } = useAuth()

  const [loginData,    setLoginData]    = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', role: ROLES.CLIENTE })
  const [showPass,  setShowPass]  = useState(false)
  const [error,     setError]     = useState('')
  const [info,      setInfo]      = useState('')
  const [loading,   setLoading]   = useState(false)

  if (!authModal) return null

  const handleLogin = async e => {
    e.preventDefault()
    setError(''); setInfo('')
    setLoading(true)
    const res = await login(loginData.email, loginData.password)
    setLoading(false)
    if (res.error) setError(res.error)
  }

  const handleRegister = async e => {
    e.preventDefault()
    setError(''); setInfo('')
    if (!registerData.name || !registerData.email || !registerData.password) {
      setError('Completá todos los campos.'); return
    }
    setLoading(true)
    const res = await register(registerData.name, registerData.email, registerData.password, registerData.role)
    setLoading(false)
    if (res.error) setError(res.error)
  }

  const handleGoogle = async () => {
    setError(''); setInfo('')
    setLoading(true)
    const res = await loginWithGoogle()
    setLoading(false)
    if (res?.error) setError(res.error)
  }

  const handleForgotPassword = async () => {
    if (!loginData.email) { setError('Ingresá tu email para recuperar la contraseña.'); return }
    setError(''); setLoading(true)
    const res = await resetPassword(loginData.email)
    setLoading(false)
    if (res.error) setError(res.error)
    else setInfo('Te enviamos un email para restablecer tu contraseña.')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) setAuthModal(false) }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-[860px] overflow-hidden flex flex-col md:flex-row relative">
        <button
          onClick={() => setAuthModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Left: Form */}
        <div className="flex-1 p-8 md:p-10">
          <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1 mb-7 w-fit">
            {['login', 'register'].map(tab => (
              <button
                key={tab}
                onClick={() => { setAuthTab(tab); setError(''); setInfo('') }}
                className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${
                  authTab === tab
                    ? 'bg-white dark:bg-gray-700 text-primary-600 shadow'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {tab === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg">A</div>
            <span className="font-bold text-xl text-gray-900 dark:text-white tracking-widest" style={{fontFamily:'Georgia,serif'}}>AURA</span>
          </div>

          {authTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" className="input pl-9" placeholder="tu@email.com"
                    value={loginData.email} onChange={e => setLoginData(d => ({ ...d, email: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} className="input pl-9 pr-10" placeholder="••••••••"
                    value={loginData.password} onChange={e => setLoginData(d => ({ ...d, password: e.target.value }))} required />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="button" onClick={handleForgotPassword}
                className="text-xs text-primary-600 hover:underline">
                Olvidé mi contraseña
              </button>
              {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950 rounded-lg px-3 py-2">{error}</p>}
              {info  && <p className="text-sm text-green-600 bg-green-50 dark:bg-green-950 rounded-lg px-3 py-2">{info}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Ingresando…' : 'Iniciar Sesión'}
              </button>
              <div className="relative flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <span className="text-xs text-gray-400">o</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>
              <button type="button" onClick={handleGoogle} disabled={loading}
                className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-400 rounded-lg py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all">
                <GoogleIcon />
                Continuar con Google
              </button>
              <p className="text-xs text-center text-gray-500 mt-1">
                ¿Sin cuenta?{' '}
                <button type="button" onClick={() => setAuthTab('register')} className="text-primary-600 hover:underline font-medium">Registrarse gratis</button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre completo</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" className="input pl-9" placeholder="Tu nombre"
                    value={registerData.name} onChange={e => setRegisterData(d => ({ ...d, name: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" className="input pl-9" placeholder="tu@email.com"
                    value={registerData.email} onChange={e => setRegisterData(d => ({ ...d, email: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} className="input pl-9 pr-10" placeholder="Mínimo 6 caracteres"
                    value={registerData.password} onChange={e => setRegisterData(d => ({ ...d, password: e.target.value }))} required />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de cuenta</label>
                <select className="input" value={registerData.role} onChange={e => setRegisterData(d => ({ ...d, role: e.target.value }))}>
                  <option value={ROLES.CLIENTE}>Cliente (Retail)</option>
                  <option value={ROLES.MINORISTA}>Minorista</option>
                  <option value={ROLES.MAYORISTA}>Mayorista</option>
                </select>
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950 rounded-lg px-3 py-2">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Creando cuenta…' : 'Crear Cuenta Gratis'}
              </button>
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <span className="text-xs text-gray-400">o</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>
              <button type="button" onClick={handleGoogle} disabled={loading}
                className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-400 rounded-lg py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all">
                <GoogleIcon />
                Continuar con Google
              </button>
              <p className="text-xs text-center text-gray-500">
                ¿Ya tenés cuenta?{' '}
                <button type="button" onClick={() => setAuthTab('login')} className="text-primary-600 hover:underline font-medium">Iniciar sesión</button>
              </p>
            </form>
          )}
        </div>

        {/* Right: Promo */}
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-primary-600 to-primary-800 text-white p-10 w-80 shrink-0">
          <Crown size={40} className="text-yellow-300 mb-4" />
          <h2 className="text-2xl font-bold mb-3">¿Nuevo Cliente?</h2>
          <p className="text-primary-100 text-sm leading-relaxed mb-6">
            Registrate y accedé a precios especiales, historial de pedidos y beneficios exclusivos.
          </p>
          <ul className="space-y-3 text-sm text-primary-100">
            {['✓ Acceso a precios Mayoristas','✓ Historial de pedidos','✓ Favoritos guardados','✓ Ofertas exclusivas'].map(i => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
