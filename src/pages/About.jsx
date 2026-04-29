import { MapPin, Phone, Mail, Clock, Heart, Leaf, Award } from 'lucide-react'

const TEAM = [
  { name: 'Valeria Moreno', role: 'Fundadora & Directora', img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=face' },
  { name: 'Santiago Ruiz',  role: 'Gerente de Ventas',    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face' },
  { name: 'Lucia Fernández',role: 'Atención al Cliente',  img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face' },
]

export default function About() {
  return (
    <div>
      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&h=400&fit=crop" alt="Sobre Nosotros" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-700/60 flex items-center">
          <div className="max-w-7xl mx-auto px-6 text-white">
            <h1 className="text-4xl font-extrabold mb-2">Sobre Nosotros</h1>
            <p className="text-primary-100 text-lg">Apasionados por las fragancias desde 2018</p>
          </div>
        </div>
      </div>

      {/* Mission / Vision / Values */}
      <section className="py-14 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Heart,  title: 'Nuestra Misión', color: 'text-red-500',     bg: 'bg-red-50 dark:bg-red-950',
              text: 'Llevar fragancias de calidad a cada hogar y empresa de Córdoba, con un servicio cercano y accesible tanto para clientes retail como para revendedores.' },
            { icon: Leaf,   title: 'Nuestra Visión', color: 'text-green-500',   bg: 'bg-green-50 dark:bg-green-950',
              text: 'Ser la referencia en aromas y fragancias del interior del país, expandiendo nuestra red de distribuidores y promoviendo productos naturales y sustentables.' },
            { icon: Award,  title: 'Nuestros Valores', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950',
              text: 'Calidad, honestidad y compromiso. Trabajamos con ingredientes seleccionados, precios transparentes y atención personalizada para cada cliente.' },
          ].map(({ icon: Icon, title, color, bg, text }) => (
            <div key={title} className="card p-8 text-center">
              <div className={`w-14 h-14 rounded-full ${bg} flex items-center justify-center mx-auto mb-4`}>
                <Icon size={28} className={color} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row gap-10 items-center">
          <img
            src="https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&h=400&fit=crop"
            alt="Historia"
            className="w-full md:w-80 rounded-2xl object-cover shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Nuestra Historia</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
              Aromas CBA nació en 2018 en Córdoba Capital, de la mano de Valeria Moreno, con la idea de acercar fragancias de calidad premium a precios accesibles para el hogar argentino.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
              Lo que empezó como un emprendimiento familiar creció rápidamente gracias a la confianza de nuestros clientes. Hoy contamos con más de 200 productos y una red de distribuidores en toda la provincia.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Nos especializamos en difusores ultrasónicos, aceites esenciales, velas artesanales y sahumerios, siempre priorizando la calidad de los ingredientes y la sustentabilidad.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-14 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">Nuestro Equipo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {TEAM.map(m => (
              <div key={m.name} className="card p-6 text-center">
                <img src={m.img} alt={m.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 ring-4 ring-primary-100 dark:ring-primary-900"
                  onError={e => { e.target.src = `https://placehold.co/80x80/ccfbf1/0f766e?text=${m.name.slice(0,1)}` }} />
                <h3 className="font-semibold text-gray-900 dark:text-white">{m.name}</h3>
                <p className="text-sm text-primary-600 dark:text-primary-400">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact + Map */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">Contacto y Ubicación</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="card p-8">
              <h3 className="font-bold text-gray-900 dark:text-white mb-5">Envianos un mensaje</h3>
              <form
                onSubmit={e => {
                  e.preventDefault()
                  const fd = new FormData(e.target)
                  window.open(`mailto:hola@aromascba.com?subject=Consulta&body=${encodeURIComponent(`Nombre: ${fd.get('name')}\nEmail: ${fd.get('email')}\n\n${fd.get('msg')}`)}`, '_blank')
                }}
                className="space-y-4"
              >
                <input name="name" className="input" placeholder="Nombre *" required />
                <input name="email" type="email" className="input" placeholder="Email *" required />
                <textarea name="msg" className="input min-h-[100px] resize-none" placeholder="Tu mensaje…" required />
                <button type="submit" className="btn-primary w-full">Enviar por Email</button>
              </form>

              <div className="mt-6 space-y-3">
                {[
                  { icon: Phone, label: '+54 9 351 600-0000', href: 'tel:+5493516000000' },
                  { icon: Mail,  label: 'hola@aromascba.com', href: 'mailto:hola@aromascba.com' },
                  { icon: MapPin,label: 'Córdoba Capital, Argentina', href: '#mapa' },
                  { icon: Clock, label: 'Lun–Vie 9:00–18:00 · Sáb 9:00–13:00', href: null },
                ].map(({ icon: Icon, label, href }) => (
                  <div key={label} className="flex items-center gap-3">
                    <Icon size={16} className="text-primary-600 shrink-0" />
                    {href && href !== '#mapa'
                      ? <a href={href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">{label}</a>
                      : <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div id="mapa" className="card overflow-hidden h-80 lg:h-auto relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108920.92596760285!2d-64.27810569357645!3d-31.416668010376836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432985f478f5b69%3A0xb0a24f9a5366b299!2sC%C3%B3rdoba%2C%20Argentina!5e0!3m2!1ses!2s!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '320px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa Aromas CBA"
              />
            </div>
          </div>

          {/* Certifications */}
          <div className="mt-12">
            <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-6">Certificaciones de Calidad</h3>
            <div className="flex flex-wrap justify-center gap-8">
              {['100% Natural','Sin Parabenos','Cruelty Free','Eco Friendly'].map(cert => (
                <div key={cert} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full border-2 border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-950 flex items-center justify-center">
                    <Award size={28} className="text-primary-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 text-center">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
