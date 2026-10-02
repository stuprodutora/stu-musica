import { useState } from 'react'
import { useMusicPlayer, useProgresso } from '../contexts/MusicPlayerContext'
import { TIPOS } from '../lib/catalogo'
import AudioPlayer from './AudioPlayer'
import Capa from './Capa'
import { IconeSpotify } from './Icones'

const FAIXAS_VISIVEIS = 6

/*
 * Um projeto do portfólio: capa, ficha, waveform da faixa em foco e a
 * tracklist. Tocar qualquer faixa manda o projeto inteiro como fila para o
 * player global — "próxima" segue o disco.
 */
export default function ProjetoMusical({ projeto }) {
  const { faixaAtual, tocando, alternar } = useMusicPlayer()
  const { faixas } = projeto
  const [escolhidaId, setEscolhidaId] = useState(faixas[0].id)
  const [todas, setTodas] = useState(false)

  // A faixa em foco é a que está tocando (se for deste projeto) ou a escolhida
  const tocandoAqui = faixas.find(f => f.id === faixaAtual?.id)
  const emFoco = tocandoAqui || faixas.find(f => f.id === escolhidaId) || faixas[0]

  const ehPlaylist = faixas.length > 1
  const visiveis = todas ? faixas : faixas.slice(0, FAIXAS_VISIVEIS)
  const rotulo = projeto.formato || TIPOS[projeto.tipo]

  const tocarFaixa = (faixa) => {
    setEscolhidaId(faixa.id)
    alternar(faixa, faixas)
  }

  return (
    <article className={`pm${tocandoAqui && tocando ? ' pm--tocando' : ''}`}>
      <div className="pm-capa">
        <Capa src={projeto.capa} nome={projeto.nome} />
      </div>

      <div className="pm-corpo">
        <div className="pm-meta">
          <span className="eyebrow">{rotulo}</span>
          <span className="pm-contagem">{faixas.length} {faixas.length === 1 ? 'faixa' : 'faixas'}</span>
        </div>

        <h2 className="pm-nome">{projeto.nome}</h2>
        <p className="pm-artista">{projeto.artista}</p>

        {projeto.descricao && <p className="pm-descricao">{projeto.descricao}</p>}

        {projeto.servicos.length > 0 && (
          <ul className="pm-servicos" aria-label="Serviços realizados">
            {projeto.servicos.map(s => <li key={s.id} className="tag">{s.nome}</li>)}
          </ul>
        )}

        <div className="pm-player">
          {ehPlaylist && (
            <div className="pm-foco">
              <span>Em foco</span>
              <strong>{emFoco.nome}</strong>
            </div>
          )}
          <AudioPlayer key={emFoco.id} faixa={emFoco} fila={faixas} />
        </div>

        {ehPlaylist ? (
          <>
            <ol className="pm-faixas">
              {visiveis.map((f, i) => (
                <LinhaFaixa
                  key={f.id}
                  faixa={f}
                  numero={i + 1}
                  ativa={faixaAtual?.id === f.id}
                  tocando={faixaAtual?.id === f.id && tocando}
                  onTocar={() => tocarFaixa(f)}
                />
              ))}
            </ol>
            {faixas.length > FAIXAS_VISIVEIS && (
              <button className="pm-mais" onClick={() => setTodas(t => !t)}>
                {todas ? 'Mostrar menos' : `Ver todas as ${faixas.length} faixas`}
              </button>
            )}
          </>
        ) : emFoco.spotify_url && (
          <a className="pm-spotify" href={emFoco.spotify_url} target="_blank" rel="noopener noreferrer">
            <IconeSpotify tamanho={14} /> Ouvir no Spotify
          </a>
        )}
      </div>

      <style>{CSS}</style>
    </article>
  )
}

function LinhaFaixa({ faixa, numero, ativa, tocando, onTocar }) {
  const { tempo, duracao } = useProgresso(ativa)
  const progresso = ativa && duracao > 0 ? (tempo / duracao) * 100 : 0

  return (
    <li className={`pm-faixa${ativa ? ' ativa' : ''}`}>
      <button className="pm-faixa-botao" onClick={onTocar} aria-label={tocando ? `Pausar ${faixa.nome}` : `Tocar ${faixa.nome}`}>
        <span className="pm-faixa-num">
          {ativa
            ? <span className={`eq${tocando ? '' : ' pausado'}`} aria-hidden="true"><span /><span /><span /></span>
            : String(numero).padStart(2, '0')}
        </span>
        <span className="pm-faixa-nome">{faixa.nome}</span>
      </button>
      {faixa.spotify_url && (
        <a className="pm-faixa-spotify" href={faixa.spotify_url} target="_blank" rel="noopener noreferrer"
          aria-label={`${faixa.nome} no Spotify`}>
          <IconeSpotify tamanho={15} />
        </a>
      )}
      <span className="pm-faixa-progresso" style={{ width: `${progresso}%` }} aria-hidden="true" />
    </li>
  )
}

const CSS = `
  .pm {
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: clamp(28px, 5vw, 72px);
    align-items: start;
  }
  .pm-capa { position: sticky; top: 100px; }
  .pm-capa .capa { box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.7); }
  .pm--tocando .pm-capa .capa { box-shadow: 0 40px 90px -30px rgba(207, 94, 44, 0.45); }
  .pm-capa .capa, .pm--tocando .pm-capa .capa { transition: box-shadow 1s var(--stu-ease); }

  .pm-meta { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .pm-contagem {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--stu-cream-30);
  }
  .pm-nome {
    margin-top: 18px;
    font-size: clamp(34px, 5vw, 64px);
    font-weight: 800;
    line-height: 0.98;
    letter-spacing: -0.035em;
    word-break: break-word;
  }
  .pm-artista {
    margin-top: 10px;
    font-size: clamp(18px, 2vw, 22px);
    font-style: italic;
    font-weight: 300;
    color: var(--stu-orange);
  }
  .pm-descricao {
    margin-top: 20px;
    max-width: 560px;
    font-size: 15px;
    font-weight: 300;
    color: var(--stu-cream-70);
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .pm-servicos { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 22px; }

  .pm-player {
    margin-top: 32px;
    padding: 22px;
    background: var(--stu-painel);
    border: 1px solid var(--stu-cream-06);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }
  .pm-foco {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 14px;
    min-width: 0;
  }
  .pm-foco span {
    flex-shrink: 0;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--stu-orange);
  }
  .pm-foco strong {
    font-size: 15px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pm-faixas { margin-top: 8px; }
  .pm-faixa {
    position: relative;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--stu-cream-06);
  }
  .pm-faixa-botao {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 15px 4px;
    text-align: left;
  }
  .pm-faixa-num {
    width: 24px;
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.5px;
    color: var(--stu-cream-30);
    font-variant-numeric: tabular-nums;
    transition: color var(--stu-dur-rapida);
  }
  .pm-faixa-nome {
    font-size: 16px;
    font-weight: 500;
    color: var(--stu-cream-70);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color var(--stu-dur-rapida);
  }
  .pm-faixa-botao:hover .pm-faixa-num { color: var(--stu-orange); }
  .pm-faixa-botao:hover .pm-faixa-nome, .pm-faixa.ativa .pm-faixa-nome { color: var(--stu-cream); }
  .pm-faixa.ativa .pm-faixa-nome { font-weight: 700; }
  .pm-faixa-spotify {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    color: var(--stu-cream-30);
    transition: color var(--stu-dur-rapida);
  }
  .pm-faixa-spotify:hover { color: #1DB954; }
  .pm-faixa-progresso {
    position: absolute;
    left: 0;
    bottom: -1px;
    height: 1px;
    background: var(--stu-orange);
    pointer-events: none;
  }
  .pm-mais, .pm-spotify {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--stu-cream-70);
    border-bottom: 1px solid var(--stu-cream-30);
    padding-bottom: 4px;
    transition: color var(--stu-dur-rapida), border-color var(--stu-dur-rapida);
  }
  .pm-mais:hover { color: var(--stu-orange); border-color: var(--stu-orange); }
  .pm-spotify:hover { color: #1DB954; border-color: #1DB954; }

  @media (max-width: 860px) {
    .pm { grid-template-columns: minmax(0, 1fr); }
    .pm-capa { position: static; max-width: 420px; }
  }
  @media (max-width: 520px) {
    .pm-player { padding: 16px; margin-left: calc(var(--gutter) * -0.5); margin-right: calc(var(--gutter) * -0.5); }
    .pm-faixa-botao { gap: 12px; }
  }
`
