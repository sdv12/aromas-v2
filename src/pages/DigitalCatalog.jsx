import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Printer, Download, Filter, ChevronDown, Tag } from 'lucide-react'
import { useProducts }  from '../context/ProductsContext'
import { useAuth }      from '../context/AuthContext'
import { usePageTitle } from '../hooks/usePageTitle'

// ── Precio formateado ─────────────────────────────────────────
function price(n) { return `$${Number(n).toLocaleString('es-AR')}` }

// ── Tarjeta de producto en el catálogo ───────────────────────
function CatalogCard({ product, showWholesale, showDistributor }) {
  const retailPrice     = product.price
  const wholesalePrice  = product.wholesalePrice
  // Precio distribuidor = 10% adicional sobre mayorista (se puede configurar)
  const distributorPrice = Math.round(product.wholesalePrice * 0.88)

  return (
    <div className="catalog-card border border-cream-300 rounded-xl overflow-hidden bg-white flex flex-col print:break-inside-avoid">
      {/* Imagen */}
      <div className="aspect-square bg-cream-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = `https://placehold.co/300x300/ede5d8/273145?text=${encodeURIComponent(product.name.slice(0,2))}` }}
        />
      </div>
      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{product.brand}</p>
        <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{product.name}</h3>
        {product.tags?.length > 0 && (
          <p className="text-[10px] text-gray-400 truncate">{product.tags.join(' · ')}</p>
        )}
        {/* Precios */}
        <div className="mt-auto pt-2 border-t border-cream-200 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-400">Retail</span>
            <span className={`text-sm font-bold ${!showWholesale && !showDistributor ? 'text-primary-700' : 'text-gray-500'}`}>
              {price(retailPrice)}
            </span>
          </div>
          {(showWholesale || showDistributor) && (
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-accent-600 font-semibold">Mayorista</span>
              <span className={`text-sm font-bold ${!showDistributor ? 'text-primary-700' : 'text-gray-500'}`}>
                {price(wholesalePrice)}
              </span>
            </div>
          )}
          {showDistributor && (
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-primary-600 font-semibold">Distribuidor</span>
              <span className="text-sm font-bold text-primary-700">
                {price(distributorPrice)}
              </span>
            </div>
          )}
          {product.isOffer && (
            <div className="text-center">
              <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                -{product.offerPercent}% OFF
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DigitalCatalog() {
  usePageTitle('Catálogo Digital')
  const { products, loading, categories: CATEGORIES } = useProducts()
  const { isWholesale, isDistributor, isAdmin } = useAuth()

  const [selectedCat,    setSelectedCat]    = useState('all')
  const [priceMode,      setPriceMode]      = useState(
    isDistributor ? 'distributor' : isWholesale ? 'wholesale' : 'all'
  )
  const [showFilters,    setShowFilters]    = useState(false)

  const categories = [{ id: 'all', label: 'Todos', icon: '🛒' }, ...CATEGORIES]

  const filtered = useMemo(() => {
    let list = [...products].filter(p => p.stock > 0 || true)
    if (selectedCat !== 'all') list = list.filter(p => p.category === selectedCat)
    return list
  }, [products, selectedCat])

  const showWholesale  = priceMode === 'wholesale'  || priceMode === 'distributor'
  const showDistributor= priceMode === 'distributor'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-cream-400 border-t-primary-700 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Header del catálogo — se oculta al imprimir ── */}
      <div className="print:hidden sticky top-16 z-30 bg-white/95 backdrop-blur border-b border-cream-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-3">
            {/* Filtro categoría */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(s => !s)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-cream-300 rounded-lg px-3 py-2 hover:bg-cream-50 transition-colors"
              >
                <Filter size={14} /> Categoría
                <ChevronDown size={13} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              {showFilters && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-cream-300 rounded-xl shadow-xl p-2 w-48 z-10">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCat(cat.id); setShowFilters(false) }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCat === cat.id
                          ? 'bg-primary-700 text-white'
                          : 'hover:bg-cream-100 text-gray-700'
                      }`}
                    >
                      <span>{cat.icon}</span> {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modo de precios — deshabilitado por ahora */}
            <div className="flex items-center gap-1 bg-cream-100 rounded-lg p-1 text-xs font-semibold opacity-40 pointer-events-none" title="Próximamente disponible">
              {[
                { id: 'retail',    label: 'Retail' },
                { id: 'all',       label: 'Todos' },
                { id: 'wholesale', label: 'Mayorista' },
              ].map(m => (
                <div
                  key={m.id}
                  className={`px-3 py-1.5 rounded-md ${
                    m.id === 'all' ? 'bg-primary-700 text-white shadow' : 'text-gray-500'
                  }`}
                >
                  {m.label}
                </div>
              ))}
            </div>

            <span className="text-xs text-gray-400 hidden sm:block">
              {filtered.length} productos
            </span>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 text-sm font-semibold border border-primary-700 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-700 hover:text-white transition-all"
            >
              <Printer size={15} /> Imprimir / PDF
            </button>
            {(isAdmin) && (
              <Link
                to="/admin/catalogo"
                className="text-xs text-gray-400 hover:text-primary-600 transition-colors"
              >
                Gestionar productos →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Portada — visible solo al imprimir ── */}
      <div className="hidden print:flex print:h-screen flex-col items-center justify-center"
           style={{ background: '#273145', breakAfter: 'page' }}>
        <img src="/logo-aura.png" alt="Aura" className="h-32 w-auto object-contain mb-8"
             style={{ filter: 'brightness(0) invert(1)' }} />
        <div className="w-16 h-0.5 mb-6" style={{ backgroundColor: '#b6a183' }} />
        <p className="font-display text-2xl italic text-white/80">Catálogo de Productos</p>
        <p className="text-white/50 text-sm mt-2">{new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long' })}</p>
      </div>

      {/* ── Contenido ── */}
      <div className="max-w-7xl mx-auto px-4 py-10 print:py-6">

        {/* Encabezado de sección */}
        <div className="print:hidden mb-8">
          <h1 className="font-display text-4xl font-medium text-gray-900">
            Catálogo {selectedCat !== 'all' ? CATEGORIES.find(c => c.id === selectedCat)?.label : 'Completo'}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-8 h-0.5" style={{ backgroundColor: '#b6a183' }} />
            <p className="text-sm text-gray-400">
              Precios en pesos argentinos · Actualizado {new Date().toLocaleDateString('es-AR')}
            </p>
          </div>
        </div>

        {/* Grid de productos — se adapta para impresión */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-gray-500">No hay productos en esta categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 print:grid-cols-4 print:gap-3">
            {filtered.map(p => (
              <CatalogCard
                key={p.id}
                product={p}
                showWholesale={showWholesale}
                showDistributor={showDistributor}
              />
            ))}
          </div>
        )}

        {/* Footer del catálogo */}
        <div className="mt-16 pt-8 border-t border-cream-300 text-center print:mt-8">
          <img src="/logo-aura.png" alt="Aura" className="h-8 w-auto object-contain mx-auto mb-3 opacity-60"
               style={{ filter: 'grayscale(1)' }} />
          <p className="text-xs text-gray-400">
            Aura Aromas Córdoba · Todos los precios son en pesos argentinos e incluyen IVA · Sujeto a stock disponible
          </p>
        </div>
      </div>

      {/* Estilos de impresión */}
      <style>{`
        @media print {
          @page { size: A4; margin: 1.5cm; }
          .print\\:break-inside-avoid { break-inside: avoid; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  )
}
