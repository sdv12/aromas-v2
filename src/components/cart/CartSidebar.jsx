<title>Mini carrito lateral</title>
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, X, Trash2, ArrowRight, Package } from 'lucide-react'
import { useCart }  from '../../context/CartContext'
import { useAuth }  from '../../context/AuthContext'

const FREE_THRESHOLD = 120000

export default function CartSidebar() {
  const [open, setOpen] = useState(false)
  const { items, totalItems, subtotal, removeItem, clearCart } = useCart()
  const { isWholesale } = useAuth()

  const sub        = subtotal(isWholesale)
  const progress   = Math.min(100, (sub / FREE_THRESHOLD) * 100)
  const remaining  = Math.max(0, FREE_THRESHOLD - sub)
  const isFree     = sub >= FREE_THRESHOLD

  return (
    <>
      {/* Trigger — apilado encima del botón de WA */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Ver carrito"
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-primary-700 hover:bg-primary-800 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
      >
        <ShoppingCart size={24} className="text-white" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
            {totalItems > 9 ? '9+' : totalItems}
          </span>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-full z-50 bg-white dark:bg-navy-900 shadow-2xl flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200 dark:border-navy-700">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingCart size={18} /> Carrito
            {totalItems > 0 && (
              <span className="text-xs font-semibold bg-primary-700 text-white rounded-full px-2 py-0.5">{totalItems}</span>
            )}
          </h2>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-full hover:bg-cream-100 dark:hover:bg-navy-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
              <Package size={40} className="text-gray-300 dark:text-navy-600" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">Tu carrito está vacío</p>
              <Link to="/catalogo" onClick={() => setOpen(false)} className="btn-primary text-sm px-4 py-2">
                Ver productos
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-cream-100 dark:divide-navy-800">
              {items.map(item => {
                const price = isWholesale ? item.wholesalePrice : item.price
                return (
                  <li key={item.id} className="flex gap-3 px-4 py-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 bg-cream-100"
                      onError={e => { e.target.src = 'https://placehold.co/48x48/ede5d8/273145?text=A' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 leading-tight">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        x{item.qty} · ${price.toLocaleString('es-AR')} c/u
                      </p>
                      <p className="text-xs font-bold text-primary-700 dark:text-accent-400 mt-0.5">
                        ${(price * item.qty).toLocaleString('es-AR')}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors shrink-0 mt-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-cream-200 dark:border-navy-700 px-5 py-4 space-y-3">
            {/* Free shipping progress */}
            <div className="space-y-1.5">
              {isFree ? (
                <p className="text-xs font-bold text-green-600 flex items-center gap-1.5">
                  🎉 ¡Envío gratis a Córdoba Capital!
                </p>
              ) : (
                <>
                  <p className="text-xs text-gray-500">
                    Te faltan <span className="font-bold text-primary-700">${remaining.toLocaleString('es-AR')}</span> para envío gratis
                  </p>
                  <div className="w-full h-1.5 bg-cream-200 dark:bg-navy-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Subtotal */}
            <div className="flex justify-between text-sm font-bold text-gray-900 dark:text-white">
              <span>Subtotal</span>
              <span>${sub.toLocaleString('es-AR')}</span>
            </div>

            {/* CTAs */}
            <Link
              to="/carrito"
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white font-semibold text-sm py-3 rounded-lg transition-all"
            >
              Ir al carrito <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => { clearCart(); setOpen(false) }}
              className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center gap-1"
            >
              <Trash2 size={12} /> Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  )
}
