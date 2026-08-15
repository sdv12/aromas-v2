import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Star, Truck, Award, Headphones, Package, Clock } from 'lucide-react'
import { CATEGORIES } from '../data/products'
import { useProducts } from '../context/ProductsContext'
import ProductCard     from '../components/products/ProductCard'
import { useAuth }     from '../context/AuthContext'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'
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
  { icon: Truck,      title: 'Envío a toda Córdoba',  desc: 'Entrega en 24–48 hs' },
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

export default function Home() {
  const [slide, setSlide]   = useState(0)
  const { isWholesale }     = useAuth()
  const { products, featured } = useProducts()
  const { ids: recentIds, clear: clearRecent } = useRecentlyViewed()
  const recentProducts = recentIds.map(id => products.find(p => p.id === id)).filter(Boolean)

  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000)
    return () => clearInterval(id)
  }, [])

  const prev = () => setSlide(s => (s - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setSlide(s => (s + 1) % SLIDES.length)

  return (
    <div>
      {/* Hero Carousel */}
      <section className="relative h-[520px] md:h-[600px] overflow-hidden">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === slide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <img src={s.bg} alt="" className="w-full h-full object-cover" />
            <div className="hero-overlay absolute inset-0" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 sm:px-10">
                <div className="max-w-xl text-white">
                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-sm whitespace-pre-line">
                    {s.headline}
                  </h1>
                  <p className="text-lg text-white/90 mb-7">{s.sub}</p>
                  <Link to={s.ctaLink} className="btn-primary inline-flex items-center gap-2 text-base shadow-lg">
                    {s.cta} <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors backdrop-blur-sm">
          <ChevronLeft size={22} />
        </button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors backdrop-blur-sm">
          <ChevronRight size={22} />
        </button>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === slide ? 'dot-active' : 'dot-inactive'}`} />
          ))}
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-primary-600 text-white py-5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-primary-100">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 bg-primary-50 dark:bg-navy-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Comprar por Categoría</h2>
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

      {/* Wholesale banner */}
      <section className="py-5 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-navy-850 dark:to-navy-900 border-y border-primary-200 dark:border-navy-700">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-primary-700 dark:text-accent-400 uppercase tracking-wide mb-0.5">¡Promos Mayoristas Disponibles!</p>
            <p className="text-gray-700 dark:text-cream-300 text-sm">Desde 24 unidades con precios especiales.{' '}
              <Link to="/mayorista" className="text-primary-600 hover:underline font-medium">Consultar catálogo</Link>
            </p>
          </div>
          <Link to="/mayorista" className="btn-outline text-sm shrink-0">Solicitar Cotización</Link>
        </div>
      </section>

      {/* Featured */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Productos Destacados</h2>
            <Link to="/catalogo" className="text-primary-600 hover:underline text-sm font-medium flex items-center gap-1">
              Ver todos <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {featured.slice(0, 10).map(p => (
              <ProductCard key={p.id} product={p} showWholesale={isWholesale} />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <section className="py-14 bg-gray-50 dark:bg-navy-900">
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
            <h2 className="text-2xl font-bold text-white mb-2">Promos del Mes</h2>
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
                  <div className="flex items-center justify-between bg-accent-600/20 border border-accent-500/30 rounded-xl px-3 py-2">
                    <span className="text-accent-300 text-xs font-bold">24 UNI</span>
                    <span className="text-white font-extrabold text-sm">${p.uni24.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex items-center justify-between bg-accent-500/20 border border-accent-400/30 rounded-xl px-3 py-2">
                    <span className="text-accent-200 text-xs font-bold">48 UNI</span>
                    <span className="text-white font-extrabold text-sm">${p.uni48.toLocaleString('es-AR')}</span>
                  </div>
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
      <section className="py-14 bg-primary-50 dark:bg-navy-900">
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

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold mb-4">Aromas que transforman tu ambiente</h2>
          <p className="text-primary-100 mb-8 text-lg">Explorá el catálogo completo de Aura y encontrá la fragancia perfecta para cada espacio.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/catalogo" className="bg-white text-primary-700 font-bold px-7 py-3 rounded-lg hover:bg-primary-50 transition-colors inline-flex items-center gap-2">
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
