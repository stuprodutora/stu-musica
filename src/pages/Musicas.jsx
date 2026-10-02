import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMusicPlayer } from '../contexts/MusicPlayerContext'
import { useProjetosMusicais } from '../hooks/useProjetosMusicais'
import { useTitulo } from '../hooks/useTitulo'
import { TIPOS } from '../lib/catalogo'
import ProjetoMusical from '../components/ProjetoMusical'
import Revelar from '../components/Revelar'
import CtaWhatsApp from '../components/CtaWhatsApp'
import { IconePlay, IconePause } from '../components/Icones'

export default function Musicas() {
  useTitulo('Músicas', 'Singles, EPs, trilhas sonoras e audiobooks produzidos pela STU. Aperte o play.')
  const { projetos, carregando, erro } = useProjetosMusicais()
  const { faixaAtual, tocando, tocar, pausar, retomar } = useMusicPlayer()
  const [filtro, setFiltro] = useState('todos')

  // Só oferece os filtros que têm projeto
  const filtros = useMemo(() => {
    const presentes = new Set(projetos.map(p => p.tipo))
    return [
      { id: 'todos', rotulo: 'Tudo' },
      ...Object.entries(TIPOS)
        .filter(([id]) => presentes.has(id))
        .map(([id, rotulo]) => ({ id, rotulo })),
    ]
  }, [projetos])

  const lista = filtro === 'todos' ? projetos : projetos.filter(p => p.tipo === filtro)

  // "Ouvir tudo": a fila é o portfólio filtrado, faixa por faixa
  const filaCompleta = useMemo(() => lista.flatMap(p => p.faixas), [lista])
  const filaTocando = tocando && filaCompleta.some(f => f.id === faixaAtual?.id)
  const totalFaixas = filaCompleta.length

  const ouvirTudo = () => {
    if (filaCompleta.some(f => f.id === faixaAtual?.id)) {
      if (tocando) pausar()
      else retomar()
    } else if (filaCompleta[0]) {
      tocar(filaCompleta[0], filaCompleta)
    }
  }

  return (
    <>
      <section className="mus-cabeca">
        <div className="container">
          <Revelar>
            <span className="eyebrow">Portfólio</span>
            <h1 className="titulo-display mus-titulo">
              Músicas que <span className="acento">passaram por aqui.</span>
            </h1>
            <p className="lead mus-lead">
              Singles, EPs, trilhas e audiobooks — cada um com a sua história e o seu som.
              Escolha uma faixa e deixe tocando enquanto navega: o player segue com você.
            </p>
          </Revelar>

          {!carregando && !erro && projetos.length > 0 && (
            <Revelar className="mus-barra" atraso={0.1}>
              <div className="mus-filtros" role="tablist" aria-label="Filtrar por tipo">
                {filtros.map(f => (
                  <button
                    key={f.id}
                    role="tab"
                    aria-selected={filtro === f.id}
                    className={`mus-filtro${filtro === f.id ? ' ativo' : ''}`}
                    onClick={() => setFiltro(f.id)}
                  >
                    {f.rotulo}
                  </button>
                ))}
              </div>
              <button className="btn btn--contorno mus-tudo" onClick={ouvirTudo}>
                {filaTocando ? <IconePause tamanho={12} /> : <IconePlay tamanho={12} />}
                {filaTocando ? 'Pausar' : `Ouvir tudo · ${totalFaixas} faixas`}
              </button>
            </Revelar>
          )}
        </div>
      </section>

      <section className="mus-lista">
        <div className="container">
          {carregando && <Esqueleto />}

          {erro && (
            <p className="mus-aviso">
              Não conseguimos carregar o portfólio agora. Tente recarregar a página em instantes.
            </p>
          )}

          {!carregando && !erro && lista.length === 0 && (
            <p className="mus-aviso">Nenhuma produção publicada nesta categoria ainda.</p>
          )}

          <AnimatePresence mode="popLayout" initial={false}>
            {lista.map(p => (
              <motion.div
                key={p.id}
                className="mus-item"
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Revelar>
                  <ProjetoMusical projeto={p} />
                </Revelar>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <CtaWhatsApp
        eyebrow="A próxima pode ser a sua"
        titulo={<>Gostou do que ouviu? <span className="acento">Vamos produzir a sua.</span></>}
        mensagem="Olá! Ouvi as produções no stu. música e quero conversar sobre a minha música."
      />

      <style>{`
        .mus-cabeca { padding: clamp(64px, 10vw, 120px) 0 40px; }
        .mus-titulo { margin-top: 24px; max-width: 980px; }
        .mus-lead { max-width: 620px; margin-top: 28px; }
        .mus-barra {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: 56px;
          padding-top: 24px;
          border-top: 1px solid var(--stu-cream-12);
        }
        .mus-filtros { display: flex; flex-wrap: wrap; gap: 6px; }
        .mus-filtro {
          height: 40px;
          padding: 0 18px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--stu-cream-70);
          border: 1px solid var(--stu-cream-12);
          transition: all var(--stu-dur-rapida);
        }
        .mus-filtro:hover { color: var(--stu-cream); border-color: var(--stu-cream-30); }
        .mus-filtro.ativo { background: var(--stu-cream); color: var(--stu-black); border-color: var(--stu-cream); }
        .mus-tudo { min-height: 40px; padding: 0 18px; font-size: 11px; }

        .mus-lista { padding-bottom: 40px; }
        .mus-item { padding: clamp(56px, 8vw, 96px) 0; border-bottom: 1px solid var(--stu-cream-06); }
        .mus-item:last-child { border-bottom: none; }
        .mus-aviso { padding: 80px 0; color: var(--stu-cream-50); font-size: 17px; }

        .mus-esqueleto { display: grid; grid-template-columns: 5fr 7fr; gap: 72px; padding: 72px 0; }
        .mus-esqueleto > div, .mus-esqueleto span { background: var(--stu-cream-06); animation: brilhoMus 1.4s ease-in-out infinite; }
        .mus-esqueleto > div { aspect-ratio: 1; }
        .mus-esqueleto aside { display: flex; flex-direction: column; gap: 14px; }
        .mus-esqueleto span { height: 18px; }
        .mus-esqueleto span:nth-child(2) { height: 64px; width: 80%; }
        .mus-esqueleto span:nth-child(4) { height: 120px; margin-top: 24px; }
        @keyframes brilhoMus { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }

        @media (max-width: 860px) {
          .mus-esqueleto { grid-template-columns: minmax(0, 1fr); gap: 32px; }
          .mus-esqueleto > div { max-width: 420px; }
        }
        @media (max-width: 520px) {
          .mus-tudo { width: 100%; }
        }
      `}</style>
    </>
  )
}

function Esqueleto() {
  return (
    <div className="mus-esqueleto" aria-busy="true" aria-label="Carregando produções">
      <div />
      <aside><span style={{ width: '30%' }} /><span /><span style={{ width: '40%' }} /><span /></aside>
    </div>
  )
}
