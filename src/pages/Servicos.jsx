import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useMusicPlayer } from '../contexts/MusicPlayerContext'
import { useProjetosMusicais } from '../hooks/useProjetosMusicais'
import { useTitulo } from '../hooks/useTitulo'
import { carregarDescricoesServicos } from '../lib/catalogo'
import { SERVICOS, SLUGS_BANCO, AUDIOBOOK_URL, mensagemOrcamento } from '../lib/servicos'
import { linkWhatsSTU } from '../lib/contato'
import Capa from '../components/Capa'
import Revelar from '../components/Revelar'
import CtaWhatsApp from '../components/CtaWhatsApp'
import { IconePlay, IconePause, IconeWhatsApp, IconeSeta } from '../components/Icones'

export default function Servicos() {
  useTitulo('Serviços', 'Produção musical, arranjo e trilhas sonoras. Conheça os serviços musicais da STU e peça um orçamento.')
  const { hash } = useLocation()
  const { projetos } = useProjetosMusicais()
  const [descricoes, setDescricoes] = useState({})

  // Até 3 exemplos por serviço, evitando repetir os que o serviço anterior já
  // mostrou (produção e arranjo têm quase os mesmos projetos). Se faltar
  // inédito, completa com repetidos.
  const exemplos = useMemo(() => {
    const usados = new Set()
    const porServico = {}
    for (const s of SERVICOS) {
      const candidatos = projetos.filter(s.exemplo)
      const ineditos = candidatos.filter(p => !usados.has(p.id))
      const escolhidos = [...ineditos, ...candidatos.filter(p => usados.has(p.id))].slice(0, 3)
      escolhidos.forEach(p => usados.add(p.id))
      porServico[s.slug] = escolhidos
    }
    return porServico
  }, [projetos])

  // Descrição curta editável no admin (cai no texto fixo se não houver)
  useEffect(() => {
    carregarDescricoesServicos(SLUGS_BANCO).then(setDescricoes).catch(() => {})
  }, [])

  // Chegou por /servicos#arranjo-musical: rola até o serviço
  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    const quadro = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(quadro)
  }, [hash])

  return (
    <>
      <section className="sv-cabeca">
        <div className="container">
          <Revelar>
            <span className="eyebrow">Serviços</span>
            <h1 className="titulo-display sv-titulo">
              Do jeito que <span className="acento">a música pede.</span>
            </h1>
            <p className="lead sv-lead">
              Cada projeto tem um tamanho. Às vezes é o disco inteiro, às vezes só o arranjo
              que faltava. Escolha por onde começar — o resto a gente conversa.
            </p>
          </Revelar>

          <Revelar como="nav" className="sv-indice" aria-label="Serviços" atraso={0.1}>
            {SERVICOS.map(s => (
              <a key={s.slug} href={`#${s.slug}`}>
                <span>{s.numero}</span>{s.nome}
              </a>
            ))}
          </Revelar>
        </div>
      </section>

      {SERVICOS.map(s => (
        <Servico
          key={s.slug}
          servico={s}
          descricaoBanco={s.slugsBanco.map(slug => descricoes[slug]).find(Boolean)}
          exemplos={exemplos[s.slug] || []}
        />
      ))}

      {/* Audiobook é atendido pelo site principal, não por aqui */}
      <section className="sv-fora">
        <div className="container">
          <Revelar>
            <a href={AUDIOBOOK_URL} target="_blank" rel="noopener noreferrer" className="sv-fora-link">
              <span>
                <span className="sv-fora-rotulo">Procurando audiobook?</span>
                <strong>Gravação e produção de audiobooks ficam com a STU Produções</strong>
              </span>
              <IconeSeta tamanho={20} />
            </a>
          </Revelar>
        </div>
      </section>

      <CtaWhatsApp
        eyebrow="Não sabe por onde começar?"
        titulo={<>Conta a ideia. <span className="acento">A gente monta o caminho.</span></>}
        texto="Muitos projetos misturam serviços — um single com arranjo, uma trilha com gravação de banda. Fala com a gente e o orçamento sai sob medida."
        mensagem="Olá! Vim pelo stu. música e quero ajuda para montar o orçamento do meu projeto."
      />

      <style>{`
        .sv-cabeca { padding: clamp(64px, 10vw, 120px) 0 24px; }
        .sv-titulo { margin-top: 24px; }
        .sv-lead { max-width: 600px; margin-top: 28px; }
        .sv-indice {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 64px;
          border-top: 1px solid var(--stu-cream-12);
        }
        .sv-indice a {
          display: flex;
          gap: 12px;
          align-items: baseline;
          padding: 20px 16px 20px 0;
          font-size: 16px;
          font-weight: 700;
          color: var(--stu-cream-70);
          transition: color var(--stu-dur-rapida);
        }
        .sv-indice a span { font-size: 11px; letter-spacing: 1.5px; color: var(--stu-orange); }
        .sv-indice a:hover { color: var(--stu-cream); }
        .sv-fora { padding: 8px 0 24px; }
        .sv-fora-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 28px 0;
          border-top: 1px solid var(--stu-cream-12);
          border-bottom: 1px solid var(--stu-cream-12);
          transition: color var(--stu-dur-media);
        }
        .sv-fora-link > span { display: flex; flex-direction: column; gap: 8px; }
        .sv-fora-rotulo {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--stu-orange);
        }
        .sv-fora-link strong { font-size: clamp(17px, 2vw, 22px); font-weight: 500; letter-spacing: -0.01em; }
        .sv-fora-link svg { flex-shrink: 0; transition: transform 0.5s var(--stu-ease); }
        .sv-fora-link:hover { color: var(--stu-orange); }
        .sv-fora-link:hover svg { transform: translateX(6px); }
        @media (max-width: 760px) {
          .sv-indice { grid-template-columns: minmax(0, 1fr); }
        }
      `}</style>
      <style>{CSS_SERVICO}</style>
    </>
  )
}

function Servico({ servico: s, descricaoBanco, exemplos }) {
  const { faixaAtual, tocando, alternar } = useMusicPlayer()
  const fila = useMemo(() => exemplos.map(p => p.faixas[0]), [exemplos])

  return (
    <section id={s.slug} className="sv secao">
      <div className="container sv-grade">
        <Revelar className="sv-lado">
          <span className="sv-numero">{s.numero}</span>
          <h2 className="titulo-secao">{s.nome}</h2>
          <p className="sv-chamada">{descricaoBanco || s.chamada}</p>
        </Revelar>

        <Revelar className="sv-conteudo" atraso={0.1}>
          <p className="sv-descricao">{s.descricao}</p>

          <div className="sv-colunas">
            <div>
              <h3 className="sv-subtitulo">Para quem é</h3>
              <ul className="sv-para-quem">
                {s.paraQuem.map(p => <li key={p}>{p}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="sv-subtitulo">O que entra</h3>
              <ul className="sv-entregas">
                {s.entregas.map(e => <li key={e} className="tag">{e}</li>)}
              </ul>
            </div>
          </div>

          {fila.length > 0 && (
            <div className="sv-exemplos">
              <h3 className="sv-subtitulo">Ouça um exemplo</h3>
              <ul>
                {fila.map(f => {
                  const ativa = faixaAtual?.id === f.id
                  return (
                    <li key={f.id}>
                      <button className={`sv-exemplo${ativa ? ' ativa' : ''}`} onClick={() => alternar(f, fila)}
                        aria-label={ativa && tocando ? `Pausar ${f.nome}` : `Tocar ${f.nome}`}>
                        <span className="sv-exemplo-capa">
                          <Capa src={f.capa} nome={f.projetoNome} largura={120} />
                          <span className="sv-exemplo-play">
                            {ativa && tocando ? <IconePause tamanho={12} /> : <IconePlay tamanho={12} />}
                          </span>
                        </span>
                        <span className="sv-exemplo-texto">
                          <strong>{f.nome}</strong>
                          <span>{f.artista}</span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          <a className="btn btn--primario sv-cta" href={linkWhatsSTU(mensagemOrcamento(s))} target="_blank" rel="noopener noreferrer">
            <IconeWhatsApp /> Pedir orçamento de {s.nome.toLowerCase()}
          </a>
        </Revelar>
      </div>
    </section>
  )
}

const CSS_SERVICO = `
        .sv { scroll-margin-top: 64px; border-top: 1px solid var(--stu-cream-06); }
        .sv-grade {
          display: grid;
          grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
          gap: clamp(32px, 6vw, 96px);
          align-items: start;
        }
        .sv-lado { position: sticky; top: 110px; }
        .sv-numero {
          display: block;
          font-size: clamp(56px, 8vw, 104px);
          font-weight: 200;
          font-style: italic;
          line-height: 0.9;
          color: var(--stu-orange);
          margin-bottom: 20px;
        }
        .sv-chamada { margin-top: 20px; font-size: 19px; font-style: italic; font-weight: 300; color: var(--stu-cream-70); max-width: 380px; }
        .sv-descricao { font-size: clamp(17px, 1.6vw, 20px); font-weight: 300; line-height: 1.7; color: var(--stu-cream); }
        .sv-colunas { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 40px; margin-top: 48px; }
        .sv-subtitulo {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--stu-orange);
          margin-bottom: 16px;
        }
        .sv-para-quem li {
          position: relative;
          padding: 10px 0 10px 22px;
          font-size: 15px;
          color: var(--stu-cream-70);
          border-bottom: 1px solid var(--stu-cream-06);
        }
        .sv-para-quem li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 10px;
          height: 1px;
          background: var(--stu-orange);
        }
        .sv-entregas { display: flex; flex-wrap: wrap; gap: 6px; }
        .sv-exemplos { margin-top: 48px; }
        .sv-exemplos ul { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
        .sv-exemplo { width: 100%; text-align: left; display: flex; flex-direction: column; gap: 10px; }
        .sv-exemplo-capa { position: relative; display: block; }
        .sv-exemplo-play {
          position: absolute;
          right: 8px;
          bottom: 8px;
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          background: var(--stu-orange);
          color: var(--stu-cream);
          transform: translateY(4px);
          opacity: 0;
          transition: opacity var(--stu-dur-media) var(--stu-ease), transform var(--stu-dur-media) var(--stu-ease);
        }
        .sv-exemplo:hover .sv-exemplo-play, .sv-exemplo:focus-visible .sv-exemplo-play, .sv-exemplo.ativa .sv-exemplo-play {
          opacity: 1;
          transform: none;
        }
        .sv-exemplo-texto { display: flex; flex-direction: column; min-width: 0; }
        .sv-exemplo-texto strong, .sv-exemplo-texto span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sv-exemplo-texto strong { font-size: 14px; font-weight: 700; }
        .sv-exemplo.ativa .sv-exemplo-texto strong { color: var(--stu-orange); }
        .sv-exemplo-texto span { font-size: 12px; font-style: italic; font-weight: 300; color: var(--stu-cream-50); }
        .sv-cta { margin-top: 48px; white-space: normal; text-align: center; }

        @media (hover: none) {
          .sv-exemplo-play { opacity: 1; transform: none; }
        }
        @media (max-width: 860px) {
          .sv-grade { grid-template-columns: minmax(0, 1fr); }
          .sv-lado { position: static; }
        }
        @media (max-width: 520px) {
          .sv-colunas { grid-template-columns: minmax(0, 1fr); gap: 32px; }
          .sv-cta { width: 100%; }
        }
`
