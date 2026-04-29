import { useState } from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'
import { CATEGORIES, BRANDS } from '../../data/products'

export default function ProductFilters({ filters, onChange, onReset, isMobile }) {
  const [open, setOpen] = useState(false)

  const toggle = key => val => {
    const current = filters[key]
    const next = current.includes(val) ? current.filter(v => v !== val) : [...current, val]
    onChange({ ...filters, [key]: next })
  }

  const Section = ({ title, children }) => {
    const [collapsed, setCollapsed] = useState(false)
    return (
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <button
          onClick={() => setCollapsed(s => !s)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
        >
          {title}
          <ChevronDown size={15} className={`transition-transform ${collapsed ? '-rotate-90' : ''}`} />
        </button>
        {!collapsed && children}
      </div>
    )
  }

  const content = (
    <div className="space-y-0">
      {/* Mayorista toggle */}
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Modo Mayorista</span>
          <button
            onClick={() => onChange({ ...filters, wholesale: !filters.wholesale })}
            className={`relative w-11 h-6 rounded-full transition-colors ${filters.wholesale ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${filters.wholesale ? 'translate-x-5' : ''}`} />
          </button>
        </label>
      </div>

      <Section title="Categoría">
        <div className="space-y-1.5">
          {CATEGORIES.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.id)}
                onChange={() => toggle('categories')(cat.id)}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                {cat.icon} {cat.label}
              </span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Marca">
        <div className="space-y-1.5">
          {BRANDS.map(brand => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggle('brands')(brand)}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Precio">
        <div className="px-1">
          <input
            type="range"
            min={0}
            max={15000}
            step={500}
            value={filters.maxPrice}
            onChange={e => onChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full accent-primary-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$0</span>
            <span className="font-semibold text-primary-600">${filters.maxPrice.toLocaleString('es-AR')}</span>
            <span>$15.000</span>
          </div>
        </div>
      </Section>

      <Section title="Extras">
        <div className="space-y-1.5">
          {[['onlyOffer','Solo Ofertas'],['onlyFeatured','Solo Destacados']].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={() => onChange({ ...filters, [key]: !filters[key] })}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </Section>

      <button onClick={onReset} className="w-full btn-ghost text-sm flex items-center justify-center gap-1.5 border border-gray-200 dark:border-gray-700">
        <X size={14} /> Limpiar filtros
      </button>
    </div>
  )

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 btn-outline text-sm px-4 py-2"
        >
          <Filter size={16} /> Filtros
        </button>
        {open && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <div className="relative ml-auto w-80 max-w-full h-full bg-white dark:bg-gray-900 shadow-2xl p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">Filtros</h2>
                <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X size={20} />
                </button>
              </div>
              {content}
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <aside className="w-56 shrink-0">
      <div className="card p-4 sticky top-20">
        <h2 className="font-bold text-base text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Filter size={16} /> Filtros
        </h2>
        {content}
      </div>
    </aside>
  )
}
