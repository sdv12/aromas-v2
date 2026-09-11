import Header          from './Header'
import Footer          from './Footer'
import WhatsAppButton  from '../ui/WhatsAppButton'
import AuthModal       from '../auth/AuthModal'
import ToastContainer  from '../ui/ToastContainer'
import CartSidebar     from '../cart/CartSidebar'
import { ToastProvider } from '../../context/ToastContext'

export default function Layout({ children }) {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-cream-100 dark:bg-navy-900 transition-colors duration-300">
        <Header />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
        <CartSidebar />
        <WhatsAppButton />
        <AuthModal />
        <ToastContainer />
      </div>
    </ToastProvider>
  )
}
