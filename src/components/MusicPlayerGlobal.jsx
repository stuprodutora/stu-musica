import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useMusicPlayer, useProgresso, formatarTempo } from '../contexts/MusicPlayerContext'
import { imagemOtimizada, LARGURAS } from '../lib/imagem'
import {
  IconePlay, IconePause, IconeAnterior, IconeProxima, IconeFechar,
  IconeSpotify, IconeVolume, IconeNota, Spinner,
} from './Icones'

/*
 * Player fixo no rodapé, estilo Spotify. Aparece quando alguma faixa toca e
 * persiste entre páginas (fica fora das <Routes> no App).
 *
 * Enquanto está aberto, publica a própria altura em --player-h no <html>: o
 * #root ganha esse padding no fim e o rodapé do site nunca fica escondido.
 */

const ALTURA = { desktop: 84, mobile: 68 }

export default function MusicPlayerGlobal() {
  const { faixaAtual } = useMusicPlayer()
  const menosMovimento = useReducedMotion()

  useEffect(() => {
    const raiz = document.documentElement
    if (!faixaAtual) {
      raiz.style.setProperty('--player-h', '0px')
      return
    }
    const atualizar = () => {
      const h = window.matchMedia('(max-width: 768px)').matches ? ALTURA.mobile : ALTURA.desktop
      raiz.style.setProperty('--player-h', `${h}px`)
    }
    atualizar()
    window.addEventListener('resize', atualizar)
    return () => window.removeEventListener('resize', atualizar)
  }, [faixaAtual])

  return (
    <AnimatePresence>
      {faixaAtual && (
        <motion.div
          key="player"
          className="mpg"
          role="region"
          aria-label="Player de música"
          initial={menosMovimento ? { opacity: 0 } : { y: '100%' }}
          animate={menosMovimento ? { opacity: 1 } : { y: 0 }}
          exit={menosMovimento ? { opacity: 0 } : { y: '100%' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* A faixa vai por prop: na animação de saída o AnimatePresence
              mantém a última renderização, quando o contexto já está vazio */}
          <Conteudo faixa={faixaAtual} />
          <style>{CSS}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Conteudo({ faixa: faixaAtual }) {
  const {
    fila, tocando, carregando, erro, volume, mudo,
    pausar, retomar, proxima, anterior, buscar, fechar, definirVolume, alternarMudo,
  } = useMusicPlayer()
  const { tempo, duracao } = useProgresso()
  const barraRef = useRef(null)
  const [arrastando, setArrastando] = useState(null) // tempo durante o arraste

  const temFila = fila.length > 1
  const tempoExibido = arrastando ?? tempo
  const progresso = duracao > 0 ? Math.min(100, (tempoExibido / duracao) * 100) : 0

  // ── Barra de progresso: clique e arraste ──────────────────────────────────
  const tempoNoPonto = (clientX) => {
    const r = barraRef.current.getBoundingClientRect()
    return Math.min(Math.max((clientX - r.left) / r.width, 0), 1) * duracao
  }

  const onPointerDown = (e) => {
    if (!duracao) return
    e.preventDefault()
    setArrastando(tempoNoPonto(e.clientX))
    const mover = (ev) => setArrastando(tempoNoPonto(ev.clientX))
    const soltar = (ev) => {
      buscar(tempoNoPonto(ev.clientX))
      setArrastando(null)
      window.removeEventListener('pointermove', mover)
      window.removeEventListener('pointerup', soltar)
    }
    window.addEventListener('pointermove', mover)
    window.addEventListener('pointerup', soltar)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') buscar(Math.min(duracao, tempo + 5))
    if (e.key === 'ArrowLeft') buscar(Math.max(0, tempo - 5))
  }

  return (
    <div className="mpg-interno">
      {/* Esquerda: capa + faixa */}
      <div className="mpg-faixa">
        {faixaAtual.capa ? (
          <img
            className="mpg-capa"
            src={imagemOtimizada(faixaAtual.capa, LARGURAS.miniatura, { altura: LARGURAS.miniatura })}
            alt=""
          />
        ) : (
          <div className="mpg-capa mpg-capa--vazia"><IconeNota /></div>
        )}
        <div className="mpg-info">
          <div className="mpg-nome">{faixaAtual.nome}</div>
          <div className="mpg-artista">
            {erro ? 'Não foi possível carregar a faixa' : faixaAtual.artista}
          </div>
        </div>
      </div>

      {/* Centro: controles + progresso */}
      <div className="mpg-centro">
        <div className="mpg-controles">
          <button className="mpg-ctrl mpg-pular" onClick={anterior} aria-label="Faixa anterior">
            <IconeAnterior />
          </button>
          <button className="mpg-play" onClick={tocando ? pausar : retomar} aria-label={tocando ? 'Pausar' : 'Tocar'}>
            {carregando && tocando ? <Spinner /> : tocando ? <IconePause tamanho={14} /> : <IconePlay tamanho={14} />}
          </button>
          <button className="mpg-ctrl mpg-pular" onClick={proxima} disabled={!temFila} aria-label="Próxima faixa">
            <IconeProxima />
          </button>
        </div>

        <div className="mpg-progresso">
          <span className="mpg-tempo mpg-tempo--atual">{formatarTempo(tempoExibido)}</span>
          <div
            className={`mpg-barra${arrastando !== null ? ' arrastando' : ''}`}
            ref={barraRef}
            onPointerDown={onPointerDown}
            onKeyDown={onKeyDown}
            role="slider"
            tabIndex={0}
            aria-label="Posição na faixa"
            aria-valuemin={0}
            aria-valuemax={Math.round(duracao)}
            aria-valuenow={Math.round(tempoExibido)}
            aria-valuetext={`${formatarTempo(tempoExibido)} de ${formatarTempo(duracao)}`}
          >
            <div className="mpg-trilho">
              <div className="mpg-preenchido" style={{ width: `${progresso}%` }} />
            </div>
          </div>
          <span className="mpg-tempo">{formatarTempo(duracao)}</span>
        </div>
      </div>

      {/* Direita: volume, spotify, fechar */}
      <div className="mpg-direita">
        <div className="mpg-volume">
          <button className="mpg-ctrl" onClick={alternarMudo} aria-label={mudo ? 'Ativar som' : 'Silenciar'}>
            <IconeVolume mudo={mudo || volume === 0} />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={mudo ? 0 : volume}
            onChange={e => definirVolume(Number(e.target.value))}
            aria-label="Volume"
            style={{ '--vol': `${(mudo ? 0 : volume) * 100}%` }}
          />
        </div>
        {faixaAtual.spotify_url && (
          <a className="mpg-spotify" href={faixaAtual.spotify_url} target="_blank" rel="noopener noreferrer"
            aria-label="Ouvir no Spotify">
            <IconeSpotify tamanho={14} />
            <span>Spotify</span>
          </a>
        )}
        <button className="mpg-ctrl" onClick={fechar} aria-label="Fechar player">
          <IconeFechar tamanho={12} />
        </button>
      </div>
    </div>
  )
}

const CSS = `
  .mpg {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 900;
    height: ${ALTURA.desktop}px;
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing: content-box;
    background: rgba(6, 12, 30, 0.94);
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
    border-top: 1px solid rgba(207, 94, 44, 0.35);
  }
  .mpg-interno {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr) minmax(0, 1fr);
    align-items: center;
    gap: 24px;
    max-width: calc(var(--largura) + var(--gutter) * 2);
    height: 100%;
    margin: 0 auto;
    padding: 0 var(--gutter);
  }

  /* Faixa */
  .mpg-faixa { display: flex; align-items: center; gap: 14px; min-width: 0; }
  .mpg-capa {
    width: 56px;
    height: 56px;
    flex-shrink: 0;
    object-fit: cover;
    background: var(--stu-navy);
  }
  .mpg-capa--vazia { display: grid; place-items: center; color: var(--stu-orange); }
  .mpg-info { min-width: 0; }
  .mpg-nome, .mpg-artista {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .mpg-nome { font-size: 15px; font-weight: 700; line-height: 1.3; }
  .mpg-artista {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    color: var(--stu-orange);
  }

  /* Controles */
  .mpg-centro { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 0; }
  .mpg-controles { display: flex; align-items: center; gap: 18px; }
  .mpg-ctrl {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    color: var(--stu-cream-50);
    transition: color var(--stu-dur-rapida);
  }
  .mpg-ctrl:hover:not(:disabled) { color: var(--stu-cream); }
  .mpg-ctrl:disabled { opacity: 0.25; cursor: default; }
  .mpg-play {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    background: var(--stu-orange);
    color: var(--stu-cream);
    transition: background var(--stu-dur-rapida), transform var(--stu-dur-rapida);
  }
  .mpg-play:hover { background: var(--stu-burnt); }
  .mpg-play:active { transform: scale(0.92); }

  /* Progresso */
  .mpg-progresso { display: flex; align-items: center; gap: 10px; width: 100%; max-width: 520px; }
  .mpg-tempo {
    min-width: 34px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    color: var(--stu-cream-30);
    font-variant-numeric: tabular-nums;
    user-select: none;
  }
  .mpg-tempo--atual { color: var(--stu-orange); text-align: right; }
  .mpg-barra {
    flex: 1;
    height: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    touch-action: none;
  }
  .mpg-trilho {
    position: relative;
    width: 100%;
    height: 3px;
    background: var(--stu-cream-12);
    transition: height var(--stu-dur-rapida);
  }
  .mpg-barra:hover .mpg-trilho, .mpg-barra.arrastando .mpg-trilho { height: 5px; }
  .mpg-preenchido { position: absolute; inset: 0 auto 0 0; background: var(--stu-orange); }

  /* Direita */
  .mpg-direita { display: flex; align-items: center; justify-content: flex-end; gap: 10px; }
  .mpg-volume { display: flex; align-items: center; gap: 4px; }
  .mpg-volume input {
    -webkit-appearance: none;
    appearance: none;
    width: 84px;
    height: 3px;
    background: linear-gradient(to right, var(--stu-cream-70) var(--vol), var(--stu-cream-12) var(--vol));
    cursor: pointer;
  }
  .mpg-volume input::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 10px;
    height: 10px;
    background: var(--stu-cream);
  }
  .mpg-volume input::-moz-range-thumb {
    width: 10px;
    height: 10px;
    border: none;
    border-radius: 0;
    background: var(--stu-cream);
  }
  .mpg-spotify {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 32px;
    padding: 0 12px;
    border: 1px solid var(--stu-cream-12);
    color: var(--stu-cream-70);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: color var(--stu-dur-rapida), border-color var(--stu-dur-rapida);
  }
  .mpg-spotify:hover { color: #1DB954; border-color: #1DB954; }

  @media (max-width: 1024px) {
    .mpg-volume { display: none; }
  }

  /* Mobile: a barra vira uma linha no topo do player */
  @media (max-width: 768px) {
    .mpg { height: ${ALTURA.mobile}px; }
    .mpg-interno {
      grid-template-columns: minmax(0, 1fr) auto auto;
      gap: 8px;
      padding: 0 12px 0 0;
    }
    .mpg-capa { width: ${ALTURA.mobile}px; height: ${ALTURA.mobile}px; }
    .mpg-nome { font-size: 14px; }
    .mpg-progresso {
      position: absolute;
      top: -8px;
      left: 0;
      right: 0;
      max-width: none;
      gap: 0;
    }
    .mpg-tempo { display: none; }
    .mpg-trilho, .mpg-barra:hover .mpg-trilho { height: 3px; }
    .mpg-controles { gap: 4px; }
    .mpg-pular { display: none; }
    .mpg-spotify span { display: none; }
    .mpg-spotify { width: 32px; padding: 0; justify-content: center; border: none; }
    .mpg-direita { gap: 2px; }
  }
`
