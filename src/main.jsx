import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider }    from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider }     from './context/CartContext'
import { FavoritesProvider } from './context/FavoritesContext'
import App from './App'
import './index.css'

function AuthGate({ children }) {
  const { authLoading } = useAuth()
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-navy-900">
        <div className="w-8 h-8 rounded-full border-4 border-cream-400 border-t-primary-700 animate-spin" />
      </div>
    )
  }
  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <AuthGate>
                <App />
              </AuthGate>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
