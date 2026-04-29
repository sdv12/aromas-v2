import Header          from './Header'
import Footer          from './Footer'
import WhatsAppButton  from '../ui/WhatsAppButton'
import AuthModal       from '../auth/AuthModal'
import ToastContainer  from '../ui/ToastContainer'
import { ToastProvider } from '../../context/ToastContext'

export default function Layout({ children }) {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
        <Header />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <AuthModal />
        <ToastContainer />
      </div>
    </ToastProvider>
  )
}
