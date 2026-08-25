import { Routes, Route } from 'react-router-dom'
import { ProductsProvider } from './context/ProductsContext'
import { OrdersProvider }   from './context/OrdersContext'
import Layout        from './components/layout/Layout'
import Home          from './pages/Home'
import Catalog       from './pages/Catalog'
import CartPage      from './pages/CartPage'
import Offers        from './pages/Offers'
import Wholesale     from './pages/Wholesale'
import About         from './pages/About'
import CatalogAdmin    from './pages/admin/CatalogAdmin'
import ProductDetail  from './pages/ProductDetail'
import OrderHistory   from './pages/OrderHistory'
import PaymentResult  from './pages/PaymentResult'
import DigitalCatalog from './pages/DigitalCatalog'

export default function App() {
  return (
    <ProductsProvider>
      <OrdersProvider>
        <Layout>
          <Routes>
            <Route path="/"                element={<Home />} />
            <Route path="/catalogo"        element={<Catalog />} />
            <Route path="/carrito"         element={<CartPage />} />
            <Route path="/ofertas"         element={<Offers />} />
            <Route path="/mayorista"       element={<Wholesale />} />
            <Route path="/nosotros"        element={<About />} />
            <Route path="/producto/:id"    element={<ProductDetail />} />
            <Route path="/mis-pedidos"     element={<OrderHistory />} />
            <Route path="/pago/resultado"  element={<PaymentResult />} />
            <Route path="/admin/catalogo"  element={<CatalogAdmin />} />
            <Route path="/catalogo-digital" element={<DigitalCatalog />} />
            <Route path="*"               element={<NotFound />} />
          </Routes>
        </Layout>
      </OrdersProvider>
    </ProductsProvider>
  )
}

function NotFound() {
  return (
    <div className="text-center py-24">
      <p className="text-6xl font-black text-gray-200 dark:text-navy-800 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-700 dark:text-blue-200 mb-2">Página no encontrada</h1>
      <a href="/" className="text-primary-600 hover:underline">Volver al inicio</a>
    </div>
  )
}
