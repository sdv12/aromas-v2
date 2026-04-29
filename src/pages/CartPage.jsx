import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Mail,
  CreditCard, MessageCircle, Landmark, Loader2, AlertCircle
} from 'lucide-react'
import { useCart }          from '../context/CartContext'
import { useAuth }          from '../context/AuthContext'
import { useOrders }        from '../context/OrdersContext'
import { createPreference } from '../services/mercadopago'
import { WHATSAPP_NUMBER, CONTACT_EMAIL } from '../config/contact'

const SHIPPING = 5500

const PAYMENT_METHODS = [
  {
    id:    'whatsapp',
    label: 'WhatsApp',
    desc:  'Confirmá tu pedido por WhatsApp y coordinamos el pago',
    Icon:  MessageCircle,
    color: 'border-green-400 bg-green-50 dark:bg-green-950/20',
    check: 'accent-green-500',
  },
  {
    id:    'mercadopago',
    label: 'MercadoPago',
    desc:  'Tarjeta, débito, cuotas o dinero en cuenta',
    Icon:  CreditCard,
    color: 'border-primary-400 bg-primary-50 dark:bg-navy-800',
    check: 'accent-primary-600',
  },
  {
    id:    'transferencia',
    label: 'Transferencia bancaria',
    desc:  'CBU / Alias — enviamos los datos por WhatsApp',
    Icon:  Landmark,
    color: 'border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-800',
    check: 'accent-gray-500',
  },
]

function buildWhatsAppMessage(items, subtotal, isWholesale) {
  const lines = items.map(i => {
    const price = isWholesale ? i.wholesalePrice : i.price
    return `• ${i.name} x${i.qty} = $${(price * i.qty).toLocaleString('es-AR')}`
  }).join('\n')
  const total = subtotal + SHIPPING
  return encodeURIComponent(
    `Hola Aromas CBA! 👋\n\nQuiero confirmar el siguiente pedido:\n\n${lines}\n\nSubtotal: $${subtotal.toLocaleString('es-AR')}\nEnvío: $${SHIPPING.toLocaleString('es-AR')}\n*Total: $${total.toLocaleString('es-AR')}*\n\nPor favor confirmame disponibilidad. ¡Gracias!`
  )
}

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, subtotal } = useCart()
  const { user, isWholesale, openLogin } = useAuth()
  const { addOrder } = useOrders()
  const navigate     = useNavigate()

  const [coupon,        setCoupon]        = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError,   setCouponError]   = useState('')
  const [payMethod,     setPayMethod]     = useState('whatsapp')
  const [mpLoading,     setMpLoading]     = useState(false)
  const [mpError,       setMpError]       = useState('')

  const sub      = subtotal(isWholesale)
  const discount = couponApplied ? Math.round(sub * 0.1) : 0
  const total    = sub - discount + SHIPPING

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'AROMAS10') {
      setCouponApplied(true); setCouponError('')
    } else {
      setCouponError('Cupón inválido.')
    }
  }

  const saveOrder = (extra = {}) => addOrder({
    items:         items.map(i => ({ ...i })),
    subtotal:      sub - discount,
    discount,
    shipping:      SHIPPING,
    total,
    isWholesale,
    couponApplied,
    paymentMethod: payMethod,
    ...extra,
  })

  const handleWhatsApp = () => {
    if (!user) { openLogin(); return }
    const msg = buildWhatsAppMessage(items, sub - discount, isWholesale)
    const emailBody = encodeURIComponent(
      `Hola,\n\nGracias por tu pedido en Aromas CBA.\n\nDetalle:\n${
        items.map(i => {
          const p = isWholesale ? i.wholesalePrice : i.price
          return `${i.name} x${i.qty} = $${(p * i.qty).toLocaleString('es-AR')}`
        }).join('\n')
      }\n\nTotal: $${total.toLocaleString('es-AR')}\n\n¡Nos pondremos en contacto pronto!\nAromas CBA`
    )
    saveOrder()
    window.open(`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Pedido – Aromas CBA')}&body=${emailBody}`, '_blank')
    setTimeout(() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank'), 500)
    clearCart()
    navigate('/mis-pedidos')
  }

  const handleMercadoPago = async () => {
    if (!user) { openLogin(); return }
    setMpLoading(true)
    setMpError('')
    try {
      const order = saveOrder()
      const origin = window.location.origin
      const pref = await createPreference({
        items,
        payer:   { email: user.email, name: user.name },
        orderId: order.id,
        backUrls: {
          success: `${origin}/pago/resultado?status=approved`,
          failure: `${origin}/pago/resultado?status=failure`,
          pending: `${origin}/pago/resultado?status=pending`,
        },
      })
      clearCart()
      if (pref.init_point) {
        window.location.href = pref.init_point
      } else {
        // Demo mode — no real MP URL
        navigate(`/pago/resultado?status=demo&external_reference=${order.id}`)
      }
    } catch (err) {
      setMpError(err.message || 'Error al conectar con MercadoPago.')
    } finally {
      setMpLoading(false)
    }
  }

  const handleTransferencia = () => {
    if (!user) { openLogin(); return }
    const msg = encodeURIComponent(
      `Hola! Quiero hacer un pedido por transferencia bancaria.\n\nTotal: $${total.toLocaleString('es-AR')}\n\n¿Me pasás el CBU/Alias?`
    )
    saveOrder()
    clearCart()
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
    navigate('/mis-pedidos')
  }

  const handleCheckout = () => {
    if (payMethod === 'whatsapp')      handleWhatsApp()
    else if (payMethod === 'mercadopago') handleMercadoPago()
    else handleTransferencia()
  }

  const btnLabel = () => {
    if (!user) return 'Iniciar sesión para pedir'
    if (mpLoading) return 'Procesando…'
    if (payMethod === 'whatsapp')      return 'Confirmar por WhatsApp'
    if (payMethod === 'mercadopago')   return 'Pagar con MercadoPago'
    return 'Coordinar transferencia'
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
        {/* Items */}
        <div className="flex-1">
          <div className="card overflow-hidden">
            <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 bg-gray-50 dark:bg-navy-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <span>Producto</span>
              <span className="text-center">Cantidad</span>
              <span className="text-center">Unidad</span>
              <span className="text-right">Total</span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-navy-700">
              {items.map(item => {
                const unitPrice = isWholesale ? item.wholesalePrice : item.price
                return (
                  <div key={item.id} className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto_auto] gap-3 sm:gap-4 items-start sm:items-center px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                        <Trash2 size={16} />
                      </button>
                      <img
                        src={item.image} alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg shrink-0"
                        onError={e => { e.target.src = 'https://placehold.co/64x64/d8edf8/1285b5?text=A' }}
                      />
                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-xs text-gray-400">${unitPrice.toLocaleString('es-AR')} {isWholesale ? 'Mayorista' : 'Retail'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mx-auto">
                      <button onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 dark:border-navy-600 flex items-center justify-center hover:border-primary-500 hover:text-primary-600 transition-colors">
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center font-semibold text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 dark:border-navy-600 flex items-center justify-center hover:border-primary-500 hover:text-primary-600 transition-colors">
                        <Plus size={13} />
                      </button>
                    </div>

                    <div className="text-sm text-center text-gray-500 dark:text-gray-400 hidden sm:block">
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

          <div className="flex justify-between mt-4">
            <Link to="/catalogo" className="btn-ghost text-sm border border-gray-200 dark:border-navy-700">
              ← Seguir comprando
            </Link>
            <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1.5">
              <Trash2 size={14} /> Vaciar carrito
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="card p-5 sticky top-20 space-y-5">
            <h2 className="font-bold text-gray-900 dark:text-white">Resumen del Pedido</h2>

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal {isWholesale ? '(Mayorista)' : '(Retail)'}</span>
                <span>${sub.toLocaleString('es-AR')}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Cupón (10%)</span>
                  <span>-${discount.toLocaleString('es-AR')}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Envío</span>
                <span>${SHIPPING.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-navy-700">
                <span>Total</span>
                <span>${total.toLocaleString('es-AR')}</span>
              </div>
            </div>

            {/* Coupon */}
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="input pl-8 text-sm py-2"
                    placeholder="Cupón de descuento"
                    value={coupon}
                    onChange={e => { setCoupon(e.target.value); setCouponError('') }}
                    disabled={couponApplied}
                  />
                </div>
                <button onClick={applyCoupon} disabled={couponApplied} className="btn-outline text-sm px-3 py-2 shrink-0">
                  {couponApplied ? '✓' : 'Aplicar'}
                </button>
              </div>
              {couponError   && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
              {couponApplied && <p className="text-xs text-green-600 mt-1">10% de descuento aplicado</p>}
              <p className="text-xs text-gray-400 mt-1">Prueba: AROMAS10</p>
            </div>

            {/* Payment method */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-blue-200 mb-2">Método de pago</p>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(m => {
                  const Icon = m.Icon
                  const active = payMethod === m.id
                  return (
                    <label
                      key={m.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        active ? m.color + ' border-opacity-100' : 'border-gray-200 dark:border-navy-700 hover:border-gray-300 dark:hover:border-navy-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        value={m.id}
                        checked={active}
                        onChange={() => { setPayMethod(m.id); setMpError('') }}
                        className={`shrink-0 ${m.check}`}
                      />
                      <Icon size={18} className={active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">{m.label}</p>
                        <p className="text-xs text-gray-400 leading-tight">{m.desc}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* MP demo notice */}
            {payMethod === 'mercadopago' && !import.meta.env.VITE_MP_BACKEND_URL && (
              <div className="flex items-start gap-2 text-xs bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-yellow-700 dark:text-yellow-400">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>Modo demo — el pago real se activa al conectar el backend.</span>
              </div>
            )}

            {/* MP error */}
            {mpError && (
              <p className="text-xs text-red-600 flex items-center gap-1.5">
                <AlertCircle size={13} /> {mpError}
              </p>
            )}

            {/* Confirm button */}
            <button
              onClick={handleCheckout}
              disabled={mpLoading}
              className={`w-full flex items-center justify-center gap-2 font-semibold py-3 px-5 rounded-lg transition-all active:scale-95 ${
                mpLoading ? 'bg-gray-200 dark:bg-navy-700 text-gray-400 cursor-not-allowed' : 'btn-primary'
              }`}
            >
              {mpLoading ? (
                <><Loader2 size={18} className="animate-spin" /> Procesando…</>
              ) : payMethod === 'whatsapp' ? (
                <>
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {user ? 'Confirmar por WhatsApp' : 'Iniciar sesión para pedir'}
                </>
              ) : payMethod === 'mercadopago' ? (
                <><CreditCard size={18} /> {user ? 'Pagar con MercadoPago' : 'Iniciar sesión para pedir'}</>
              ) : (
                <><Mail size={18} /> {user ? 'Coordinar transferencia' : 'Iniciar sesión para pedir'}</>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center">
              {payMethod === 'whatsapp'
                ? 'Se abrirá WhatsApp con tu pedido listo para enviar.'
                : payMethod === 'mercadopago'
                ? 'Serás redirigido al checkout seguro de MercadoPago.'
                : 'Te enviaremos el CBU/Alias por WhatsApp para coordinar.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
