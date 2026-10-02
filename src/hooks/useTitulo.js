import { useEffect } from 'react'

const MARCA = 'stu. música'

export function useTitulo(titulo, descricao) {
  useEffect(() => {
    document.title = titulo ? `${titulo} — ${MARCA}` : `${MARCA} — Produção musical, arranjo e trilhas sonoras`
    if (descricao) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', descricao)
    }
  }, [titulo, descricao])
}
