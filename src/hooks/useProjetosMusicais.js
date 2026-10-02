import { useEffect, useState } from 'react'
import { carregarProjetosMusicais } from '../lib/catalogo'

export function useProjetosMusicais() {
  const [estado, setEstado] = useState({ projetos: [], carregando: true, erro: null })

  useEffect(() => {
    let vivo = true
    carregarProjetosMusicais()
      .then(projetos => { if (vivo) setEstado({ projetos, carregando: false, erro: null }) })
      .catch(erro => { if (vivo) setEstado({ projetos: [], carregando: false, erro }) })
    return () => { vivo = false }
  }, [])

  return estado
}
