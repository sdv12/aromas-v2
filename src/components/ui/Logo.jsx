/**
 * Logo Aromas Córdoba
 * Para usar el logo PNG real: copiá el archivo a /public/logo-mark.png
 * y cambiá <LogoMark> por <img src="/logo-mark.png" alt="" className={...} />
 */

export function LogoMark({ size = 36, color = '#1285b5' }) {
  const h = size * 1.18
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 50 59"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer mark — approximation of the Aromas Córdoba brand glyph */}
      <path
        fill={color}
        d="M36 3 C24 0 6 10 2 24 C-1 36 3 50 13 55 C20 59 30 59 38 56 C46 52 50 46 50 38 L50 3 C44 1 40 3 36 3 Z"
      />
      {/* Inner white teardrop (counter of the 'a') */}
      <path
        fill="white"
        d="M24 16 C24 16 11 28 11 37 C11 46 17 52 25 52 C33 52 38 46 38 37 C38 28 24 16 24 16 Z"
      />
    </svg>
  )
}

/** Full logo: mark + wordmark, horizontal layout */
export function LogoFull({ dark = false, size = 36 }) {
  const blue = dark ? '#7bbfe0' : '#1285b5'
  return (
    <span className="flex items-center gap-2.5 select-none">
      <LogoMark size={size} color={blue} />
      <span className="leading-tight">
        <span className={`block text-[0.8rem] font-medium tracking-wide lowercase ${dark ? 'text-blue-200' : 'text-primary-600'}`}>
          aromas
        </span>
        <span className={`block text-[1.1rem] font-bold leading-none tracking-tight ${dark ? 'text-blue-100' : 'text-primary-700'}`}>
          Córdoba
        </span>
      </span>
    </span>
  )
}

/** Header variant: adapts to dark/light mode automatically */
export default function LogoHeader() {
  return (
    <span className="flex items-center gap-2.5 select-none">
      {/* Light mode mark */}
      <span className="dark:hidden">
        <LogoMark size={34} color="#1285b5" />
      </span>
      {/* Dark mode mark */}
      <span className="hidden dark:block">
        <LogoMark size={34} color="#3d9cdc" />
      </span>
      <span className="leading-tight">
        <span className="block text-[0.75rem] font-medium tracking-widest uppercase text-primary-500 dark:text-primary-400">
          aromas
        </span>
        <span className="block text-[1.05rem] font-bold leading-none text-primary-700 dark:text-blue-200">
          Córdoba
        </span>
      </span>
    </span>
  )
}
