import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useMusicPlayer } from '../contexts/MusicPlayerContext'
import { useProjetosMusicais } from '../hooks/useProjetosMusicais'
import { useTitulo } from '../hooks/useTitulo'
import { useAberturaSaindo } from '../hooks/useAberturaSaindo'
import { SERVICOS } from '../lib/servicos'
import { linkWhatsSTU } from '../lib/contato'
import AudioPlayer from '../components/AudioPlayer'
import Capa from '../components/Capa'
import Revelar from '../components/Revelar'
import CtaWhatsApp from '../components/CtaWhatsApp'
import { IconeSeta, IconeWhatsApp } from '../components/Icones'

const EASE = [0.22, 1, 0.36, 1]

const PROCESSO = [
  { titulo: 'Escuta', texto: 'Antes de qualquer botão, a conversa. O que a música é, de onde ela vem, onde ela quer chegar.' },
  { titulo: 'Pré-produção', texto: 'Tom, andamento, estrutura e referências. O mapa do som antes de gravar a primeira nota.' },
  { titulo: 'Arranjo e gravação', texto: 'Cada instrumento no lugar certo, cada take com intenção. Sem pressa e sem excesso.' },
  { titulo: 'Mix e master', texto: 'O acabamento que faz a faixa soar inteira — no fone, no carro e nas plataformas.' },
]

export default function Home() {
  useTitulo(null)

  return (
    <>
      <Hero />
      <Destaques />
      <Manifesto />
      <ServicosResumo />
      <Processo />
      <CtaWhatsApp />
    </>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────
function Hero() {
  const menosMovimento = useReducedMotion()
  const { scrollY } = useScroll()
  const deslocamento = useTransform(scrollY, [0, 600], [0, menosMovimento ? 0 : 120])
  const opacidade = useTransform(scrollY, [0, 500], [1, menosMovimento ? 1 : 0])
  // A entrada começa quando a abertura (index.html) abre o ponto e revela o site
  const pronto = useAberturaSaindo()
  const palavraOculta = menosMovimento ? { opacity: 0 } : { y: '110%' }
  const blocoOculto = { opacity: 0, y: menosMovimento ? 0 : 16 }

  const linhas = [
    [{ t: 'Do primeiro' }, { t: 'acorde' }],
    [{ t: 'à' }, { t: 'faixa finalizada.', acento: true }],
  ]

  return (
    <section className="hero">
      <motion.div className="container hero-interno" style={{ y: deslocamento, opacity: opacidade }}>
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0 }}
          animate={pronto ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Produção musical · Arranjo · Trilhas
        </motion.span>

        <h1 className="titulo-display hero-titulo">
          {linhas.map((linha, i) => (
            <span className="hero-linha" key={i}>
              {linha.map((p, j) => (
                // O espaço entre as máscaras é texto de verdade: quebra de linha
                // e espaçamento ficam com o navegador, como numa frase comum
                <span key={j}>{j > 0 && ' '}<span className="hero-mascara">
                  <motion.span
                    className={p.acento ? 'acento' : undefined}
                    initial={palavraOculta}
                    animate={pronto ? (menosMovimento ? { opacity: 1 } : { y: 0 }) : palavraOculta}
                    transition={{ duration: 1.1, delay: 0.35 + (i * 2 + j) * 0.12, ease: EASE }}
                  >
                    {p.t}
                  </motion.span>
                </span></span>
              ))}
            </span>
          ))}
        </h1>

        <motion.p
          className="lead hero-lead"
          initial={blocoOculto}
          animate={pronto ? { opacity: 1, y: 0 } : blocoOculto}
          transition={{ duration: 0.9, delay: 1, ease: EASE }}
        >
          Para artistas, bandas e compositores que querem ouvir a própria música
          soar do jeito que ela toca por dentro.
        </motion.p>

        <motion.div
          className="hero-acoes"
          initial={blocoOculto}
          animate={pronto ? { opacity: 1, y: 0 } : blocoOculto}
          transition={{ duration: 0.9, delay: 1.15, ease: EASE }}
        >
          <Link to="/musicas" className="btn btn--primario">
            Ouvir produções <IconeSeta />
          </Link>
          <a href={linkWhatsSTU()} target="_blank" rel="noopener noreferrer" className="btn btn--contorno">
            <IconeWhatsApp /> Começar um projeto
          </a>
        </motion.div>
      </motion.div>

      <OndaHero />

      <style>{`
        .hero {
          position: relative;
          min-height: calc(100svh - 76px);
          display: flex;
          align-items: center;
          padding: 64px 0 160px;
          overflow: hidden;
        }
        .hero-interno { position: relative; z-index: 1; }
        .hero-titulo { margin-top: 28px; }
        .hero-linha { display: block; }
        .hero-mascara {
          display: inline-block;
          overflow: hidden;
          vertical-align: top;
          /* folga para o itálico e os descendentes não serem cortados */
          padding: 0 0.08em 0.12em 0;
          margin: 0 -0.08em -0.12em 0;
        }
        .hero-mascara > span { display: inline-block; }
        .hero-lead { max-width: 520px; margin-top: 32px; }
        .hero-acoes { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 40px; }
        @media (max-width: 520px) {
          .hero { padding-bottom: 120px; }
          .hero-acoes .btn { flex: 1 1 100%; }
        }
      `}</style>
    </section>
  )
}

// Onda decorativa no pé do hero: respira devagar e ganha energia quando
// alguma faixa está tocando no player global.
function OndaHero() {
  const { tocando } = useMusicPlayer()
  const menosMovimento = useReducedMotion()
  const barras = useMemo(() => Array.from({ length: 96 }, (_, i) => {
    const x = i / 95
    const envelope = Math.pow(Math.sin(Math.PI * x), 1.4)
    const ruido = 0.35 + 0.65 * Math.abs(Math.sin(i * 12.9898) * 0.5 + Math.sin(i * 4.1) * 0.5)
    return Math.max(0.06, envelope * ruido)
  }), [])

  return (
    <div className={`onda-hero${tocando ? ' viva' : ''}${menosMovimento ? ' parada' : ''}`} aria-hidden="true">
      {barras.map((h, i) => (
        <span key={i} style={{ '--h': h, animationDelay: `${(i % 16) * -0.11}s` }} />
      ))}
      <style>{`
        .onda-hero {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 120px;
          display: flex;
          align-items: flex-end;
          gap: 3px;
          padding: 0 var(--gutter);
          opacity: 0.55;
          -webkit-mask-image: linear-gradient(to top, #000 0%, transparent 100%);
          mask-image: linear-gradient(to top, #000 0%, transparent 100%);
        }
        .onda-hero span {
          flex: 1;
          height: calc(var(--h) * 100%);
          background: linear-gradient(to top, var(--stu-orange), rgba(207, 94, 44, 0.1));
          transform-origin: bottom;
          animation: ondaRespira 3.2s ease-in-out infinite;
        }
        .onda-hero.viva span { animation-duration: 0.9s; }
        .onda-hero.parada span { animation: none; }
        @keyframes ondaRespira {
          0%, 100% { transform: scaleY(0.55); }
          50% { transform: scaleY(1); }
        }
        @media (max-width: 520px) {
          .onda-hero { height: 80px; gap: 2px; }
        }
      `}</style>
    </div>
  )
}

// ─── Destaques: preview das produções ──────────────────────────────────────
function Destaques() {
  const { projetos, carregando, erro } = useProjetosMusicais()
  const { faixaAtual, tocando, alternar } = useMusicPlayer()
  const [escolhidaId, setEscolhidaId] = useState(null)

  // Primeira faixa dos projetos em destaque; depois, música antes de trilha
  // (a home fala com artistas). O sort é estável: dentro de cada
  // grupo vale a prioridade do admin.
  const faixas = useMemo(() => {
    const peso = p => (p.destaque ? 0 : 2) + (p.tipo === 'musica' ? 0 : 1)
    const ordenados = [...projetos].sort((a, b) => peso(a) - peso(b))
    return ordenados.slice(0, 5).map(p => p.faixas[0])
  }, [projetos])

  if (erro) return null

  const tocandoAqui = faixas.find(f => f.id === faixaAtual?.id)
  const emFoco = tocandoAqui || faixas.find(f => f.id === escolhidaId) || faixas[0]

  return (
    <section className="secao dest">
      <div className="container">
        <Revelar className="dest-cabeca">
          <div>
            <span className="eyebrow">Em destaque</span>
            <h2 className="titulo-secao">Aperte o play.</h2>
          </div>
          <Link to="/musicas" className="dest-todas">
            Todas as produções <IconeSeta />
          </Link>
        </Revelar>

        {carregando ? (
          <div className="dest-carregando" aria-busy="true">
            <div className="dest-carregando-capa" />
            <div className="dest-carregando-lista">
              {Array.from({ length: 5 }).map((_, i) => <span key={i} />)}
            </div>
          </div>
        ) : emFoco && (
          <Revelar className="dest-grade" atraso={0.1}>
            <div className="dest-palco">
              <Capa src={emFoco.capa} nome={emFoco.projetoNome} className="dest-capa" />
              <div className="dest-palco-info">
                <span className="dest-artista">{emFoco.artista}</span>
                <h3 className="dest-nome">{emFoco.nome}</h3>
                <AudioPlayer key={emFoco.id} faixa={emFoco} fila={faixas} altura={56} />
              </div>
            </div>

            <ol className="dest-lista">
              {faixas.map((f, i) => {
                const ativa = faixaAtual?.id === f.id
                const foco = emFoco.id === f.id
                return (
                  <li key={f.id}>
                    <button
                      className={`dest-item${foco ? ' foco' : ''}`}
                      onClick={() => { setEscolhidaId(f.id); alternar(f, faixas) }}
                      aria-label={ativa && tocando ? `Pausar ${f.nome}` : `Tocar ${f.nome}`}
                    >
                      <span className="dest-num">
                        {ativa
                          ? <span className={`eq${tocando ? '' : ' pausado'}`}><span /><span /><span /></span>
                          : String(i + 1).padStart(2, '0')}
                      </span>
                      <Capa src={f.capa} nome={f.projetoNome} largura={120} className="dest-mini" />
                      <span className="dest-item-texto">
                        <strong>{f.nome}</strong>
                        <span>{f.artista}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </Revelar>
        )}
      </div>

      <style>{`
        .dest-cabeca {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 48px;
        }
        .dest-cabeca .titulo-secao { margin-top: 18px; }
        .dest-todas {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--stu-cream-70);
          white-space: nowrap;
          padding-bottom: 6px;
          border-bottom: 1px solid var(--stu-cream-30);
          transition: color var(--stu-dur-rapida), border-color var(--stu-dur-rapida);
        }
        .dest-todas:hover { color: var(--stu-orange); border-color: var(--stu-orange); }

        .dest-grade {
          display: grid;
          grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
          gap: clamp(24px, 4vw, 56px);
          align-items: start;
        }
        .dest-palco {
          display: grid;
          grid-template-columns: minmax(0, 220px) minmax(0, 1fr);
          gap: 28px;
          align-items: end;
          padding: clamp(18px, 3vw, 32px);
          background: var(--stu-painel);
          border: 1px solid var(--stu-cream-06);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .dest-palco-info { min-width: 0; }
        .dest-artista {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--stu-orange);
        }
        .dest-nome {
          margin: 8px 0 24px;
          font-size: clamp(26px, 3.4vw, 40px);
          font-weight: 800;
          line-height: 1.02;
          letter-spacing: -0.03em;
          word-break: break-word;
        }

        .dest-lista { border-top: 1px solid var(--stu-cream-06); }
        .dest-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 8px;
          text-align: left;
          border-bottom: 1px solid var(--stu-cream-06);
          transition: background var(--stu-dur-media) var(--stu-ease);
        }
        .dest-item:hover, .dest-item.foco { background: rgba(232, 227, 220, 0.04); }
        .dest-num {
          width: 22px;
          flex-shrink: 0;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: var(--stu-cream-30);
        }
        .dest-item.foco .dest-num { color: var(--stu-orange); }
        .dest-mini { width: 52px; flex-shrink: 0; }
        .dest-mini .capa-nome { font-size: 9px; }
        .dest-mini .capa-marca { display: none; }
        .dest-item-texto { min-width: 0; display: flex; flex-direction: column; }
        .dest-item-texto strong, .dest-item-texto span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dest-item-texto strong { font-size: 16px; font-weight: 700; }
        .dest-item-texto span { font-size: 13px; font-style: italic; font-weight: 300; color: var(--stu-cream-50); }

        .dest-carregando { display: grid; grid-template-columns: 7fr 5fr; gap: 56px; }
        .dest-carregando-capa { aspect-ratio: 2.2; background: var(--stu-cream-06); animation: brilho 1.4s ease-in-out infinite; }
        .dest-carregando-lista { display: flex; flex-direction: column; gap: 10px; }
        .dest-carregando-lista span { height: 64px; background: var(--stu-cream-06); animation: brilho 1.4s ease-in-out infinite; }
        @keyframes brilho { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }

        @media (max-width: 960px) {
          .dest-grade, .dest-carregando { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 600px) {
          .dest-cabeca { flex-direction: column; align-items: flex-start; }
          .dest-palco { grid-template-columns: minmax(0, 1fr); }
          .dest-capa { max-width: 240px; }
        }
      `}</style>
    </section>
  )
}

// ─── Manifesto ─────────────────────────────────────────────────────────────
function Manifesto() {
  return (
    <section className="secao manifesto">
      <div className="container container--texto">
        <Revelar>
          <p className="manifesto-texto">
            Toda música começa pequena. Um riff gravado no celular, uma letra no bloco
            de notas, uma melodia cantarolada no caminho de casa.{' '}
            <span className="acento">A gente cuida dela até ela ficar do tamanho que merece.</span>
          </p>
        </Revelar>
      </div>
      <style>{`
        .manifesto-texto {
          font-size: clamp(26px, 3.8vw, 46px);
          font-weight: 500;
          line-height: 1.22;
          letter-spacing: -0.02em;
          color: var(--stu-cream);
        }
      `}</style>
    </section>
  )
}

// ─── Serviços ──────────────────────────────────────────────────────────────
function ServicosResumo() {
  return (
    <section className="secao serv-resumo">
      <div className="container">
        <Revelar>
          <span className="eyebrow">O que a gente faz</span>
          <h2 className="titulo-secao serv-resumo-titulo">
            Um estúdio inteiro <span className="acento">a serviço da sua música.</span>
          </h2>
        </Revelar>

        <ul className="serv-resumo-lista">
          {SERVICOS.map((s, i) => (
            <Revelar como="li" key={s.slug} atraso={i * 0.06}>
              <Link to={`/servicos#${s.slug}`} className="serv-resumo-item">
                <span className="serv-resumo-num">{s.numero}</span>
                <span className="serv-resumo-nome">{s.nome}</span>
                <span className="serv-resumo-chamada">{s.chamada}</span>
                <span className="serv-resumo-seta"><IconeSeta tamanho={18} /></span>
              </Link>
            </Revelar>
          ))}
        </ul>
      </div>
      <style>{`
        .serv-resumo-titulo { margin-top: 18px; max-width: 780px; }
        .serv-resumo-lista { margin-top: 56px; border-top: 1px solid var(--stu-cream-12); }
        .serv-resumo-item {
          display: grid;
          grid-template-columns: 56px minmax(0, 1.1fr) minmax(0, 1.4fr) 40px;
          align-items: center;
          gap: 24px;
          padding: 32px 0;
          border-bottom: 1px solid var(--stu-cream-12);
          position: relative;
        }
        .serv-resumo-item::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 1px;
          background: var(--stu-orange);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.6s var(--stu-ease);
        }
        .serv-resumo-item:hover::before { transform: scaleX(1); }
        .serv-resumo-num { font-size: 12px; font-weight: 800; letter-spacing: 2px; color: var(--stu-orange); }
        .serv-resumo-nome {
          font-size: clamp(24px, 3vw, 38px);
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.05;
          transition: transform 0.5s var(--stu-ease), color var(--stu-dur-media);
        }
        .serv-resumo-item:hover .serv-resumo-nome { transform: translateX(8px); color: var(--stu-orange); }
        .serv-resumo-chamada { font-size: 16px; font-weight: 300; color: var(--stu-cream-70); }
        .serv-resumo-seta { color: var(--stu-cream-30); transition: color var(--stu-dur-media), transform 0.5s var(--stu-ease); }
        .serv-resumo-item:hover .serv-resumo-seta { color: var(--stu-orange); transform: translateX(4px); }
        @media (max-width: 760px) {
          .serv-resumo-item { grid-template-columns: 40px minmax(0, 1fr) 24px; gap: 8px 16px; padding: 24px 0; }
          .serv-resumo-chamada { grid-column: 2 / 3; font-size: 15px; }
          .serv-resumo-seta { grid-row: 1; grid-column: 3; }
        }
      `}</style>
    </section>
  )
}

// ─── Processo ──────────────────────────────────────────────────────────────
function Processo() {
  return (
    <section className="secao proc">
      <div className="container">
        <Revelar>
          <span className="eyebrow">Como funciona</span>
          <h2 className="titulo-secao proc-titulo">Do rascunho ao lançamento.</h2>
        </Revelar>
        <ol className="proc-lista">
          {PROCESSO.map((p, i) => (
            <Revelar como="li" key={p.titulo} atraso={i * 0.08} className="proc-item">
              <span className="proc-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </Revelar>
          ))}
        </ol>
      </div>
      <style>{`
        .proc-titulo { margin-top: 18px; }
        .proc-lista {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1px;
          margin-top: 56px;
          background: var(--stu-cream-06);
          border: 1px solid var(--stu-cream-06);
        }
        .proc-item {
          padding: 32px 28px 40px;
          background: rgba(6, 12, 30, 0.6);
        }
        .proc-num {
          display: block;
          font-size: 44px;
          font-weight: 200;
          font-style: italic;
          color: var(--stu-orange);
          line-height: 1;
        }
        .proc-item h3 { margin-top: 28px; font-size: 20px; font-weight: 800; letter-spacing: -0.01em; }
        .proc-item p { margin-top: 10px; font-size: 15px; font-weight: 300; color: var(--stu-cream-70); }
        @media (max-width: 960px) { .proc-lista { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 520px) { .proc-lista { grid-template-columns: minmax(0, 1fr); } }
      `}</style>
    </section>
  )
}
