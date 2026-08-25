import { Link } from 'react-router-dom'
import { Crown, CheckCircle, Phone, Mail, ArrowRight, Package, TrendingUp, Users, Truck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { WHATSAPP_NUMBER, CONTACT_EMAIL } from '../config/contact'

const BENEFITS = [
  { icon: TrendingUp, title: 'Precios por volumen',    desc: 'Desde 24 unidades con precios especiales para revendedores.' },
  { icon: Package,    title: 'Stock garantizado',       desc: 'Reservamos stock para nuestros clientes mayoristas.' },
  { icon: Truck,      title: 'Envío prioritario',       desc: 'Despacho en 24 hs para pedidos mayoristas confirmados.' },
  { icon: Users,      title: 'Asesor exclusivo',        desc: 'Atención personalizada por WhatsApp y email.' },
]

const PROMOS_WS = [
  {
    producto: 'Aromatizante Ambiente y Telas',
    presentacion: '250 ml',
    icon: '🌸',
    uni24: 64320,
    uni48: 124992,
    featured: false,
  },
  {
    producto: 'Difusor de Ambientes',
    presentacion: '60 ml — con varillas',
    icon: '🌿',
    uni24: 62616,
    uni48: 121680,
    featured: false,
  },
  {
    producto: 'Difusor Aromático para Auto',
    presentacion: 'Con colgante de madera',
    icon: '🚗',
    uni24: 59232,
    uni48: 115104,
    featured: false,
  },
  {
    producto: 'Desodorante Concentrado',
    presentacion: '500 ml — ambientes y telas',
    icon: '💧',
    uni24: 77832,
    uni48: 151248,
    featured: true,
  },
  {
    producto: 'Esencia para Humidificador',
    presentacion: '60 ml — fórmula concentrada',
    icon: '✨',
    uni24: 71064,
    uni48: 138069,
    featured: false,
  },
]

export default function Wholesale() {
  usePageTitle('Venta Mayorista')
  const { user, openSignup } = useAuth()

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-16 px-4 text-center">
        <Crown size={48} className="mx-auto text-yellow-300 mb-4" />
        <h1 className="text-4xl font-extrabold mb-3">Venta Mayorista Aura</h1>
        <p className="text-primary-100 text-lg max-w-xl mx-auto mb-6">
          Precios especiales desde 24 unidades para revendedores, distribuidores y empresas. Fragancias exclusivas con descuentos por volumen.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20me%20interesa%20la%20venta%20mayorista.`} target="_blank" rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-7 py-3 rounded-lg inline-flex items-center gap-2 transition-colors">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Consultar por WhatsApp
          </a>
          {!user && (
            <button onClick={openSignup}
              className="border-2 border-white/60 text-white font-bold px-7 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Registrarme como Mayorista
            </button>
          )}
        </div>
      </div>

      {/* Benefits */}
      <section className="py-14 bg-cream-100 dark:bg-navy-900">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Beneficios del Programa Mayorista
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promos por producto */}
      <section className="py-14 bg-primary-900 dark:bg-navy-950">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-accent-400 text-xs font-semibold tracking-[0.25em] uppercase mb-2">Precios Mayoristas</p>
            <h2 className="text-2xl font-bold text-white mb-2">Promos por Producto</h2>
            <p className="text-primary-300 text-sm">Elegí el producto y la cantidad — los precios bajan cuanto más pedís</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROMOS_WS.map(p => (
              <div key={p.producto}
                className={`rounded-2xl p-6 border flex flex-col gap-5 relative
                  ${p.featured
                    ? 'bg-accent-600/20 border-accent-500/50 shadow-xl'
                    : 'bg-primary-800/50 border-primary-700/50'}`}>
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    Más vendido
                  </div>
                )}
                <div>
                  <span className="text-3xl">{p.icon}</span>
                  <h3 className="font-bold text-white mt-2 leading-tight">{p.producto}</h3>
                  <p className="text-primary-300 text-xs mt-0.5">{p.presentacion}</p>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-accent-300 text-[10px] font-bold uppercase tracking-wider">24 unidades</p>
                      <p className="text-white font-extrabold text-xl">${p.uni24.toLocaleString('es-AR')}</p>
                    </div>
                    <p className="text-primary-300 text-xs">${Math.round(p.uni24/24).toLocaleString('es-AR')}<br/><span className="text-[10px]">c/u</span></p>
                  </div>
                  <div className="flex items-center justify-between bg-accent-500/10 border border-accent-500/20 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-accent-300 text-[10px] font-bold uppercase tracking-wider">48 unidades</p>
                      <p className="text-white font-extrabold text-xl">${p.uni48.toLocaleString('es-AR')}</p>
                    </div>
                    <p className="text-primary-300 text-xs">${Math.round(p.uni48/48).toLocaleString('es-AR')}<br/><span className="text-[10px]">c/u</span></p>
                  </div>
                </div>
                <ul className="space-y-1.5 text-sm text-primary-200">
                  {['Stock reservado','Facturación disponible','Envío prioritario'].map(b => (
                    <li key={b} className="flex items-center gap-2">
                      <CheckCircle size={13} className="text-accent-400 shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-14 bg-cream-100 dark:bg-navy-900">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Solicitar Cotización</h2>
          <div className="card p-8">
            <form
              onSubmit={e => {
                e.preventDefault()
                const fd = new FormData(e.target)
                const msg = `Consulta Mayorista:\nNombre: ${fd.get('name')}\nEmpresa: ${fd.get('company')}\nEmail: ${fd.get('email')}\nProductos: ${fd.get('products')}`
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre *</label>
                  <input name="name" className="input" placeholder="Tu nombre" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Empresa</label>
                  <input name="company" className="input" placeholder="Nombre de tu empresa" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                <input name="email" type="email" className="input" placeholder="tu@empresa.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">¿Qué productos te interesan?</label>
                <textarea name="products" className="input min-h-[80px] resize-none" placeholder="Ej: Difusores x50, Aceites esenciales x100…" />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                Enviar por WhatsApp <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
              <a href={`tel:+${WHATSAPP_NUMBER}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                <Phone size={16} className="text-primary-600" /> +{WHATSAPP_NUMBER}
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                <Mail size={16} className="text-primary-600" /> {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
