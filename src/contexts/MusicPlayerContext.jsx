/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

/*
 * Player global de música.
 *
 * Existe UM elemento <audio> no site inteiro, e ele mora aqui. É ele que toca —
 * no player do rodapé, na waveform de um projeto ou numa linha da tracklist.
 * Assim nunca tocam duas faixas ao mesmo tempo e o som continua ao trocar de
 * página (o provider fica acima do roteador).
 *
 * As waveforms (wavesurfer.js) são só a visualização: elas não tocam nada,
 * apenas espelham o tempo deste elemento — ver AudioPlayer.
 *
 * O progresso NÃO vive no estado do contexto (re-renderizaria o site inteiro
 * a cada quadro). Quem precisa dele usa `useProgresso()`, que lê direto do
 * elemento e só re-renderiza o próprio componente.
 *
 * Formato de uma faixa: { id, nome, audio_url, spotify_url, artista, capa,
 * projetoNome } — montado em lib/catalogo.js.
 */

const MusicPlayerContext = createContext(null)

const indiceNaFila = (lista, faixa) => lista.findIndex(f => f.id === faixa?.id)

// O elemento único. Fica no módulo, fora do React: não é estado de
// renderização, é o "aparelho de som" do site.
const audio = new Audio()
audio.preload = 'metadata'

// Recarregamento a quente (dev): o módulo novo cria outro elemento — cala o antigo
if (import.meta.hot) import.meta.hot.dispose(() => audio.pause())

export function MusicPlayerProvider({ children }) {
  const [faixaAtual, setFaixaAtual] = useState(null)
  const [fila, setFila] = useState([])
  const [tocando, setTocando] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)
  const [volume, setVolume] = useState(audio.volume)
  const [mudo, setMudo] = useState(audio.muted)

  // Espelhos em ref: os callbacks ficam estáveis e o 'ended' lê o valor atual
  const faixaRef = useRef(null)
  const filaRef = useRef([])

  // ── Eventos do elemento → estado ──────────────────────────────────────────
  useEffect(() => {
    const onPlay = () => { setTocando(true); setErro(false) }
    const onPause = () => setTocando(false)
    const onWaiting = () => setCarregando(true)
    const onPronto = () => setCarregando(false)
    const onErro = () => { setCarregando(false); setTocando(false); setErro(true) }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('loadstart', onWaiting)
    audio.addEventListener('playing', onPronto)
    audio.addEventListener('canplay', onPronto)
    audio.addEventListener('error', onErro)
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('loadstart', onWaiting)
      audio.removeEventListener('playing', onPronto)
      audio.removeEventListener('canplay', onPronto)
      audio.removeEventListener('error', onErro)
    }
  }, [])

  // ── Ações ─────────────────────────────────────────────────────────────────
  const tocar = useCallback((faixa, novaFila, inicio = 0) => {
    if (!faixa?.audio_url) return

    const lista = novaFila?.length ? novaFila : [faixa]
    filaRef.current = lista
    setFila(lista)

    if (faixaRef.current?.id !== faixa.id) {
      faixaRef.current = faixa
      setFaixaAtual(faixa)
      setErro(false)
      audio.src = faixa.audio_url
    }

    if (inicio > 0) {
      // Antes dos metadados o seek pode ser ignorado; espera por eles
      if (audio.readyState >= 1) audio.currentTime = inicio
      else audio.addEventListener('loadedmetadata', () => { audio.currentTime = inicio }, { once: true })
    }

    audio.play().catch(() => {})
  }, [])

  const pausar = useCallback(() => audio.pause(), [])
  const retomar = useCallback(() => { audio.play().catch(() => {}) }, [])

  // Mesma faixa: play/pause. Outra faixa: troca e toca.
  const alternar = useCallback((faixa, novaFila) => {
    if (faixaRef.current?.id === faixa?.id) {
      if (audio.paused) retomar()
      else pausar()
    } else {
      tocar(faixa, novaFila)
    }
  }, [tocar, pausar, retomar])

  const buscar = useCallback((tempo) => {
    if (!Number.isFinite(tempo)) return
    audio.currentTime = Math.max(0, tempo)
  }, [])

  const proxima = useCallback(() => {
    const lista = filaRef.current
    if (lista.length < 2) return
    tocar(lista[(indiceNaFila(lista, faixaRef.current) + 1) % lista.length], lista)
  }, [tocar])

  const anterior = useCallback(() => {
    const lista = filaRef.current
    // Como em qualquer player: depois de 3s, "anterior" volta ao início da faixa
    if (audio.currentTime > 3 || lista.length < 2) {
      audio.currentTime = 0
      return
    }
    tocar(lista[(indiceNaFila(lista, faixaRef.current) - 1 + lista.length) % lista.length], lista)
  }, [tocar])

  const fechar = useCallback(() => {
    audio.pause()
    audio.removeAttribute('src')
    audio.load()
    faixaRef.current = null
    filaRef.current = []
    setFaixaAtual(null)
    setFila([])
    setTocando(false)
    setCarregando(false)
    setErro(false)
  }, [])

  const definirVolume = useCallback((v) => {
    audio.volume = v
    audio.muted = v === 0
    setVolume(v)
    setMudo(v === 0)
  }, [])

  const alternarMudo = useCallback(() => {
    audio.muted = !audio.muted
    setMudo(audio.muted)
  }, [])

  // Fim da faixa: segue a fila, mas para na última
  useEffect(() => {
    const onFim = () => {
      const lista = filaRef.current
      const i = indiceNaFila(lista, faixaRef.current)
      if (i >= 0 && i < lista.length - 1) tocar(lista[i + 1], lista)
    }
    audio.addEventListener('ended', onFim)
    return () => audio.removeEventListener('ended', onFim)
  }, [tocar])

  // ── Controles do sistema (tela de bloqueio, fones, teclado de mídia) ──────
  useEffect(() => {
    if (!('mediaSession' in navigator) || !faixaAtual) return
    try {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: faixaAtual.nome,
        artist: faixaAtual.artista || 'STU',
        album: faixaAtual.projetoNome || 'stu. música',
        artwork: faixaAtual.capa ? [{ src: faixaAtual.capa, sizes: '512x512' }] : [],
      })
      navigator.mediaSession.setActionHandler('play', retomar)
      navigator.mediaSession.setActionHandler('pause', pausar)
      navigator.mediaSession.setActionHandler('previoustrack', anterior)
      navigator.mediaSession.setActionHandler('nexttrack', fila.length > 1 ? proxima : null)
      navigator.mediaSession.setActionHandler('seekto', d => buscar(d.seekTime))
    } catch { /* navegador sem suporte parcial: segue sem */ }
  }, [faixaAtual, fila.length, retomar, pausar, anterior, proxima, buscar])

  const valor = useMemo(() => ({
    audio,
    faixaAtual,
    fila,
    tocando,
    carregando,
    erro,
    volume,
    mudo,
    tocar,
    alternar,
    pausar,
    retomar,
    buscar,
    proxima,
    anterior,
    fechar,
    definirVolume,
    alternarMudo,
  }), [faixaAtual, fila, tocando, carregando, erro, volume, mudo, tocar, alternar, pausar, retomar, buscar, proxima, anterior, fechar, definirVolume, alternarMudo])

  return <MusicPlayerContext.Provider value={valor}>{children}</MusicPlayerContext.Provider>
}

export const useMusicPlayer = () => useContext(MusicPlayerContext)

/*
 * Tempo e duração da faixa atual, lidos direto do <audio>. Enquanto toca,
 * atualiza por requestAnimationFrame (barra lisa); parado, só quando há seek.
 * `ativo = false` desliga a escuta — use nas linhas que não estão tocando.
 */
export function useProgresso(ativo = true) {
  const [tempo, setTempo] = useState(0)
  const [duracao, setDuracao] = useState(0)

  useEffect(() => {
    if (!ativo) return
    let raf = null

    const ler = () => {
      setTempo(audio.currentTime || 0)
      const d = audio.duration
      setDuracao(Number.isFinite(d) ? d : 0)
    }
    const loop = () => { ler(); raf = requestAnimationFrame(loop) }
    const onPlay = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop) }
    const onPause = () => { cancelAnimationFrame(raf); ler() }

    const eventos = ['seeked', 'loadedmetadata', 'durationchange', 'emptied']
    eventos.forEach(e => audio.addEventListener(e, ler))
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    if (audio.paused) ler()
    else onPlay()

    return () => {
      cancelAnimationFrame(raf)
      eventos.forEach(e => audio.removeEventListener(e, ler))
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [ativo])

  return ativo ? { tempo, duracao } : { tempo: 0, duracao: 0 }
}

export function formatarTempo(segundos) {
  if (!Number.isFinite(segundos) || segundos < 0) return '0:00'
  const m = Math.floor(segundos / 60)
  const s = Math.floor(segundos % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
