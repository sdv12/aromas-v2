/* Aura brand logo — usa /public/logo-aura.png */

export function LogoMark({ size = 36 }) {
  return (
    <img
      src="/logo-aura.png"
      alt="Aura"
      style={{ height: size, width: 'auto', objectFit: 'contain' }}
    />
  )
}

export function LogoFull({ dark = false, size = 36 }) {
  return (
    <span className="flex items-center select-none">
      <img
        src="/logo-aura.png"
        alt="Aura"
        style={{
          height: size * 1.4,
          width: 'auto',
          objectFit: 'contain',
          filter: dark ? 'brightness(0) invert(1) sepia(1) saturate(0) brightness(1.8)' : 'none',
        }}
      />
    </span>
  )
}

export default function LogoHeader() {
  return (
    <span className="flex items-center select-none">
      <img
        src="/logo-aura.png"
        alt="Aura"
        className="h-8 w-auto object-contain dark:brightness-0 dark:invert dark:sepia-0 dark:saturate-0 dark:brightness-150"
        style={{ height: 36 }}
      />
    </span>
  )
}
