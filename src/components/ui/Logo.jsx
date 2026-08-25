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
          filter: dark ? 'brightness(0) invert(1)' : 'none',
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
        style={{ height: 36, width: 'auto', objectFit: 'contain' }}
      />
    </span>
  )
}
