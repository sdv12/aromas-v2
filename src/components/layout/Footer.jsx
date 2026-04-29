import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Facebook, Clock } from 'lucide-react'
import { LogoFull } from '../ui/Logo'
import { WHATSAPP_NUMBER, CONTACT_EMAIL } from '../../config/contact'

export default function Footer() {
  return (
    <footer className="bg-primary-900 dark:bg-navy-950 text-primary-100 border-t border-primary-800 dark:border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="mb-4">
              <LogoFull dark size={32} />
            </div>
            <p className="text-sm text-primary-200 leading-relaxed mb-4">
              Fragancias y aromas para el hogar y la empresa. Venta mayorista y minorista en Córdoba, Argentina.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-800 dark:bg-navy-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                <Instagram size={17} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-800 dark:bg-navy-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                <Facebook size={17} />
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-800 dark:bg-navy-800 hover:bg-green-600 flex items-center justify-center transition-colors">
                <svg className="w-[17px] h-[17px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Tienda */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tienda</h3>
            <ul className="space-y-2 text-sm">
              {[['/catalogo','Catálogo'],['/ofertas','Ofertas'],['/mayorista','Venta Mayorista'],['/nosotros','Sobre Nosotros']].map(([to,label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Información</h3>
            <ul className="space-y-2 text-sm">
              {['Política de Privacidad','Términos y Condiciones','Cómo Comprar','Preguntas Frecuentes'].map(label => (
                <li key={label}><a href="#" className="hover:text-white transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="text-primary-300 shrink-0 mt-0.5" />
                <span>Córdoba Capital, Argentina</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-primary-300 shrink-0" />
                <a href="tel:+5493516000000" className="hover:text-white transition-colors">+54 9 351 600-0000</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-primary-300 shrink-0" />
                <a href="mailto:hola@aromascba.com" className="hover:text-white transition-colors">hola@aromascba.com</a>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={15} className="text-primary-300 shrink-0 mt-0.5" />
                <span>Lun–Vie 9:00–18:00<br />Sáb 9:00–13:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-800 dark:border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-300">
          <span>© {new Date().getFullYear()} Aromas Córdoba. Todos los derechos reservados.</span>
          <span>Hecho con ❤ en Córdoba, Argentina</span>
        </div>
      </div>
    </footer>
  )
}
