import { useSearchParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { CheckCircle, XCircle, Clock, ArrowRight, ShoppingBag, ClipboardList } from 'lucide-react'
import { useOrders } from '../context/OrdersContext'

const RESULTS = {
  approved: {
    icon:    CheckCircle,
    color:   'text-green-500',
    bg:      'bg-green-50 dark:bg-green-950/30',
    border:  'border-green-200 dark:border-green-800',
    title:   '¡Pago aprobado!',
    message: 'Tu pedido fue confirmado exitosamente. Te enviaremos los detalles por email.',
    badge:   'confirmado',
  },
  failure: {
    icon:    XCircle,
    color:   'text-red-500',
    bg:      'bg-red-50 dark:bg-red-950/30',
    border:  'border-red-200 dark:border-red-800',
    title:   'El pago no se pudo procesar',
    message: 'Hubo un problema con tu pago. Podés intentarlo de nuevo o elegir otro método.',
    badge:   'cancelado',
  },
  pending: {
    icon:    Clock,
    color:   'text-yellow-500',
    bg:      'bg-yellow-50 dark:bg-yellow-950/30',
    border:  'border-yellow-200 dark:border-yellow-800',
    title:   'Pago pendiente',
    message: 'Tu pago está siendo procesado. Te notificaremos cuando se acredite.',
    badge:   'pendiente',
  },
  demo: {
    icon:    CheckCircle,
    color:   'text-primary-500',
    bg:      'bg-primary-50 dark:bg-navy-800',
    border:  'border-primary-200 dark:border-navy-700',
    title:   '¡Pedido registrado! (modo demo)',
    message: 'En producción, acá se completaría el pago real con MercadoPago.',
    badge:   'pendiente',
  },
}

export default function PaymentResult() {
  const [params] = useSearchParams()

  const status    = params.get('status') || params.get('collection_status') || 'demo'
  const paymentId = params.get('payment_id')
  const orderId   = params.get('external_reference')

  const result = RESULTS[status] || RESULTS.failure
  const Icon   = result.icon

  const { orders, updateOrderStatus } = useOrders()

  useEffect(() => {
    if (orderId && updateOrderStatus) {
      updateOrderStatus(orderId, result.badge)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className={`${result.bg} ${result.border} border rounded-2xl p-10 mb-6`}>
        <Icon size={64} className={`mx-auto mb-4 ${result.color}`} />
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
          {result.title}
        </h1>
        <p className="text-gray-600 dark:text-blue-200 text-sm leading-relaxed">
          {result.message}
        </p>

        {paymentId && (
          <p className="text-xs text-gray-400 mt-4">
            ID de pago: <span className="font-mono font-semibold">{paymentId}</span>
          </p>
        )}
        {orderId && (
          <p className="text-xs text-gray-400 mt-1">
            Pedido: <span className="font-mono font-semibold">{orderId}</span>
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/mis-pedidos" className="btn-primary inline-flex items-center justify-center gap-2">
          <ClipboardList size={16} /> Ver mis pedidos
        </Link>
        {status === 'failure' && (
          <Link to="/carrito" className="btn-outline inline-flex items-center justify-center gap-2">
            <ShoppingBag size={16} /> Reintentar
          </Link>
        )}
        <Link to="/catalogo" className="btn-ghost inline-flex items-center justify-center gap-2 border border-gray-200 dark:border-navy-700">
          Seguir comprando <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
