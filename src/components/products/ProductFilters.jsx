import { useState } from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'
import { CATEGORIES, BRANDS } from '../../data/products'

export default function ProductFilters({ filters, onChange, onReset, isMobile }) {
  const [open, setOpen] = useState(false)

  // Categoría: selección única (radio)
  const selectCategory = id => {
    const next = filters.categories.includes(id) ? [] : [id]
    onChange({ ...filters, categories: next })
  }

  // Extras: solo uno activo a la vez
  const selectExtra = key => {
    onChange({
      ...filters,
      onlyOffer:     key === 'onlyOffer'     ? !filters.onlyOffer     : false,
      onlyFeatured:  key === 'onlyFeatured'  ? !filters.onlyFeatured  : false,
    })
  }

  const Section = ({ title, children }) => {
    const [collapsed, setCollapsed] = useState(false)
    return (
      <div className="border-b border-cream-200 dark:border-navy-700 pb-4 mb-4">
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
      {/* Mayorista toggle — deshabilitado por ahora */}
      <div className="mb-4 pb-4 border-b border-cream-200 dark:border-navy-700 opacity-40">
        <label className="flex items-center justify-between cursor-not-allowed">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Modo Mayorista</span>
          <div className="relative w-11 h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-not-allowed">
            <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow" />
          </div>
        </label>
        <p className="text-[10px] text-gray-400 mt-1">Los precios mayoristas se muestran en cada producto</p>
      </div>

      <Section title="Categoría">
        <div className="space-y-1.5">
          {CATEGORIES.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category-filter"
                checked={filters.categories.includes(cat.id)}
                onChange={() => selectCategory(cat.id)}
                className="w-4 h-4 border-gray-300 text-primary-600 focus:ring-primary-500"
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

      {/* Selector de precio deshabilitado */}
      <div className="border-b border-cream-200 dark:border-navy-700 pb-4 mb-4 opacity-40">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Precio máximo</p>
        <input type="range" disabled className="w-full accent-primary-600 cursor-not-allowed" />
        <p className="text-[10px] text-gray-400 mt-1">Próximamente disponible</p>
      </div>

      <Section title="Extras">
        <div className="space-y-1.5">
          {[['onlyOffer','Solo Ofertas'],['onlyFeatured','Solo Destacados']].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="extras-filter"
                checked={filters[key]}
                onChange={() => selectExtra(key)}
                className="w-4 h-4 border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </Section>

      <button onClick={onReset} className="w-full btn-ghost text-sm flex items-center justify-center gap-1.5 border border-cream-200 dark:border-navy-700">
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
            <div className="relative ml-auto w-80 max-w-full h-full bg-white dark:bg-navy-900 shadow-2xl p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">Filtros</h2>
                <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-cream-100 dark:hover:bg-navy-800">
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
