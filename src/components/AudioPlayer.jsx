import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { useMusicPlayer, useProgresso, formatarTempo } from '../contexts/MusicPlayerContext'
import { IconePlay, IconePause, Spinner } from './Icones'

/*
 * Player individual com waveform (wavesurfer.js).
 *
 * O wavesurfer aqui NÃO toca: ele recebe um <audio> mudo próprio só para
 * desenhar e posicionar a onda. Quem toca é o elemento único do
 * MusicPlayerContext; quando esta faixa é a atual, a onda espelha o tempo
 * dele a cada quadro. Clicar ou arrastar na onda manda o player global tocar
 * a partir daquele ponto.
 *
 * A onda só é criada quando o componente entra na tela (o wavesurfer baixa e
 * decodifica o arquivo inteiro), e os picos ficam em cache por URL: voltar a
 * uma página já visitada desenha a onda na hora, sem baixar de novo.
 *
 * Uma instância desenha UMA faixa: para trocar de faixa, troque o `key`.
 */

const cachePicos = new Map() // audio_url → { peaks, duration }

const CORES = {
  waveColor: 'rgba(232, 227, 220, 0.22)',
  progressColor: '#CF5E2C',
  cursorColor: 'rgba(232, 227, 220, 0.85)',
}

export default function AudioPlayer({ faixa, fila, altura = 64 }) {
  const player = useMusicPlayer()
  const { audio, faixaAtual, tocando, carregando, alternar, tocar, buscar, retomar } = player
  const ativa = faixaAtual?.id === faixa.id

  const caixaRef = useRef(null)
  const ondaRef = useRef(null)
  const wsRef = useRef(null)
  // Sem IntersectionObserver (navegador antigo), desenha logo de cara
  const [naTela, setNaTela] = useState(() => typeof IntersectionObserver === 'undefined')
  const [pronta, setPronta] = useState(false)
  const [falhou, setFalhou] = useState(false)
  const [duracao, setDuracao] = useState(() => cachePicos.get(faixa.audio_url)?.duration || 0)
  const { tempo } = useProgresso(ativa)

  // Ref para o handler de interação ler sempre o estado atual
  const interacaoRef = useRef(null)
  useEffect(() => {
    interacaoRef.current = (tempo) => {
      if (ativa) {
        buscar(tempo)
        if (audio.paused) retomar()
      } else {
        tocar(faixa, fila, tempo)
      }
    }
  })

  // ── Só cria a onda quando aparece na tela ─────────────────────────────────
  useEffect(() => {
    const el = caixaRef.current
    if (!el || naTela) return
    const io = new IntersectionObserver(([entrada]) => {
      if (entrada.isIntersecting) { setNaTela(true); io.disconnect() }
    }, { rootMargin: '200px' })
    io.observe(el)
    return () => io.disconnect()
  }, [naTela])

  // ── Cria o wavesurfer ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!naTela || !ondaRef.current || !faixa.audio_url) return

    const cache = cachePicos.get(faixa.audio_url)
    const espelho = document.createElement('audio')
    espelho.muted = true
    // Sem cache, o wavesurfer passa o blob baixado para este elemento e espera
    // os metadados dele — 'metadata' é local, não gera download extra. Com
    // cache, a duração já vem pronta e o elemento nem precisa carregar.
    espelho.preload = cache ? 'none' : 'metadata'

    const ws = WaveSurfer.create({
      container: ondaRef.current,
      ...CORES,
      height: altura,
      cursorWidth: 1,
      barWidth: 2,
      barGap: 2,
      barRadius: 0,
      normalize: true,
      dragToSeek: true,
      hideScrollbar: true,
      media: espelho,
      url: faixa.audio_url,
      peaks: cache?.peaks,
      duration: cache?.duration,
    })

    ws.on('ready', (d) => {
      setPronta(true)
      setDuracao(d)
      if (!cache) {
        try {
          cachePicos.set(faixa.audio_url, { peaks: ws.exportPeaks({ maxLength: 2000 }), duration: d })
        } catch { /* sem cache: a próxima visita baixa de novo */ }
      }
    })
    ws.on('interaction', (t) => interacaoRef.current?.(t))
    ws.on('error', () => setFalhou(true))

    wsRef.current = ws
    return () => {
      wsRef.current = null
      ws.destroy()
      espelho.removeAttribute('src')
    }
  }, [naTela, faixa.audio_url, altura])

  // ── Espelha o tempo do player global ──────────────────────────────────────
  useEffect(() => {
    const ws = wsRef.current
    if (!ws || !pronta) return

    if (!ativa) {
      ws.setTime(0)
      return
    }

    let raf = null
    const sincronizar = () => ws.setTime(audio.currentTime || 0)
    const loop = () => { sincronizar(); raf = requestAnimationFrame(loop) }
    const onPlay = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop) }
    const onPause = () => { cancelAnimationFrame(raf); sincronizar() }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('seeked', sincronizar)
    if (audio.paused) sincronizar()
    else onPlay()

    return () => {
      cancelAnimationFrame(raf)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('seeked', sincronizar)
    }
  }, [ativa, pronta, audio])

  const estaTocando = ativa && tocando
  const estaCarregando = ativa && carregando && tocando

  return (
    <div className="ap" ref={caixaRef}>
      <button
        type="button"
        className={`ap-play${estaTocando ? ' tocando' : ''}`}
        onClick={() => alternar(faixa, fila)}
        aria-label={estaTocando ? `Pausar ${faixa.nome}` : `Tocar ${faixa.nome}`}
      >
        {estaCarregando ? <Spinner /> : estaTocando ? <IconePause /> : <IconePlay />}
      </button>

      <div className="ap-onda-caixa">
        <div className="ap-onda-area" style={{ height: altura }}>
        {!pronta && (
          <div className="ap-esqueleto" aria-hidden="true">
            {falhou
              ? <span className="ap-aviso">Onda indisponível — o play continua funcionando</span>
              : Array.from({ length: 56 }).map((_, i) => (
                <span key={i} style={{ animationDelay: `${(i % 14) * 0.07}s` }} />
              ))}
          </div>
        )}
        <div
          ref={ondaRef}
          className="ap-onda"
          style={{ opacity: pronta ? 1 : 0 }}
          aria-label={`Waveform de ${faixa.nome}. Clique para tocar a partir de um ponto.`}
        />
        </div>
        <div className="ap-tempos">
          <span className={ativa ? 'atual' : ''}>{formatarTempo(ativa ? tempo : 0)}</span>
          <span>{duracao ? formatarTempo(duracao) : '—'}</span>
        </div>
      </div>

      <style>{`
        .ap {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          width: 100%;
        }
        .ap-play {
          width: 56px;
          height: 56px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          background: var(--stu-orange);
          color: var(--stu-cream);
          transition: background var(--stu-dur-media) var(--stu-ease), transform var(--stu-dur-rapida) var(--stu-ease);
        }
        .ap-play:hover { background: var(--stu-burnt); }
        .ap-play:active { transform: scale(0.94); }
        .ap-onda-caixa {
          flex: 1;
          min-width: 0;
          position: relative;
        }
        .ap-onda-area { position: relative; }
        .ap-onda {
          position: absolute;
          inset: 0;
          cursor: pointer;
          transition: opacity 0.6s var(--stu-ease);
        }
        .ap-esqueleto {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          gap: 2px;
          overflow: hidden;
        }
        .ap-esqueleto span {
          flex: 1;
          min-width: 2px;
          height: 18%;
          background: var(--stu-cream-12);
          animation: apPulso 1.1s ease-in-out infinite;
        }
        @keyframes apPulso {
          0%, 100% { height: 14%; }
          50% { height: 46%; }
        }
        .ap-aviso {
          font-size: 11px;
          letter-spacing: 1px;
          color: var(--stu-cream-50);
        }
        .ap-tempos {
          display: flex;
          justify-content: space-between;
          margin-top: 6px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: var(--stu-cream-30);
          font-variant-numeric: tabular-nums;
        }
        .ap-tempos .atual { color: var(--stu-orange); }
        @media (max-width: 520px) {
          .ap { gap: 12px; }
          .ap-play { width: 48px; height: 48px; }
        }
      `}</style>
    </div>
  )
}
