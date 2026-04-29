import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

const CONFIG = {
  success: {
    Icon:   CheckCircle,
    bar:    'bg-green-500',
    icon:   'text-green-500',
    border: 'border-green-100 dark:border-green-900',
  },
  warning: {
    Icon:   AlertTriangle,
    bar:    'bg-yellow-400',
    icon:   'text-yellow-500',
    border: 'border-yellow-100 dark:border-yellow-900',
  },
  error: {
    Icon:   XCircle,
    bar:    'bg-red-500',
    icon:   'text-red-500',
    border: 'border-red-100 dark:border-red-900',
  },
  info: {
    Icon:   Info,
    bar:    'bg-primary-500',
    icon:   'text-primary-500',
    border: 'border-primary-100 dark:border-primary-900',
  },
}

export default function ToastContainer() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-6 right-4 z-[200] flex flex-col gap-2 items-end pointer-events-none"
      aria-live="polite"
    >
      {toasts.map(t => {
        const cfg  = CONFIG[t.type] || CONFIG.info
        const Icon = cfg.Icon
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 bg-white dark:bg-navy-900 border ${cfg.border} rounded-xl shadow-xl p-4 max-w-xs w-full animate-toast`}
          >
            {/* Color bar */}
            <div className={`w-1 self-stretch rounded-full ${cfg.bar} shrink-0`} />
            <Icon size={18} className={`${cfg.icon} shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              {t.title && (
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                  {t.title}
                </p>
              )}
              {t.message && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                  {t.message}
                </p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
