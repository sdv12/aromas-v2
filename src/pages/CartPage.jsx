import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowRight,
  Truck, Landmark, Banknote, Package, MapPin, Gift,
  User, Phone, Mail, MapPinIcon, Hash, Building2,
  CheckCircle, ChevronDown, ChevronUp,
} from 'lucide-react'
import { useCart }    from '../context/CartContext'
import { useAuth }    from '../context/AuthContext'
import { useOrders }  from '../context/OrdersContext'
import { WHATSAPP_NUMBER } from '../config/contact'

const FREE_THRESHOLD     = 120000
const CORDOBA_COST       = 8000
const CUSTOMER_KEY       = 'aromascba_customer_v2'

const SHIPPING_OPTIONS = [
  {
    id: 'cordoba',
    label: 'Envío Córdoba Capital',
    desc: `$${CORDOBA_COST.toLocaleString('es-AR')} · Gratis superando $${(FREE_THRESHOLD/1000).toFixed(0)}k`,
    Icon: Truck,
    calc: (sub) => sub >= FREE_THRESHOLD ? 0 : CORDOBA_COST,
  },
  {
    id: 'despacho',
    label: 'Despacho (correo / encomienda)',
    desc: 'A calcular según destino y peso — lo coordinamos por WhatsApp',
    Icon: Package,
    calc: () => 0,
  },
  {
    id: 'sucursal',
    label: 'Retiro en sucursal',
    desc: 'Sin costo · Te avisamos cuando está listo',
    Icon: MapPin,
    calc: () => 0,
  },
  {
    id: 'comisionista',
    label: 'Retiro por comisionista',
    desc: 'A coordinar directamente',
    Icon: Gift,
    calc: () => 0,
  },
]

const PAYMENT_METHODS = [
  {
    id: 'efectivo',
    label: 'Efectivo',
    desc: 'Pagás al momento de recibir o retirar',
    Icon: Banknote,
  },
  {
    id: 'transferencia',
    label: 'Transferencia bancaria',
    desc: 'CBU / Alias — te enviamos los datos por WhatsApp',
    Icon: Landmark,
  },
]

const EMPTY_CUSTOMER = { name: '', dni: '', phone: '', email: '', address: '', cp: '', province: 'Córdoba', city: '' }

function loadCustomer() {
  try { return { ...EMPTY_CUSTOMER, ...JSON.parse(localStorage.getItem(CUSTOMER_KEY)) } }
  catch { return { ...EMPTY_CUSTOMER } }
}
function saveCustomer(d) {
  try { localStorage.setItem(CUSTOMER_KEY, JSON.stringify(d)) } catch { /* ignore */ }
}

function StockRestante({ stock, qty }) {
  if (stock == null) return null
  const r = stock - qty
  if (stock === 0) return <span className="text-[11px] font-semibold text-red-600">Sin stock</span>
  if (r <= 0)      return <span className="text-[11px] font-semibold text-red-600">Máx: {stock}</span>
  if (r <= 3)      return <span className="text-[11px] font-semibold text-yellow-600">Quedan {r}</span>
  return null
}

export default function CartPage() {
  usePageTitle('Carrito de Compras')
  const { items, removeItem, updateQty, clearCart, subtotal } = useCart()
  const { user, isWholesale } = useAuth()
  const { addOrder }  = useOrders()
  const navigate      = useNavigate()

  const [shippingId,  setShippingId]  = useState('cordoba')
  const [payMethod,   setPayMethod]   = useState('efectivo')
  const [customer,    setCustomer]    = useState(loadCustomer)
  const [errors,      setErrors]      = useState({})
  const [formOpen,    setFormOpen]    = useState(true)

  const sub         = subtotal(isWholesale)
  const shippingOpt = SHIPPING_OPTIONS.find(o => o.id === shippingId)
  const shippingCost= shippingOpt.calc(sub)
  const total       = sub + shippingCost
  const isFree      = shippingId === 'cordoba' && sub >= FREE_THRESHOLD
  const progress    = Math.min(100, (sub / FREE_THRESHOLD) * 100)
  const remaining   = Math.max(0, FREE_THRESHOLD - sub)

  const setField = (k) => (e) => {
    const next = { ...customer, [k]: e.target.value }
    setCustomer(next)
    saveCustomer(next)
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const err = {}
    if (!customer.name.trim())  err.name  = 'Requerido'
    if (!customer.phone.trim()) err.phone = 'Requerido'
    setErrors(err)
    return !Object.keys(err).length
  }

  const buildWA = () => {
    const lines = items.map(i => {
      const p = isWholesale ? i.wholesalePrice : i.price
      return `• ${i.name} x${i.qty} = $${(p * i.qty).toLocaleString('es-AR')}`
    }).join('\n')

    const shippingLine = shippingId === 'cordoba'
      ? `📦 Envío Córdoba: ${isFree ? '¡GRATIS! 🎉' : `$${shippingCost.toLocaleString('es-AR')}`}`
      : `📦 Envío: ${shippingOpt.label} (a coordinar)`

    return encodeURIComponent(
      `Hola Aromas Córdoba! 👋\n\n` +
      `📝 *DATOS DEL PEDIDO*\n` +
      `👤 ${customer.name}\n` +
      (customer.dni     ? `🆔 DNI/CUIT: ${customer.dni}\n`   : '') +
      `📱 Celular: ${customer.phone}\n` +
      (customer.email   ? `📧 ${customer.email}\n`            : '') +
      (customer.address ? `📍 ${customer.address}\n`          : '') +
      (customer.city    ? `🏙️ ${customer.city}${customer.province ? `, ${customer.province}` : ''}${customer.cp ? ` (CP ${customer.cp})` : ''}\n` : '') +
      `\n🛒 *PRODUCTOS*\n${lines}\n\n` +
      `Subtotal: $${sub.toLocaleString('es-AR')}\n` +
      `${shippingLine}\n` +
      `*TOTAL: $${total.toLocaleString('es-AR')}*\n\n` +
      `💳 Pago: ${payMethod === 'efectivo' ? 'Efectivo' : 'Transferencia bancaria'}\n\n` +
      `Quedo en espera de confirmación. ¡Gracias! 😊`
    )
  }

  const handleConfirm = async () => {
    if (!validate()) { setFormOpen(true); return }
    await addOrder({
      items: items.map(i => ({ ...i })),
      subtotal: sub,
      shipping: shippingCost,
      shippingOption: shippingId,
      total,
      isWholesale,
      paymentMethod: payMethod,
      customer: { ...customer },
    })
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWA()}`, '_blank')
    clearCart()
    navigate('/mis-pedidos')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Agregá productos desde nuestro catálogo</p>
        <Link to="/catalogo" className="btn-primary inline-flex items-center gap-2">
          Ir al Catálogo <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Carrito de Compras</h1>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── Columna izquierda: Items ── */}
        <div className="flex-1 space-y-4">

          {/* Items */}
          <div className="card overflow-hidden">
            <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 bg-cream-100 dark:bg-navy-800 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span>Producto</span>
              <span className="text-center">Cant.</span>
              <span className="text-center">Precio</span>
              <span className="text-right">Total</span>
            </div>

            <div className="divide-y divide-cream-100 dark:divide-navy-700">
              {items.map(item => {
                const unitPrice = isWholesale ? item.wholesalePrice : item.price
                return (
                  <div key={item.id} className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto_auto] gap-3 sm:gap-4 items-start sm:items-center px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                        <Trash2 size={15} />
                      </button>
                      <img
                        src={item.image} alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg shrink-0 bg-cream-100"
                        onError={e => { e.target.src = 'https://placehold.co/56x56/ede5d8/273145?text=A' }}
                      />
                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">{item.name}</p>
                        <p className="text-xs text-gray-400">{isWholesale ? 'Precio mayorista' : 'Precio minorista'}</p>
                      </div>
                    </div>

                    <div className="mx-auto flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-7 h-7 rounded-full border border-cream-300 dark:border-navy-600 flex items-center justify-center hover:border-primary-500 hover:text-primary-600 transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center font-semibold text-sm">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          disabled={item.stock != null && item.qty >= item.stock}
                          className="w-7 h-7 rounded-full border border-cream-300 dark:border-navy-600 flex items-center justify-center hover:border-primary-500 hover:text-primary-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                          <Plus size={12} />
                        </button>
                      </div>
                      <StockRestante stock={item.stock} qty={item.qty} />
                    </div>

                    <div className="text-sm text-center text-gray-500 hidden sm:block">
                      ${unitPrice.toLocaleString('es-AR')}
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white text-right ml-auto sm:ml-0">
                      ${(unitPrice * item.qty).toLocaleString('es-AR')}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex justify-between">
            <Link to="/catalogo" className="btn-ghost text-sm border border-cream-300 dark:border-navy-700">
              ← Seguir comprando
            </Link>
            <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1.5">
              <Trash2 size={14} /> Vaciar carrito
            </button>
          </div>

          {/* ── Datos del cliente ── */}
          <div className="card overflow-hidden">
            <button
              onClick={() => setFormOpen(s => !s)}
              className="w-full flex items-center justify-between px-5 py-4 font-bold text-gray-900 dark:text-white"
            >
              <span className="flex items-center gap-2">
                <User size={17} className="text-primary-600" />
                📝 Datos para el envío
                {(!customer.name || !customer.phone) && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Requerido</span>
                )}
              </span>
              {formOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>

            {formOpen && (
              <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Nombre */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    👤 Nombre y Apellido *
                  </label>
                  <input
                    className={`input text-sm ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Ej: María García"
                    value={customer.name}
                    onChange={setField('name')}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
                </div>

                {/* DNI */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    🆔 DNI o CUIT
                  </label>
                  <input
                    className="input text-sm"
                    placeholder="Ej: 30.123.456"
                    value={customer.dni}
                    onChange={setField('dni')}
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    📱 Celular / WhatsApp *
                  </label>
                  <input
                    className={`input text-sm ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="Ej: 351 123 4567"
                    value={customer.phone}
                    onChange={setField('phone')}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-0.5">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    📧 Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="input text-sm"
                    placeholder="tu@email.com"
                    value={customer.email}
                    onChange={setField('email')}
                  />
                </div>

                {/* Dirección */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    📍 Dirección
                  </label>
                  <input
                    className="input text-sm"
                    placeholder="Ej: Av. San Martín 1234, piso 2"
                    value={customer.address}
                    onChange={setField('address')}
                  />
                </div>

                {/* CP */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    CP
                  </label>
                  <input
                    className="input text-sm"
                    placeholder="Ej: 5000"
                    value={customer.cp}
                    onChange={setField('cp')}
                  />
                </div>

                {/* Provincia */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Prov.
                  </label>
                  <input
                    className="input text-sm"
                    placeholder="Córdoba"
                    value={customer.province}
                    onChange={setField('province')}
                  />
                </div>

                {/* Localidad */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    🏙️ Localidad
                  </label>
                  <input
                    className="input text-sm"
                    placeholder="Ej: Córdoba Capital"
                    value={customer.city}
                    onChange={setField('city')}
                  />
                </div>

                <p className="sm:col-span-2 text-xs text-gray-400">
                  ✨ Tus datos se guardan automáticamente para futuras compras.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Columna derecha: Resumen ── */}
        <div className="lg:w-80 shrink-0">
          <div className="card p-5 sticky top-20 space-y-5">

            {/* Free shipping progress */}
            {shippingId === 'cordoba' && (
              <div className="rounded-xl border border-green-200 dark:border-green-900 p-3 bg-green-50 dark:bg-green-950/20">
                {isFree ? (
                  <p className="text-sm font-bold text-green-700 dark:text-green-400 flex items-center gap-1.5">
                    <CheckCircle size={16} /> ¡Envío GRATIS a Córdoba Capital!
                  </p>
                ) : (
                  <>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                      Te faltan <span className="font-bold text-primary-700">${remaining.toLocaleString('es-AR')}</span> para envío gratis
                    </p>
                    <div className="w-full h-2 bg-cream-200 dark:bg-navy-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Envío gratis a Córdoba superando $120.000</p>
                  </>
                )}
              </div>
            )}

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>${sub.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Envío</span>
                <span className={isFree ? 'text-green-600 font-bold' : ''}>
                  {shippingId === 'cordoba'
                    ? isFree ? '¡Gratis!' : `$${shippingCost.toLocaleString('es-AR')}`
                    : 'A coordinar'}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white pt-2 border-t border-cream-200 dark:border-navy-700">
                <span>Total</span>
                <span>${total.toLocaleString('es-AR')}</span>
              </div>
            </div>

            {/* Shipping selector */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                <Truck size={15} /> Modalidad de envío
              </p>
              <div className="space-y-2">
                {SHIPPING_OPTIONS.map(opt => {
                  const Icon = opt.Icon
                  const active = shippingId === opt.id
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        active
                          ? 'border-primary-600 bg-primary-50 dark:bg-navy-800'
                          : 'border-cream-300 dark:border-navy-600 hover:border-primary-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingId"
                        checked={active}
                        onChange={() => setShippingId(opt.id)}
                        className="mt-0.5 shrink-0 accent-primary-600"
                      />
                      <Icon size={16} className={`mt-0.5 shrink-0 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">{opt.label}</p>
                        <p className="text-xs text-gray-400 leading-tight mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Payment method */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                <Banknote size={15} /> Método de pago
              </p>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(m => {
                  const Icon = m.Icon
                  const active = payMethod === m.id
                  return (
                    <label
                      key={m.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        active
                          ? 'border-primary-600 bg-primary-50 dark:bg-navy-800'
                          : 'border-cream-300 dark:border-navy-600 hover:border-primary-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        checked={active}
                        onChange={() => setPayMethod(m.id)}
                        className="shrink-0 accent-primary-600"
                      />
                      <Icon size={16} className={active ? 'text-primary-600' : 'text-gray-400'} />
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">{m.label}</p>
                        <p className="text-xs text-gray-400 leading-tight">{m.desc}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Confirm */}
            <button
              onClick={handleConfirm}
              className="w-full flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3.5 px-5 rounded-xl transition-all active:scale-95 shadow-md"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Confirmar por WhatsApp
            </button>
            <p className="text-xs text-gray-400 text-center">
              Se abrirá WhatsApp con tu pedido completo para confirmarlo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
