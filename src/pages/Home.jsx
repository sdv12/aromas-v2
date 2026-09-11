import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Star, Truck, Award, Headphones, Package, Clock, ShoppingCart } from 'lucide-react'
import { useProducts } from '../context/ProductsContext'
import ProductCard     from '../components/products/ProductCard'
import { useAuth }     from '../context/AuthContext'
import { useCart }     from '../context/CartContext'
import { useToast }    from '../context/ToastContext'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'
import { usePageTitle }      from '../hooks/usePageTitle'
import { WHATSAPP_NUMBER }   from '../config/contact'

const SLIDES = [
  {
    headline: 'Aromas que\nTransforman tu Ambiente',
    sub: 'Aromatizantes, difusores y esencias de calidad premium. Fragancias exclusivas para cada espacio.',
    bg: 'https://images.unsplash.com/photo-1616137150093-74a0c8fd8f61?w=1400&h=600&fit=crop',
    cta: 'Ver Catálogo', ctaLink: '/catalogo',
  },
  {
    headline: 'Promo Mayorista\nDisponible',
    sub: 'Precios especiales desde 24 unidades. Ideal para revendedores, comercios y empresas.',
    bg: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=1400&h=600&fit=crop',
    cta: 'Ver Promos', ctaLink: '/mayorista',
  },
  {
    headline: 'Pequeño Detalle,\nGran Sensación',
    sub: 'Difusores aromáticos para el auto, el hogar y la oficina. Fragancias que inspiran bienestar.',
    bg: 'https://images.unsplash.com/photo-1610878185620-4a35027a5b7a?w=1400&h=600&fit=crop',
    cta: 'Ver Productos', ctaLink: '/catalogo?categoria=auto',
  },
]

const FEATURES = [
  { icon: Truck,      title: 'Envíos a todo el país', desc: 'Entrega rápida y segura' },
  { icon: Award,      title: 'Calidad Premium',        desc: 'Fragancias exclusivas' },
  { icon: Headphones, title: 'Atención Personalizada', desc: 'Lun–Sáb 9 a 18 hs' },
  { icon: Package,    title: 'Stock Permanente',        desc: '+200 productos disponibles' },
]

const PROMOS = [
  {
    producto: 'Aromatizante Ambiente y Telas',
    presentacion: '250 ml',
    icon: '🌸',
    uni24: 64320,
    uni48: 124992,
  },
  {
    producto: 'Difusor de Ambientes',
    presentacion: '60 ml — con varillas',
    icon: '🌿',
    uni24: 62616,
    uni48: 121680,
  },
  {
    producto: 'Difusor Aromático',
    presentacion: 'Para auto — con colgante',
    icon: '🚗',
    uni24: 59232,
    uni48: 115104,
  },
  {
    producto: 'Desodorante Concentrado',
    presentacion: '500 ml — ambientes y telas',
    icon: '💧',
    uni24: 77832,
    uni48: 151248,
  },
  {
    producto: 'Esencia para Humidificador',
    presentacion: '60 ml — fórmula concentrada',
    icon: '✨',
    uni24: 71064,
    uni48: 138069,
  },
]

const FRAGANCIAS = [
  'Lima & Verbena', 'Lavanda', 'Vainilla & Canela', 'Flores Blancas',
  'Coco & Vainilla', 'Eucalipto & Menta', 'Rosa', 'Jazmín',
  'Sandía & Frutas', 'Cedro & Madera', 'Citrus Fresh', 'Musk Blanco',
  'Manzana Verde', 'Melón', 'Pino', 'Frutilla',
]

// Productos hardcodeados para el carrusel cuando Firebase no tiene destacados
const FEATURED_DEMO = [
  { id: 'fd-1',  name: 'Aromatizante Ambiente y Telas 250ml',  brand: 'Aura', price: 3200, wholesalePrice: 2090, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop', rating: 5, reviews: 142, stock: 100, isFeatured: true, category: 'textil',   isOffer: false },
  { id: 'fd-2',  name: 'Difusor de Ambientes 60ml con Varillas', brand: 'Aura', price: 3800, wholesalePrice: 2538, image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&h=400&fit=crop', rating: 5, reviews: 98,  stock: 100, isFeatured: true, category: 'hogar',   isOffer: false },
  { id: 'fd-3',  name: 'Difusor Aromático para Auto',           brand: 'Aura', price: 2700, wholesalePrice: 1804, image: 'https://images.unsplash.com/photo-1610878185620-4a35027a5b7a?w=400&h=400&fit=crop', rating: 5, reviews: 203, stock: 100, isFeatured: true, category: 'auto',    isOffer: false },
  { id: 'fd-4',  name: 'Desodorante Concentrado 500ml',         brand: 'Aura', price: 4200, wholesalePrice: 3244, image: 'https://images.unsplash.com/photo-1616137150093-74a0c8fd8f61?w=400&h=400&fit=crop', rating: 5, reviews: 76,  stock: 100, isFeatured: true, category: 'hogar',   isOffer: false },
  { id: 'fd-5',  name: 'Esencia para Humidificador 60ml',       brand: 'Aura', price: 3500, wholesalePrice: 2538, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', rating: 5, reviews: 119, stock: 100, isFeatured: true, category: 'hogar',   isOffer: false },
  { id: 'fd-6',  name: 'Set 3 Velas Aromáticas Premium',        brand: 'Aura', price: 5800, wholesalePrice: 4350, image: 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=400&h=400&fit=crop', rating: 5, reviews: 87,  stock: 100, isFeatured: true, category: 'velas',   isOffer: true,  offerPercent: 15 },
  { id: 'fd-7',  name: 'Spray Textil Lavanda 300ml',            brand: 'Aura', price: 2900, wholesalePrice: 2090, image: 'https://images.unsplash.com/photo-1558171813-0d80d14a1c37?w=400&h=400&fit=crop', rating: 5, reviews: 65,  stock: 100, isFeatured: true, category: 'textil',  isOffer: false },
  { id: 'fd-8',  name: 'Kit Iniciador Mayorista — 24 u.',       brand: 'Aura', price: 59232, wholesalePrice: 59232, image: 'https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?w=400&h=400&fit=crop', rating: 5, reviews: 44, stock: 50, isFeatured: true, category: 'promo',   isOffer: true,  offerPercent: 20 },
]

export default function Home() {
  usePageTitle(null)
  const [slide, setSlide]   = useState(0)
  const { isWholesale }     = useAuth()
  const { products, featured, categories: CATEGORIES } = useProducts()
  const { addItem }         = useCart()
  const { addToast }        = useToast()
  const { ids: recentIds, clear: clearRecent } = useRecentlyViewed()
  const recentProducts = recentIds.map(id => products.find(p => p.id === id)).filter(Boolean)

  // Si Firebase no tiene productos con isFeatured, usamos el demo hardcodeado
  const displayFeatured = featured.length > 0 ? featured : FEATURED_DEMO

  // Modal de fragancia para promos
  const [promoModal, setPromoModal] = useState(null) // { promo, qty }
  const [selectedFragancia, setSelectedFragancia] = useState('')
  const [marqueeHovered, setMarqueeHovered] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000)
    return () => clearInterval(id)
  }, [])

  const openPromoModal = (promo, qty) => {
    setSelectedFragancia('')
    setPromoModal({ promo, qty })
  }

  const confirmPromo = () => {
    if (!promoModal) return
    const { promo, qty } = promoModal
    const fragLabel = selectedFragancia ? ` — ${selectedFragancia}` : ''
    const item = {
      id: `promo-${promo.producto.replace(/\s+/g, '-').toLowerCase()}-${qty}-${selectedFragancia.replace(/\s+/g,'-')}`,
      name: `[PROMO] ${promo.producto}${fragLabel} — Pack ${qty} u. (${promo.presentacion})`,
      price: qty === 24 ? promo.uni24 : promo.uni48,
      wholesalePrice: qty === 24 ? promo.uni24 : promo.uni48,
      image: '',
      brand: 'Aura',
      stock: 999,
      rating: 5,
      reviews: 0,
    }
    addItem(item)
    addToast({ type: 'success', title: 'Promo agregada', message: item.name })
    setPromoModal(null)
  }

  const addPromoToCart = (promo, qty) => {
    const item = {
      id: `promo-${promo.producto.replace(/\s+/g, '-').toLowerCase()}-${qty}`,
      name: `${promo.producto} — Pack ${qty} u. (${promo.presentacion})`,
      price: qty === 24 ? promo.uni24 : promo.uni48,
      wholesalePrice: qty === 24 ? promo.uni24 : promo.uni48,
      image: '',
      brand: 'Aura',
      stock: 999,
      rating: 5,
      reviews: 0,
    }
    addItem(item)
    addToast({ type: 'success', title: 'Agregado al carrito', message: item.name })
  }

  const prev = () => setSlide(s => (s - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setSlide(s => (s + 1) % SLIDES.length)

  return (
    <div>
      {/* Hero — editorial, inspirado en el logo */}
      <section className="relative h-[560px] md:h-[680px] overflow-hidden">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <img src={s.bg} alt="" className="w-full h-full object-cover scale-105" style={{ filter: 'brightness(0.6)' }} />
            {/* Gradient overlay más sofisticado */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(39,49,69,0.82) 0%, rgba(39,49,69,0.45) 55%, rgba(0,0,0,0.1) 100%)' }} />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-8 sm:px-14">
                <div className="max-w-lg text-white">
                  {/* Eyebrow serif */}
                  <p className="font-display text-accent-400 text-lg italic tracking-wide mb-3 opacity-90">
                    Aromas Córdoba
                  </p>
                  <h1 className="font-display text-5xl md:text-6xl font-semibold leading-[1.1] mb-5 whitespace-pre-line drop-shadow-sm">
                    {s.headline}
                  </h1>
                  {/* Línea accent */}
                  <div className="w-12 h-0.5 mb-5" style={{ backgroundColor: '#b6a183' }} />
                  <p className="text-base text-white/85 mb-8 leading-relaxed font-light">{s.sub}</p>
                  <Link to={s.ctaLink}
                    className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-wide uppercase
                               border border-white/60 text-white px-7 py-3 rounded-full
                               hover:bg-white hover:text-primary-700 transition-all duration-300">
                    {s.cta} <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Navegación discreta */}
        <button onClick={prev} className="absolute left-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-white/40 text-white flex items-center justify-center hover:border-white/80 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <button onClick={next} className="absolute right-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-white/40 text-white flex items-center justify-center hover:border-white/80 transition-colors">
          <ChevronRight size={18} />
        </button>
        {/* Dots elegantes */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`rounded-full transition-all duration-500 ${i === slide ? 'w-6 h-1.5 bg-accent-400' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`} />
          ))}
        </div>
      </section>

      {/* Features bar — navy elegante */}
      <section className="bg-primary-700 dark:bg-navy-900 text-white py-5 border-b border-primary-800/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <Icon size={18} className="text-accent-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold tracking-wide">{title}</p>
                <p className="text-xs text-white/60">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-cream-100 dark:bg-navy-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-medium text-gray-900 dark:text-white">Explorar por Categoría</h2>
            <div className="w-10 h-0.5 mx-auto mt-3" style={{ backgroundColor: '#b6a183' }} />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                to={`/catalogo?categoria=${cat.id}`}
                className="card p-4 flex flex-col items-center gap-2 hover:shadow-md hover:-translate-y-1 transition-all text-center group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-blue-200">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Wholesale banner — suspendido por ahora */}

      {/* Featured — marquee infinito */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl font-medium text-gray-900 dark:text-white">Productos Destacados</h2>
            <Link to="/catalogo" className="text-primary-600 hover:underline text-sm font-medium flex items-center gap-1">
              Ver todos <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        {/* Marquee con overflow oculto — sin scroll-snap, puramente CSS */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => setMarqueeHovered(true)}
          onMouseLeave={() => setMarqueeHovered(false)}
        >
          <div
            className="flex gap-4"
            style={{
              animation: `marquee ${Math.max(20, displayFeatured.length * 4)}s linear infinite`,
              animationPlayState: marqueeHovered ? 'paused' : 'running',
              width: 'max-content',
            }}
          >
            {/* Duplicamos los items para el loop continuo */}
            {[...displayFeatured, ...displayFeatured].map((p, i) => (
              <div key={`${p.id}-${i}`} className="flex-shrink-0 w-52 sm:w-56 lg:w-60">
                <ProductCard product={p} showWholesale={isWholesale} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <section className="py-14 bg-cream-100 dark:bg-navy-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock size={22} className="text-primary-500" /> Vistos recientemente
              </h2>
              <button
                onClick={clearRecent}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                Limpiar historial
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {recentProducts.slice(0, 5).map(p => (
                <ProductCard key={p.id} product={p} showWholesale={isWholesale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promos Mayoristas */}
      <section className="py-14 bg-primary-900 dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-accent-400 text-xs font-semibold tracking-[0.25em] uppercase mb-2">Venta Mayorista</p>
            <h2 className="font-display text-3xl font-medium text-white mb-2">Promos del Mes</h2>
            <p className="text-primary-300 text-sm">Precios especiales por volumen — desde 24 unidades</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {PROMOS.map(p => (
              <div key={p.producto} className="bg-primary-800/60 dark:bg-navy-900 border border-primary-700 dark:border-navy-700 rounded-2xl p-5 flex flex-col gap-4">
                <div>
                  <span className="text-2xl">{p.icon}</span>
                  <p className="font-bold text-white text-sm mt-2 leading-tight">{p.producto}</p>
                  <p className="text-primary-300 text-xs mt-0.5">{p.presentacion}</p>
                </div>
                <div className="space-y-2">
                  {[{ qty: 24, price: p.uni24, color: 'accent-600/20 border-accent-500/30 hover:bg-accent-500/30', textColor: 'text-accent-300' },
                    { qty: 48, price: p.uni48, color: 'accent-500/20 border-accent-400/30 hover:bg-accent-400/30', textColor: 'text-accent-200' }
                  ].map(({ qty, price, color, textColor }) => (
                    <button
                      key={qty}
                      onClick={() => openPromoModal(p, qty)}
                      className={`w-full flex items-center justify-between bg-${color} rounded-xl px-3 py-2 transition-colors group`}
                    >
                      <span className={`${textColor} text-xs font-bold`}>{qty} UNI</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-extrabold text-sm">${price.toLocaleString('es-AR')}</span>
                        <ShoppingCart size={13} className={`${textColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/mayorista" className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-bold px-7 py-3 rounded-lg transition-colors">
              Ver todas las promos <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 bg-cream-100 dark:bg-navy-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">Lo que dicen nuestros clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Valentina R.',        role: 'Cliente minorista',  text: 'Los difusores son increíbles, el aroma dura todo el día. Ya pedí tres veces y siempre llegan rápido.', rating: 5 },
              { name: 'Distribuidora Flores', role: 'Cliente mayorista', text: 'Trabajamos con Aromas Córdoba hace 2 años. La calidad y los precios mayoristas son inmejorables para nuestro negocio.', rating: 5 },
              { name: 'Lucía M.',            role: 'Cliente retail',     text: 'Las velas son artesanales de verdad. El Set de 3 Velas Premium fue el regalo perfecto para el cumpleaños de mi mamá.', rating: 5 },
            ].map(t => (
              <div key={t.name} className="card p-6">
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} className={s <= t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />)}
                </div>
                <p className="text-gray-600 dark:text-blue-200 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal fragancia promo */}
      {promoModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div>
              <p className="text-xs text-accent-500 font-semibold uppercase tracking-wider mb-1">Promo — {promoModal.qty} unidades</p>
              <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white">{promoModal.promo.producto}</h3>
              <p className="text-sm text-gray-400">{promoModal.promo.presentacion}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Elegí la fragancia:</p>
              <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
                {FRAGANCIAS.map(f => (
                  <button
                    key={f}
                    onClick={() => setSelectedFragancia(f)}
                    className={`text-xs px-3 py-2 rounded-lg border text-left transition-all ${
                      selectedFragancia === f
                        ? 'border-primary-600 bg-primary-50 dark:bg-navy-800 text-primary-700 dark:text-accent-400 font-semibold'
                        : 'border-cream-300 dark:border-navy-600 text-gray-600 dark:text-gray-400 hover:border-primary-400'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setPromoModal(null)}
                className="flex-1 btn-ghost border border-cream-300 dark:border-navy-700 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmPromo}
                disabled={!selectedFragancia}
                className="flex-1 flex items-center justify-center gap-1.5 bg-primary-700 hover:bg-primary-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-all"
              >
                <ShoppingCart size={15} /> Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-display text-4xl md:text-5xl font-medium mb-4">Aromas que transforman tu ambiente</h2>
          <p className="text-primary-100 mb-8 text-base font-light leading-relaxed">Explorá el catálogo completo de Aura y encontrá la fragancia perfecta para cada espacio.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/catalogo" className="bg-white text-primary-700 font-bold px-7 py-3 rounded-lg hover:bg-cream-100 transition-colors inline-flex items-center gap-2">
              Explorar Catálogo <ArrowRight size={18} />
            </Link>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
              className="border-2 border-white/60 text-white font-bold px-7 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
