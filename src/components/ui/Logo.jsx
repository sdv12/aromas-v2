/* Aura brand logo — mark + wordmark */

function LeafMark({ size = 28, color = '#1B2A6B' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M14 2C9 2 4 6.5 4 12c0 4 2.5 7.5 6 9.5L14 26l4-4.5c3.5-2 6-5.5 6-9.5C24 6.5 19 2 14 2z"
        fill={color} opacity="0.15"
      />
      <path
        d="M14 4C10 4 6 8 6 12c0 3.5 2 6.5 5 8.5L14 24l3-3.5c3-2 5-5 5-8.5C22 8 18 4 14 4z"
        fill={color} opacity="0.3"
      />
      <path
        d="M14 7C11 7 8.5 9.5 8.5 12.5c0 2.5 1.5 4.5 3.5 6L14 21l2-2.5c2-1.5 3.5-3.5 3.5-6C19.5 9.5 17 7 14 7z"
        fill={color}
      />
      <line x1="14" y1="12" x2="14" y2="21" stroke="white" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  )
}

export function LogoMark({ size = 36, color = '#1B2A6B' }) {
  return <LeafMark size={size} color={color} />
}

export function LogoFull({ dark = false, size = 36 }) {
  const navy  = dark ? '#9ab8d8' : '#1B2A6B'
  const gold  = '#c4973a'
  return (
    <span className="flex items-center gap-2.5 select-none">
      <LeafMark size={size} color={dark ? '#9ab8d8' : '#1B2A6B'} />
      <span className="leading-none">
        <span className="block font-bold tracking-[0.18em] uppercase text-[0.75rem]"
          style={{ color: gold, fontFamily: 'Georgia, serif', letterSpacing: '0.18em' }}>
          Aromas
        </span>
        <span className="block font-bold tracking-[0.25em] uppercase"
          style={{ color: navy, fontSize: size * 0.55, fontFamily: 'Georgia, serif' }}>
          AURA
        </span>
      </span>
    </span>
  )
}

export default function LogoHeader() {
  return (
    <span className="flex items-center gap-2 select-none">
      <span className="dark:hidden"><LeafMark size={30} color="#1B2A6B" /></span>
      <span className="hidden dark:block"><LeafMark size={30} color="#9ab8d8" /></span>
      <span className="leading-none">
        <span className="block text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-accent-500">
          Aromas
        </span>
        <span className="block text-[1.05rem] font-bold tracking-[0.22em] uppercase text-primary-700 dark:text-cream-200"
          style={{ fontFamily: 'Georgia, serif' }}>
          AURA
        </span>
      </span>
    </span>
  )
}
