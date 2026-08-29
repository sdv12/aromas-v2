import { useState } from 'react'
import { Link }       from 'react-router-dom'
import { ShoppingCart, Heart, Bell, BellRing } from 'lucide-react'
import { useCart }      from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import { useAuth }      from '../../context/AuthContext'
import { useToast }     from '../../context/ToastContext'

function StockBadgeSmall({ stock }) {
  if (stock === 0)  return <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full">Sin stock</span>
  if (stock <= 5)   return <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full">¡Últimas {stock}!</span>
  if (stock <= 20)  return <span className="text-[10px] font-semibold text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40 px-2 py-0.5 rounded-full">Quedan {stock}</span>
  return null
}

function NotifyButton({ product }) {
  const [sent, setSent]   = useState(false)
  const { addToast }      = useToast()
  const { user, openLogin } = useAuth()

  const handleNotify = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { openLogin(); return }
    const alerts = JSON.parse(localStorage.getItem('aromascba_stock_alerts') || '[]')
    const already = alerts.some(a => a.productId === product.id && a.email === user.email)
    if (!already) {
      alerts.push({ productId: product.id, productName: product.name, email: user.email, date: new Date().toISOString() })
      localStorage.setItem('aromascba_stock_alerts', JSON.stringify(alerts))
    }
    setSent(true)
    addToast({
      type:    'info',
      title:   'Alerta registrada',
      message: `Te avisamos cuando "${product.name}" tenga stock.`,
    })
  }

  return (
    <button
      onClick={handleNotify}
      className={`w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg transition-all ${
        sent
          ? 'bg-primary-50 dark:bg-navy-800 text-primary-600 dark:text-primary-400'
          : 'bg-gray-100 dark:bg-navy-700 text-gray-500 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-navy-700 hover:text-primary-600'
      }`}
    >
      {sent ? <BellRing size={13} /> : <Bell size={13} />}
      {sent ? 'Te avisamos' : 'Avisame cuando haya stock'}
    </button>
  )
}

export default function ProductCard({ product, showWholesale: _showWholesale }) {
  const { addItem }                = useCart()
  const { toggle, isFavorite }     = useFavorites()
  const { canBuy, openLogin }      = useAuth()
  const { addToast }               = useToast()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!canBuy) { openLogin(); return }

    const result = addItem(product)

    if (result.status === 'out_of_stock') {
      addToast({ type: 'error', title: 'Sin stock', message: `"${product.name}" no tiene unidades disponibles.` })
    } else if (result.status === 'at_limit') {
      addToast({ type: 'warning', title: 'Límite de stock', message: `Ya tenés las ${result.max} unidades disponibles en el carrito.` })
    } else if (result.status === 'took_last') {
      addToast({ type: 'warning', title: '¡Última unidad!', message: `Agregaste la última unidad de "${product.name}".` })
    } else if (result.status === 'low_stock') {
      addToast({ type: 'warning', title: 'Poco stock', message: `Solo quedan ${result.remaining} unidad${result.remaining > 1 ? 'es' : ''} más de este producto.` })
    } else {
      addToast({ type: 'success', title: 'Agregado al carrito', message: product.name })
    }
  }

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(product.id)
  }

  const outOfStock = product.stock === 0

  return (
    <div className="product-card card group overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image */}
      <Link to={`/producto/${product.id}`} className="relative aspect-square overflow-hidden bg-cream-100 dark:bg-navy-800 block">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${outOfStock ? 'opacity-50' : ''}`}
          loading="lazy"
          onError={e => { e.target.src = `https://placehold.co/400x400/d8edf8/1285b5?text=${encodeURIComponent(product.name.slice(0,2))}` }}
        />

        {/* Out-of-stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/60 dark:bg-navy-900/60 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-navy-900 px-3 py-1 rounded-full border border-gray-200 dark:border-navy-700">
              Sin stock
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isOffer && !outOfStock && (
            <span className="badge-offer">-{product.offerPercent}%</span>
          )}
          {product.isFeatured && !product.isOffer && !outOfStock && (
            <span className="text-xs font-bold bg-primary-600 text-white px-2 py-0.5 rounded-full">Destacado</span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={handleFavorite}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all z-10
            ${isFavorite(product.id)
              ? 'bg-red-500 text-white'
              : 'bg-white/90 dark:bg-navy-900/90 text-gray-400 hover:text-red-500'
            }`}
          aria-label="Favorito"
        >
          <Heart size={15} fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
        </button>

        {/* Add to cart overlay — hidden when out of stock */}
        {!outOfStock && (
          <div className="product-actions absolute bottom-0 left-0 right-0 p-2 z-10">
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-1.5 shadow-lg"
            >
              <ShoppingCart size={15} />
              {canBuy ? 'Agregar al carrito' : 'Iniciar sesión'}
            </button>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{product.brand}</p>
        <Link to={`/producto/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 leading-tight mb-1.5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Stock badge */}
        <div className="mb-1.5">
          <StockBadgeSmall stock={product.stock} />
        </div>

        {/* Tiered pricing */}
        <div className="mt-auto pt-2 border-t border-cream-200 dark:border-navy-700 space-y-0.5">
          {[
            { label: 'Minorista',     price: product.price },
            { label: 'May. mín. 3',  price: product.wholesalePrice },
            { label: 'May. mín. 48', price: Math.round(product.wholesalePrice * 0.968) },
            { label: 'May. mín. 120',price: Math.round(product.wholesalePrice * 0.945) },
          ].map(({ label, price }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-[9px] text-gray-400 dark:text-gray-500">{label}</span>
              <span className={`text-xs font-semibold ${outOfStock ? 'text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}>
                ${price.toLocaleString('es-AR')}
              </span>
            </div>
          ))}
          {product.isOffer && !outOfStock && (
            <span className="badge-offer inline-block mt-0.5" style={{ fontSize: 9 }}>-{product.offerPercent}% OFF</span>
          )}
        </div>

        {/* Add to cart */}
        {!outOfStock ? (
          <button
            onClick={handleAddToCart}
            className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-primary-700 hover:bg-primary-800 dark:bg-accent-500 dark:hover:bg-accent-600 text-white py-2 rounded-lg transition-all active:scale-95"
          >
            <ShoppingCart size={13} /> Agregar
          </button>
        ) : (
          <NotifyButton product={product} />
        )}
      </div>
    </div>
  )
}
