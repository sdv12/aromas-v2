import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, X, Send } from 'lucide-react'
import { WHATSAPP_NUMBER } from '../../config/contact'
import { FAQ } from '../../data/chatFAQ'

const QUICK_MENU = ['¿Hacen envíos?', '¿Cómo pago?', 'Precios mayoristas', 'Ver promos', 'Horarios de atención']

const WELCOME = {
  id: 'welcome',
  from: 'bot',
  text: '¡Hola! 👋 Soy el asistente de Aura.\n¿En qué te puedo ayudar?',
  quick: QUICK_MENU,
}

const FALLBACK = {
  text: 'No tengo una respuesta para eso 😅\nPero podés consultarnos directo por WhatsApp y te respondemos al toque.',
  quick: ['Escribir por WhatsApp', 'Volver al inicio'],
  whatsapp: 'Hola, tengo una consulta sobre Aura Aromas.',
}

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
}

function findAnswer(input) {
  const q = normalize(input)
  for (const faq of FAQ) {
    if (faq.triggers.some(t => q.includes(normalize(t)))) return faq
  }
  return null
}

export default function ChatBot() {
  const [open, setOpen]       = useState(false)
  const [messages, setMsgs]   = useState([])
  const [input, setInput]     = useState('')
  const [initialized, setInit] = useState(false)
  const [unread, setUnread]   = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)
  const navigate  = useNavigate()

  const handleOpen = () => {
    setOpen(true)
    setUnread(false)
    if (!initialized) {
      setMsgs([WELCOME])
      setInit(true)
    }
  }

  // Scroll al último mensaje
  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  // Foco al input al abrir
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  // Notificación sutil a los 8 segundos si no abrieron
  useEffect(() => {
    if (initialized) return
    const id = setTimeout(() => setUnread(true), 8000)
    return () => clearTimeout(id)
  }, [initialized])

  const send = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setInput('')

    const userMsg = { id: Date.now(), from: 'user', text: trimmed }
    const match   = findAnswer(trimmed)
    const botData = match ?? FALLBACK
    const botMsg  = {
      id: Date.now() + 1,
      from: 'bot',
      text: botData.answer ?? botData.text,
      quick: botData.quick,
      whatsapp: botData.whatsapp,
    }

    setMsgs(prev => [...prev, userMsg, botMsg])
  }

  const handleQuick = (q) => {
    if (q === 'Escribir por WhatsApp') {
      const lastBot = [...messages].reverse().find(m => m.from === 'bot')
      const waText  = typeof lastBot?.whatsapp === 'string'
        ? lastBot.whatsapp
        : 'Hola, tengo una consulta sobre Aura Aromas.'
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`, '_blank')
      return
    }
    if (q === 'Volver al inicio') {
      setMsgs(prev => [...prev, WELCOME])
      return
    }
    if (q === 'Ver catálogo') {
      navigate('/catalogo')
      setOpen(false)
      return
    }
    send(q)
  }

  const lastBot     = [...messages].findLast(m => m.from === 'bot')
  const currentQuick = lastBot?.quick ?? null

  return (
    <>
      {/* Botón flotante — izquierda, apilado sobre el margen inferior */}
      <button
        onClick={open ? () => setOpen(false) : handleOpen}
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente'}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 bg-primary-700 hover:bg-primary-800 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
      >
        {open
          ? <X size={22} className="text-white" />
          : <MessageCircle size={24} className="text-white" />
        }
        {!open && unread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Panel de chat */}
      <div
        className={`fixed bottom-24 left-6 z-40 w-80 max-w-[calc(100vw-3rem)] bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-cream-200 dark:border-navy-700 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-left ${
          open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none'
        }`}
        style={{ height: 460 }}
      >
        {/* Header */}
        <div className="bg-primary-700 px-4 py-3 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-base">🌸</div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold leading-tight">Asistente Aura</p>
            <p className="text-primary-200 text-xs">Respuesta inmediata</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-line ${
                msg.from === 'user'
                  ? 'bg-primary-700 text-white rounded-br-sm'
                  : 'bg-cream-100 dark:bg-navy-800 text-gray-800 dark:text-gray-100 rounded-bl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Quick replies */}
        {currentQuick && currentQuick.length > 0 && (
          <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
            {currentQuick.map(q => (
              <button
                key={q}
                onClick={() => handleQuick(q)}
                className="text-xs px-2.5 py-1.5 rounded-full border border-primary-200 dark:border-navy-600 text-primary-700 dark:text-accent-400 hover:bg-primary-50 dark:hover:bg-navy-800 transition-colors"
              >
                {q === 'Escribir por WhatsApp' && '💬 '}{q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-cream-200 dark:border-navy-700 px-3 py-2 flex gap-2 shrink-0">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            placeholder="Escribí tu pregunta…"
            className="flex-1 text-sm bg-cream-50 dark:bg-navy-800 border border-cream-200 dark:border-navy-700 rounded-full px-3 py-2 outline-none focus:border-primary-400 dark:text-gray-100 placeholder-gray-400"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-full bg-primary-700 hover:bg-primary-800 disabled:opacity-30 flex items-center justify-center transition-colors shrink-0"
          >
            <Send size={14} className="text-white" />
          </button>
        </div>
      </div>
    </>
  )
}
