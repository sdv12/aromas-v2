import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { Search, Grid3X3, LayoutList, Heart, ShoppingCart } from 'lucide-react'
import { useProducts }        from '../context/ProductsContext'
import ProductCard            from '../components/products/ProductCard'
import ProductCardSkeleton    from '../components/products/ProductCardSkeleton'
import ProductFilters         from '../components/products/ProductFilters'
import { useAuth }       from '../context/AuthContext'
import { useCart }       from '../context/CartContext'
import { useFavorites }  from '../context/FavoritesContext'

const SORT_OPTIONS = [
  { value: 'popular',    label: 'Popularidad' },
  { value: 'price-asc',  label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating',     label: 'Mejor valorados' },
  { value: 'name',       label: 'Nombre A–Z' },
]

const DEFAULT_FILTERS = {
  categories: [], brands: [], maxPrice: 15000,
  onlyOffer: false, onlyFeatured: false, wholesale: false,
}

function ListProductCard({ product, showWholesale }) {
  const { addItem }            = useCart()
  const { toggle, isFavorite } = useFavorites()
  const { canBuy, openLogin }  = useAuth()
  const price = showWholesale ? product.wholesalePrice : product.price

  return (
    <div className="card flex gap-4 p-4 hover:shadow-md transition-shadow">
      <img src={product.image} alt={product.name}
        className="w-24 h-24 object-cover rounded-lg shrink-0"
        onError={e => { e.target.src = 'https://placehold.co/96x96/d8edf8/1285b5?text=A' }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">{product.brand}</p>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{product.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{product.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-gray-900 dark:text-white">${price.toLocaleString('es-AR')}</p>
            {product.isOffer && <span className="badge-offer">-{product.offerPercent}%</span>}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 shrink-0 justify-center">
        <button onClick={() => toggle(product.id)}
          className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${
            isFavorite(product.id) ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-200 dark:border-navy-700 text-gray-400 hover:border-red-400 hover:text-red-400'
          }`}>
          <Heart size={15} fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
        </button>
        <button onClick={() => canBuy ? addItem(product) : openLogin()}
          className="w-9 h-9 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center transition-colors">
          <ShoppingCart size={15} />
        </button>
      </div>
    </div>
  )
}

export default function Catalog() {
  usePageTitle('Catálogo de Productos')
  const [params]          = useSearchParams()
  const { isWholesale }   = useAuth()
  const { products }      = useProducts()
  const { favorites, isFavorite } = useFavorites()

  const initCategory = params.get('categoria') || ''
  const initQuery    = params.get('q') || ''
  const initTab      = params.get('tab') || 'todos'

  const { loading } = useProducts()
  const [query,   setQuery]   = useState(initQuery)
  const [sort,    setSort]    = useState('popular')
  const [view,    setView]    = useState('grid')
  const [tab,     setTab]     = useState(initTab)
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    categories: initCategory ? [initCategory] : [],
    wholesale:  isWholesale,
  })

  const resetFilters = () => setFilters({ ...DEFAULT_FILTERS, wholesale: isWholesale })

  const filtered = useMemo(() => {
    let list = [...products]

    if (tab === 'favoritos') list = list.filter(p => isFavorite(p.id))
    if (tab === 'ofertas')   list = list.filter(p => p.isOffer)

    if (query) {
      const q = query.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.includes(q))
      )
    }

    if (filters.categories.length) list = list.filter(p => filters.categories.includes(p.category))
    if (filters.brands.length)     list = list.filter(p => filters.brands.includes(p.brand))
    if (filters.onlyOffer)         list = list.filter(p => p.isOffer)
    if (filters.onlyFeatured)      list = list.filter(p => p.isFeatured)

    const ws = filters.wholesale || isWholesale
    list = list.filter(p => (ws ? p.wholesalePrice : p.price) <= filters.maxPrice)

    return list.sort((a, b) => {
      const ws2 = filters.wholesale || isWholesale
      switch (sort) {
        case 'price-asc':  return (ws2 ? a.wholesalePrice : a.price) - (ws2 ? b.wholesalePrice : b.price)
        case 'price-desc': return (ws2 ? b.wholesalePrice : b.price) - (ws2 ? a.wholesalePrice : a.price)
        case 'rating':     return b.rating - a.rating
        case 'name':       return a.name.localeCompare(b.name)
        default:           return b.reviews - a.reviews
      }
    })
  }, [query, filters, sort, tab, isFavorite, isWholesale, products])

  const showWholesale = filters.wholesale || isWholesale

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Catálogo de Productos</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} productos encontrados</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-primary-50 dark:bg-navy-800 p-1 rounded-lg w-fit mb-6">
        {[['todos','Todos'],['ofertas','Ofertas'],['favoritos',`Favoritos (${favorites.length})`]].map(([val, label]) => (
          <button key={val} onClick={() => setTab(val)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              tab === val ? 'bg-white dark:bg-navy-700 text-primary-600 shadow' : 'text-gray-500 dark:text-blue-300 hover:text-gray-700 dark:hover:text-white'
            }`}>
            {val === 'favoritos' && <Heart size={13} className="inline mr-1" />}
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        <div className="hidden lg:block">
          <ProductFilters filters={filters} onChange={setFilters} onReset={resetFilters} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <div className="lg:hidden">
                <ProductFilters filters={filters} onChange={setFilters} onReset={resetFilters} isMobile />
              </div>
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input className="input pl-9 text-sm" placeholder="Buscar productos…"
                  value={query} onChange={e => setQuery(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select className="input text-sm py-2 pr-8" value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="flex rounded-lg border border-primary-200 dark:border-navy-700 overflow-hidden">
                <button onClick={() => setView('grid')}
                  className={`p-2 ${view === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-primary-50 dark:hover:bg-navy-800'}`}>
                  <Grid3X3 size={16} />
                </button>
                <button onClick={() => setView('list')}
                  className={`p-2 ${view === 'list' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-primary-50 dark:hover:bg-navy-800'}`}>
                  <LayoutList size={16} />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">🌊</p>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No se encontraron productos</p>
              <button onClick={resetFilters} className="btn-outline mt-4 text-sm">Limpiar filtros</button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(p => <ProductCard key={p.id} product={p} showWholesale={showWholesale} />)}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(p => <ListProductCard key={p.id} product={p} showWholesale={showWholesale} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
