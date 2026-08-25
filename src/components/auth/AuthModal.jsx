import { useState } from 'react'
import { X, Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { useAuth, ROLES } from '../../context/AuthContext'
import { FEATURE_LOGIN } from '../../config/features'

export default function AuthModal() {
  const {
    authModal, setAuthModal,
    authTab,   setAuthTab,
    login, register, resetPassword,
  } = useAuth()

  const [loginData,    setLoginData]    = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' })
  const [showPass,  setShowPass]  = useState(false)
  const [error,     setError]     = useState('')
  const [info,      setInfo]      = useState('')
  const [loading,   setLoading]   = useState(false)
  const [forgotMode, setForgotMode] = useState(false)

  if (!FEATURE_LOGIN || !authModal) return null

  const reset = () => { setError(''); setInfo(''); setForgotMode(false) }

  const switchTab = tab => { setAuthTab(tab); reset() }
  const close     = ()  => { setAuthModal(false); reset() }

  /* ── Login ───────────────────────────────── */
  const handleLogin = async e => {
    e.preventDefault()
    setError(''); setInfo('')
    setLoading(true)
    const res = await login(loginData.email, loginData.password)
    setLoading(false)
    if (res.error) setError(res.error)
  }

  /* ── Forgot password ─────────────────────── */
  const handleForgot = async e => {
    e.preventDefault()
    if (!loginData.email) { setError('Ingresá tu email primero.'); return }
    setError(''); setLoading(true)
    const res = await resetPassword(loginData.email)
    setLoading(false)
    if (res.error) setError(res.error)
    else setInfo('Te enviamos un email para restablecer tu contraseña.')
  }

  /* ── Register ────────────────────────────── */
  const handleRegister = async e => {
    e.preventDefault()
    setError('')
    const { name, email, password } = registerData
    if (!name.trim()) { setError('Ingresá tu nombre.'); return }
    if (!email)       { setError('Ingresá tu email.'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    setLoading(true)
    // Siempre se registra como cliente — el admin asigna otros roles
    const res = await register(name.trim(), email, password, ROLES.CLIENTE)
    setLoading(false)
    if (res.error) setError(res.error)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) close() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[820px] overflow-hidden flex relative">

        {/* Close */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-gray-400
                     hover:text-gray-700 hover:bg-cream-100 transition-colors"
        >
          <X size={17} />
        </button>

        {/* ── Left: Form ─────────────────────── */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">

          {/* Logo + brand */}
          <div className="mb-7">
            <img src="/logo-aura.png" alt="Aura" className="h-10 w-auto object-contain mb-2" />
            <p className="text-xs text-gray-400 tracking-widest uppercase">Aromas Córdoba</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 mb-7 border-b border-cream-300">
            {[
              { key: 'login',    label: 'Iniciar sesión' },
              { key: 'register', label: 'Crear cuenta'   },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => switchTab(key)}
                className={`pb-3 px-1 mr-5 text-sm font-semibold transition-all border-b-2 -mb-px ${
                  authTab === key
                    ? 'border-primary-700 text-primary-700'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Login form ── */}
          {authTab === 'login' && (
            <form onSubmit={forgotMode ? handleForgot : handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email" className="input pl-9" placeholder="tu@email.com"
                    value={loginData.email}
                    onChange={e => setLoginData(d => ({ ...d, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {!forgotMode && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPass ? 'text' : 'password'} className="input pl-9 pr-10"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={e => setLoginData(d => ({ ...d, password: e.target.value }))}
                      required
                    />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              )}

              {error && <Feedback type="error">{error}</Feedback>}
              {info  && <Feedback type="info">{info}</Feedback>}

              <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
                {loading
                  ? (forgotMode ? 'Enviando…' : 'Ingresando…')
                  : (forgotMode ? 'Enviar link de recuperación' : 'Iniciar sesión')
                }
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => { setForgotMode(s => !s); setError(''); setInfo('') }}
                  className="text-xs text-gray-400 hover:text-primary-700 transition-colors"
                >
                  {forgotMode ? '← Volver al login' : 'Olvidé mi contraseña'}
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('register')}
                  className="text-xs text-primary-700 hover:underline font-medium"
                >
                  Crear cuenta gratis →
                </button>
              </div>
            </form>
          )}

          {/* ── Register form ── */}
          {authTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Nombre completo
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text" className="input pl-9" placeholder="Tu nombre"
                    value={registerData.name}
                    onChange={e => setRegisterData(d => ({ ...d, name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email" className="input pl-9" placeholder="tu@email.com"
                    value={registerData.email}
                    onChange={e => setRegisterData(d => ({ ...d, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'} className="input pl-9 pr-10"
                    placeholder="Mínimo 6 caracteres"
                    value={registerData.password}
                    onChange={e => setRegisterData(d => ({ ...d, password: e.target.value }))}
                    required
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && <Feedback type="error">{error}</Feedback>}

              <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
                {loading ? 'Creando cuenta…' : 'Crear cuenta gratis'}
              </button>

              {/* Wholesale upsell hint */}
              <p className="text-xs text-gray-400 text-center leading-relaxed">
                ¿Sos revendedor o distribuidora?{' '}
                <span className="text-accent-600 font-medium">
                  Podés solicitar acceso mayorista una vez registrado.
                </span>
              </p>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className="text-xs text-gray-400 hover:text-primary-700 transition-colors"
                >
                  ¿Ya tenés cuenta? Iniciar sesión →
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── Right: Brand panel ──────────────── */}
        <div
          className="hidden md:flex flex-col items-center justify-center w-72 shrink-0 p-10"
          style={{ background: 'linear-gradient(160deg, #273145 0%, #1e2636 100%)' }}
        >
          {/* Logo en blanco */}
          <img
            src="/logo-aura.png"
            alt="Aura"
            className="h-16 w-auto object-contain mb-6"
            style={{ filter: 'brightness(0) invert(1)' }}
          />

          {/* Línea accent */}
          <div className="w-10 h-0.5 mb-6" style={{ backgroundColor: '#b6a183' }} />

          {/* Tagline */}
          <p
            className="text-center text-sm leading-relaxed mb-8"
            style={{ color: '#ede7dc', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
          >
            Fragancias que<br />transforman cada espacio
          </p>

          {/* Beneficios */}
          <ul className="space-y-3 w-full">
            {[
              'Acceso a precios exclusivos',
              'Historial de pedidos',
              'Favoritos guardados',
              'Promos mayoristas',
            ].map(item => (
              <li key={item} className="flex items-center gap-2.5 text-xs" style={{ color: '#b6a183' }}>
                <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: '#b6a183' }} />
                <span style={{ color: '#cfc0ae' }}>{item}</span>
              </li>
            ))}
          </ul>

          {/* Footer del panel */}
          <p className="mt-10 text-xs" style={{ color: '#5a7a9a' }}>
            Córdoba, Argentina
          </p>
        </div>

      </div>
    </div>
  )
}

/* Componente interno de feedback */
function Feedback({ type, children }) {
  const styles = {
    error: 'bg-red-50 border border-red-200 text-red-700',
    info:  'bg-cream-100 border border-cream-300 text-primary-700',
  }
  return (
    <p className={`text-sm rounded-lg px-3 py-2.5 ${styles[type]}`}>
      {children}
    </p>
  )
}
