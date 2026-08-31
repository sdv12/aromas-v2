import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import {
  ClipboardList, ChevronDown, ChevronUp, Package,
  ArrowRight, Clock, CheckCircle, Truck, XCircle
} from 'lucide-react'
import { useOrders } from '../context/OrdersContext'
import { useAuth }   from '../context/AuthContext'

const STATUS_CONFIG = {
  pendiente:  { label: 'Pendiente',  color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400', Icon: Clock },
  confirmado: { label: 'Confirmado', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',         Icon: CheckCircle },
  enviado:    { label: 'Enviado',    color: 'bg-primary-100 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400', Icon: Truck },
  entregado:  { label: 'Entregado', color: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',      Icon: CheckCircle },
  cancelado:  { label: 'Cancelado', color: 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400',              Icon: XCircle },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pendiente
  const Icon = cfg.Icon
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
      <Icon size={12} /> {cfg.label}
    </span>
  )
}

function OrderCard({ order }) {
  const [open, setOpen] = useState(false)
  const date = new Date(order.date)
  const formatted = date.toLocaleDateString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="card overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 text-left hover:bg-primary-50/50 dark:hover:bg-navy-800/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-navy-800 flex items-center justify-center shrink-0">
            <Package size={18} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">{order.id}</p>
            <p className="text-xs text-gray-400 mt-0.5">{formatted}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-0.5">{order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}</p>
            <p className="font-bold text-gray-900 dark:text-white">${order.total.toLocaleString('es-AR')}</p>
          </div>
          <StatusBadge status={order.status} />
          <span className="text-gray-400 shrink-0">
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>
      </button>

      {/* Detail */}
      {open && (
        <div className="border-t border-gray-100 dark:border-navy-700 px-5 pb-5 pt-4">
          <div className="space-y-3 mb-4">
            {order.items.map((item, i) => {
              const unit = order.isWholesale ? item.wholesalePrice : item.price
              return (
                <div key={i} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover shrink-0 bg-gray-100"
                    onError={e => { e.target.src = 'https://placehold.co/48x48/d8edf8/1285b5?text=A' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.qty} × ${unit.toLocaleString('es-AR')}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white shrink-0">
                    ${(unit * item.qty).toLocaleString('es-AR')}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Totals */}
          <div className="bg-primary-50 dark:bg-navy-800 rounded-xl p-4 text-sm space-y-1.5">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span>${order.subtotal.toLocaleString('es-AR')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Cupón</span>
                <span>-${order.discount.toLocaleString('es-AR')}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Envío</span>
              <span>${order.shipping.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-1.5 border-t border-primary-200 dark:border-navy-700">
              <span>Total</span>
              <span>${order.total.toLocaleString('es-AR')}</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Link
              to="/catalogo"
              className="btn-outline text-sm py-2 flex items-center gap-1.5"
            >
              Volver a comprar <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrderHistory() {
  usePageTitle('Mis Pedidos')
  const { orders } = useOrders()
  const { user } = useAuth()

  if (!user && orders.length === 0) {
    return (
      <div className="max-w-lg mx-auto py-24 px-4 text-center">
        <ClipboardList size={56} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 dark:text-blue-200 mb-2">Todavía no hiciste pedidos</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Cuando confirmes un pedido lo vas a ver acá. Los pedidos como invitado se guardan en este dispositivo.
        </p>
        <Link to="/catalogo" className="btn-primary inline-flex items-center gap-2">
          Ir al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Mis Pedidos</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {orders.length === 0
            ? 'Aún no realizaste pedidos.'
            : `${orders.length} ${orders.length === 1 ? 'pedido' : 'pedidos'} realizados`}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <ClipboardList size={56} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">
            Aún no realizaste ningún pedido.
          </p>
          <Link to="/catalogo" className="btn-primary inline-flex items-center gap-2">
            Explorar productos <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
