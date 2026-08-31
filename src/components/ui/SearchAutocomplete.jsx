import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ArrowRight, Tag } from 'lucide-react'
import { useProducts } from '../../context/ProductsContext'
import { useAuth }     from '../../context/AuthContext'

const MAX_PRODUCTS  = 5
const MAX_CATS      = 2
const MIN_QUERY_LEN = 1

function highlight(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded px-0.5 not-italic">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}

export default function SearchAutocomplete({ onClose }) {
  const { products, categories: CATEGORIES } = useProducts()
  const { isWholesale } = useAuth()
  const navigate        = useNavigate()

  const [query,    setQuery]    = useState('')
  const [active,   setActive]   = useState(-1)  // keyboard-highlighted index
  const [visible,  setVisible]  = useState(false)

  const inputRef    = useRef()
  const listRef     = useRef()

  useEffect(() => { inputRef.current?.focus() }, [])

  // Build suggestion list
  const suggestions = useCallback(() => {
    const q = query.trim().toLowerCase()
    if (q.length < MIN_QUERY_LEN) return []

    const matchedProducts = products
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      )
      .slice(0, MAX_PRODUCTS)
      .map(p => ({ type: 'product', data: p }))

    const matchedCats = CATEGORIES
      .filter(c =>
        c.label.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      )
      .slice(0, MAX_CATS)
      .map(c => ({ type: 'category', data: c }))

    return [...matchedProducts, ...matchedCats]
  }, [query, products])

  const items = suggestions()
  const showDropdown = visible && query.trim().length >= MIN_QUERY_LEN

  const go = (item) => {
    if (item.type === 'product') {
      navigate(`/producto/${item.data.id}`)
    } else {
      navigate(`/catalogo?categoria=${item.data.id}`)
    }
    onClose()
  }

  const goSearch = () => {
    if (query.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  const handleKey = (e) => {
    if (!showDropdown) {
      if (e.key === 'Enter') goSearch()
      if (e.key === 'Escape') onClose()
      return
    }
    // Total navigable items = suggestions + "see all" row
    const total = items.length + 1
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(a => (a + 1) % total)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(a => (a - 1 + total) % total)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (active === -1 || active === items.length) {
        goSearch()
      } else {
        go(items[active])
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (active >= 0 && listRef.current) {
      const el = listRef.current.querySelector(`[data-idx="${active}"]`)
      el?.scrollIntoView({ block: 'nearest' })
    }
  }, [active])

  return (
    <div className="relative w-full">
      {/* Input */}
      <div className="flex items-center gap-2 bg-white dark:bg-navy-900 border-2 border-primary-300 dark:border-primary-700 rounded-xl px-3 py-2 shadow-lg">
        <Search size={18} className="text-primary-500 shrink-0" />
        <input
          ref={inputRef}
          className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none min-w-0"
          placeholder="Buscar productos, marcas, categorías…"
          value={query}
          onChange={e => { setQuery(e.target.value); setActive(-1); setVisible(true) }}
          onFocus={() => setVisible(true)}
          onBlur={() => setTimeout(() => setVisible(false), 150)}
          onKeyDown={handleKey}
          autoComplete="off"
        />
        {query && (
          <button
            onMouseDown={e => e.preventDefault()}
            onClick={() => { setQuery(''); setActive(-1); inputRef.current?.focus() }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        )}
        <button
          onMouseDown={e => e.preventDefault()}
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0 border-l border-gray-200 dark:border-navy-700 pl-2 ml-1"
        >
          <X size={16} />
        </button>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-navy-900 rounded-xl shadow-2xl border border-gray-100 dark:border-navy-700 overflow-hidden z-50 max-h-[420px] overflow-y-auto"
        >
          {items.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
              Sin resultados para <span className="font-semibold text-gray-600 dark:text-gray-300">"{query}"</span>
            </div>
          ) : (
            <>
              {/* Product results */}
              {items.filter(i => i.type === 'product').length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Productos
                  </p>
                  {items
                    .filter(i => i.type === 'product')
                    .map((item, idx) => {
                      const p     = item.data
                      const price = isWholesale ? p.wholesalePrice : p.price
                      const isHL  = active === idx
                      return (
                        <button
                          key={p.id}
                          data-idx={idx}
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => go(item)}
                          onMouseEnter={() => setActive(idx)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                            isHL ? 'bg-primary-50 dark:bg-navy-800' : 'hover:bg-gray-50 dark:hover:bg-navy-800'
                          }`}
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100"
                            onError={e => { e.target.src = 'https://placehold.co/40x40/d8edf8/1285b5?text=A' }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                              {highlight(p.name, query)}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{highlight(p.brand, query)}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              ${price.toLocaleString('es-AR')}
                            </p>
                            {p.isOffer && (
                              <span className="text-[10px] font-bold text-red-500">-{p.offerPercent}%</span>
                            )}
                          </div>
                        </button>
                      )
                    })
                  }
                </div>
              )}

              {/* Category results */}
              {items.filter(i => i.type === 'category').length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Categorías
                  </p>
                  {items
                    .filter(i => i.type === 'category')
                    .map((item, idx) => {
                      const realIdx = items.filter(i => i.type === 'product').length + idx
                      const c       = item.data
                      const isHL    = active === realIdx
                      return (
                        <button
                          key={c.id}
                          data-idx={realIdx}
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => go(item)}
                          onMouseEnter={() => setActive(realIdx)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                            isHL ? 'bg-primary-50 dark:bg-navy-800' : 'hover:bg-gray-50 dark:hover:bg-navy-800'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-navy-800 flex items-center justify-center text-lg shrink-0">
                            {c.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 dark:text-white">
                              {highlight(c.label, query)}
                            </p>
                            <p className="text-xs text-gray-400">Ver categoría</p>
                          </div>
                          <Tag size={14} className="text-gray-300 dark:text-gray-600 shrink-0" />
                        </button>
                      )
                    })
                  }
                </div>
              )}

              {/* See all */}
              <div className="border-t border-gray-100 dark:border-navy-700">
                <button
                  data-idx={items.length}
                  onMouseDown={e => e.preventDefault()}
                  onClick={goSearch}
                  onMouseEnter={() => setActive(items.length)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors ${
                    active === items.length
                      ? 'bg-primary-50 dark:bg-navy-800 text-primary-600 dark:text-primary-400'
                      : 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-navy-800'
                  }`}
                >
                  <span>Ver todos los resultados de "{query}"</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
