import { Link } from 'react-router-dom'
import { Tag, Clock, ArrowRight } from 'lucide-react'
import { useProducts } from '../context/ProductsContext'
import ProductCard     from '../components/products/ProductCard'
import { useAuth }     from '../context/AuthContext'

export default function Offers() {
  const { isWholesale } = useAuth()
  const { offers }      = useProducts()

  return (
    <div>
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Tag size={28} />
          <h1 className="text-3xl font-extrabold">Ofertas Especiales</h1>
        </div>
        <p className="text-red-100 text-lg mb-4">Descuentos de hasta 30% en productos seleccionados</p>
        <div className="flex items-center justify-center gap-2 text-sm text-red-200">
          <Clock size={15} />
          <span>Ofertas válidas por tiempo limitado · Stock sujeto a disponibilidad</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 dark:text-gray-400 text-sm">{offers.length} productos en oferta</p>
          <Link to="/catalogo?tab=ofertas" className="text-primary-600 hover:underline text-sm flex items-center gap-1">
            Ver en catálogo <ArrowRight size={14} />
          </Link>
        </div>

        {offers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🏷</p>
            <p className="text-gray-500 dark:text-gray-400">No hay ofertas disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {offers.map(p => <ProductCard key={p.id} product={p} showWholesale={isWholesale} />)}
          </div>
        )}

        <div className="mt-12 card p-8 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-navy-850 dark:to-navy-900 border-primary-200 dark:border-navy-700 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¿Comprás en cantidad?</h2>
          <p className="text-gray-600 dark:text-blue-200 mb-4 text-sm">
            Accedé a precios mayoristas con hasta 30% de descuento adicional sobre el precio de oferta.
          </p>
          <Link to="/mayorista" className="btn-primary inline-flex items-center gap-2">
            Conocer precios mayoristas <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
