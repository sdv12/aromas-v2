import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ShoppingCart, Heart, Star, Tag, Truck, Shield,
  ChevronRight, Minus, Plus, Share2, MessageCircle,
  Package, ArrowLeft, CheckCircle, AlertTriangle, XCircle,
  Bell, BellRing
} from 'lucide-react'
import { useProducts }   from '../context/ProductsContext'
import { useCart }       from '../context/CartContext'
import { useFavorites }  from '../context/FavoritesContext'
import { useAuth }       from '../context/AuthContext'
import { useToast }           from '../context/ToastContext'
import { useRecentlyViewed }  from '../hooks/useRecentlyViewed'
import { WHATSAPP_NUMBER }    from '../config/contact'
import { CATEGORIES }         from '../data/products'
import ProductCard            from '../components/products/ProductCard'

function StockBadge({ stock }) {
  if (stock === 0)   return <span className="flex items-center gap-1.5 text-sm font-semibold text-red-600"><XCircle size={16} /> Sin stock</span>
  if (stock <= 5)    return <span className="flex items-center gap-1.5 text-sm font-semibold text-red-500"><AlertTriangle size={16} /> ¡Últimas {stock} unidades!</span>
  if (stock <= 20)   return <span className="flex items-center gap-1.5 text-sm font-semibold text-yellow-600"><AlertTriangle size={16} /> Quedan {stock} unidades</span>
  return             <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600"><CheckCircle size={16} /> En stock ({stock} disponibles)</span>
}

export default function ProductDetail() {
  const { id }           = useParams()
  const { products }     = useProducts()
  const { addItem }      = useCart()
  const { toggle, isFavorite }          = useFavorites()
  const { canBuy, openLogin, isWholesale, user } = useAuth()
  const { addToast }               = useToast()
  const { trackView }              = useRecentlyViewed()

  const [qty,        setQty]        = useState(1)
  const [imgError,   setImgError]   = useState(false)
  const [addedAnim,  setAddedAnim]  = useState(false)
  const [notifySent, setNotifySent] = useState(false)

  const product = products.find(p => p.id === Number(id))

  useEffect(() => {
    if (product) trackView(product.id)
  }, [product?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) {
    return (
      <div className="max-w-lg mx-auto py-24 px-4 text-center">
        <Package size={56} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 dark:text-blue-200 mb-2">Producto no encontrado</h2>
        <p className="text-gray-500 mb-6 text-sm">El producto que buscás no existe o fue eliminado.</p>
        <Link to="/catalogo" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Ver catálogo
        </Link>
      </div>
    )
  }

  const price    = isWholesale ? product.wholesalePrice : product.price
  const savings  = product.price - product.wholesalePrice
  const catInfo  = CATEGORIES.find(c => c.id === product.category)
  const related  = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  const maxQty   = product.stock || 0

  const handleAdd = () => {
    if (!canBuy) { openLogin(); return }

    let lastResult = null
    for (let i = 0; i < qty; i++) {
      lastResult = addItem(product)
      if (lastResult.status === 'at_limit' || lastResult.status === 'out_of_stock') break
    }

    if (!lastResult) return

    if (lastResult.status === 'out_of_stock' || lastResult.status === 'at_limit') {
      addToast({ type: 'warning', title: 'Límite de stock', message: `No hay más unidades disponibles de "${product.name}".` })
    } else if (lastResult.status === 'took_last') {
      addToast({ type: 'warning', title: '¡Última unidad!', message: `Agregaste la última unidad disponible.` })
      setAddedAnim(true)
      setTimeout(() => setAddedAnim(false), 1800)
    } else if (lastResult.status === 'low_stock') {
      addToast({ type: 'warning', title: 'Poco stock', message: `Solo quedan ${lastResult.remaining} unidad${lastResult.remaining > 1 ? 'es' : ''} más.` })
      setAddedAnim(true)
      setTimeout(() => setAddedAnim(false), 1800)
    } else {
      addToast({ type: 'success', title: 'Agregado al carrito', message: `${qty > 1 ? `${qty}× ` : ''}${product.name}` })
      setAddedAnim(true)
      setTimeout(() => setAddedAnim(false), 1800)
    }
  }

  const handleNotify = () => {
    if (!user) { openLogin(); return }
    const alerts = JSON.parse(localStorage.getItem('aromascba_stock_alerts') || '[]')
    const already = alerts.some(a => a.productId === product.id && a.email === user.email)
    if (!already) {
      alerts.push({ productId: product.id, productName: product.name, email: user.email, date: new Date().toISOString() })
      localStorage.setItem('aromascba_stock_alerts', JSON.stringify(alerts))
    }
    setNotifySent(true)
    addToast({ type: 'info', title: 'Alerta registrada', message: `Te avisamos cuando "${product.name}" tenga stock.` })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      addToast({ type: 'success', title: 'Enlace copiado', message: 'El link del producto fue copiado al portapapeles.' })
    }
  }

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}`
  const waMsg = encodeURIComponent(
    `Hola Aromas Córdoba! Me interesa el producto *${product.name}* ($${price.toLocaleString('es-AR')}). ¿Tienen disponibilidad?`
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary-600 transition-colors">Inicio</Link>
        <ChevronRight size={14} />
        <Link to="/catalogo" className="hover:text-primary-600 transition-colors">Productos</Link>
        <ChevronRight size={14} />
        {catInfo && (
          <>
            <Link to={`/catalogo?categoria=${catInfo.id}`} className="hover:text-primary-600 transition-colors">
              {catInfo.label}
            </Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="text-gray-600 dark:text-blue-200 font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">

        {/* ── Imagen ── */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-navy-800 shadow-sm">
            {!imgError ? (
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover ${product.stock === 0 ? 'opacity-60' : ''}`}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={80} className="text-gray-300 dark:text-gray-600" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isOffer && (
                <span className="badge-offer text-sm px-3 py-1">-{product.offerPercent}% OFF</span>
              )}
              {product.isFeatured && !product.isOffer && (
                <span className="text-xs font-bold bg-primary-600 text-white px-3 py-1 rounded-full">⭐ Destacado</span>
              )}
            </div>

            {/* Favorite */}
            <button
              onClick={() => toggle(product.id)}
              className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all active:scale-90 ${
                isFavorite(product.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 dark:bg-navy-800/90 text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart size={18} fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2">
            {[product.image, product.image, product.image].map((src, i) => (
              <div key={i} className={`w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                i === 0 ? 'border-primary-500' : 'border-gray-200 dark:border-navy-700 opacity-60 hover:opacity-100'
              }`}>
                <img src={src} alt="" className="w-full h-full object-cover"
                  onError={e => { e.target.parentElement.style.display = 'none' }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Info ── */}
        <div className="flex flex-col">
          {/* Brand & name */}
          <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">{product.brand}</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={18} className={s <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-blue-200">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews} reseñas)</span>
          </div>

          {/* Price block */}
          <div className="bg-primary-50 dark:bg-navy-800 rounded-xl p-4 mb-4">
            <div className="flex items-end gap-3 mb-2">
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                ${price.toLocaleString('es-AR')}
              </span>
              {product.isOffer && (
                <span className="text-lg text-gray-400 line-through">
                  ${Math.round(price / (1 - product.offerPercent / 100)).toLocaleString('es-AR')}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={isWholesale ? 'badge-wholesale' : 'badge-retail'}>
                {isWholesale ? '🏷 Precio Mayorista' : 'Precio Retail'}
              </span>
              {!isWholesale && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Mayorista: ${product.wholesalePrice.toLocaleString('es-AR')}
                  {' '}(ahorrás ${savings.toLocaleString('es-AR')})
                </span>
              )}
            </div>
          </div>

          {/* Stock badge */}
          <div className="mb-5">
            <StockBadge stock={product.stock} />
          </div>

          {product.stock === 0 ? (
            /* ── Sin stock: botón notificación ── */
            <button
              onClick={handleNotify}
              className={`flex items-center justify-center gap-2 font-semibold py-3 px-5 rounded-lg transition-all mb-4 ${
                notifySent
                  ? 'bg-primary-50 dark:bg-navy-800 text-primary-600 dark:text-primary-400 border-2 border-primary-200 dark:border-navy-700'
                  : 'bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-navy-700 hover:text-primary-600 border-2 border-gray-200 dark:border-navy-700'
              }`}
            >
              {notifySent ? <BellRing size={18} /> : <Bell size={18} />}
              {notifySent ? '¡Te avisamos cuando haya stock!' : 'Avisame cuando haya stock'}
            </button>
          ) : (
            /* ── Con stock: selector de cantidad + botón agregar ── */
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border-2 border-gray-200 dark:border-navy-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-3 py-2.5 hover:bg-primary-50 dark:hover:bg-navy-700 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2.5 font-bold text-gray-900 dark:text-white min-w-[3rem] text-center border-x-2 border-gray-200 dark:border-navy-700">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => Math.min(maxQty, q + 1))}
                  disabled={qty >= maxQty}
                  className="px-3 py-2.5 hover:bg-primary-50 dark:hover:bg-navy-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3 px-5 rounded-lg transition-all active:scale-95 ${
                  addedAnim ? 'bg-green-500 text-white' : 'btn-primary'
                }`}
              >
                {addedAnim ? (
                  <><CheckCircle size={18} /> ¡Agregado!</>
                ) : (
                  <><ShoppingCart size={18} /> {canBuy ? 'Agregar al carrito' : 'Iniciar sesión para comprar'}</>
                )}
              </button>
            </div>
          )}

          {/* Secondary actions */}
          <div className="flex gap-2 mb-6">
            <a
              href={`${waUrl}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 border-2 border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/20 font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
            >
              <MessageCircle size={16} /> Consultar por WhatsApp
            </a>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 border-2 border-gray-200 dark:border-navy-700 text-gray-500 dark:text-gray-400 hover:border-primary-400 hover:text-primary-600 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
            >
              <Share2 size={15} /> Compartir
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-5 border-t border-gray-100 dark:border-navy-700">
            {[
              { icon: Truck,   text: 'Envío a toda Córdoba' },
              { icon: Shield,  text: 'Calidad garantizada' },
              { icon: Package, text: 'Stock permanente' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-9 h-9 rounded-full bg-primary-50 dark:bg-navy-800 flex items-center justify-center">
                  <Icon size={17} className="text-primary-600 dark:text-primary-400" />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Descripción & Tags ── */}
      <div className="card p-6 sm:p-8 mb-10">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Descripción del producto</h2>
        <p className="text-gray-600 dark:text-blue-200 leading-relaxed text-sm sm:text-base mb-5">
          {product.description}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          {[
            ['Marca',     product.brand],
            ['Categoría', catInfo?.label || product.category],
            ['Stock',     product.stock === 0 ? 'Sin stock' : `${product.stock} unidades`],
          ].map(([label, value]) => (
            <div key={label} className="bg-primary-50 dark:bg-navy-800 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">{value}</p>
            </div>
          ))}
        </div>
        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map(tag => (
              <Link
                key={tag}
                to={`/catalogo?q=${encodeURIComponent(tag)}`}
                className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-blue-200 hover:bg-primary-100 dark:hover:bg-navy-600 hover:text-primary-700 px-3 py-1 rounded-full transition-colors"
              >
                <Tag size={11} /> {tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Productos relacionados ── */}
      {related.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Productos relacionados</h2>
            <Link to={`/catalogo?categoria=${product.category}`} className="text-sm text-primary-600 hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map(p => (
              <ProductCard key={p.id} product={p} showWholesale={isWholesale} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
