// Ícones em SVG inline — herdam a cor do texto (currentColor)

export function IconePlay({ tamanho = 16 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M4 2v12l10-6L4 2z" />
    </svg>
  )
}

export function IconePause({ tamanho = 16 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="3" y="2" width="3.5" height="12" />
      <rect x="9.5" y="2" width="3.5" height="12" />
    </svg>
  )
}

export function IconeAnterior({ tamanho = 16 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 6h2v12H6zM9.5 12l8.5 6V6z" />
    </svg>
  )
}

export function IconeProxima({ tamanho = 16 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" />
    </svg>
  )
}

export function Spinner({ tamanho = 16 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5">
        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

export function IconeFechar({ tamanho = 14 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export function IconeSeta({ tamanho = 14 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function IconeVolume({ mudo = false, tamanho = 16 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
      {mudo
        ? <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="1.8" />
        : <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.6" />}
    </svg>
  )
}

export function IconeSpotify({ tamanho = 16 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

export function IconeWhatsApp({ tamanho = 16 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.21-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.22 4.25-9.47 9.48-9.47 2.53 0 4.91.99 6.7 2.78a9.4 9.4 0 0 1 2.77 6.7c0 5.22-4.25 9.46-9.47 9.46zm8.06-17.53A11.33 11.33 0 0 0 12.05.64C5.77.64.65 5.75.65 12.04c0 2.01.52 3.97 1.52 5.7L.55 23.64l6.04-1.58a11.4 11.4 0 0 0 5.45 1.39h.01c6.28 0 11.4-5.11 11.4-11.4 0-3.04-1.19-5.9-3.34-8.06z" />
    </svg>
  )
}

export function IconeInstagram({ tamanho = 16 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  )
}

export function IconeEmail({ tamanho = 16 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 5.5l9 7 9-7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function IconeNota({ tamanho = 20 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9 17.5a3 3 0 1 1-2-2.83V4l12-2v13.5a3 3 0 1 1-2-2.83V6.3l-8 1.33z" />
    </svg>
  )
}
