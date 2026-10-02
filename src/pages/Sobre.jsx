import { useMemo } from 'react'
import { useProjetosMusicais } from '../hooks/useProjetosMusicais'
import { useTitulo } from '../hooks/useTitulo'
import { SITE_PRINCIPAL } from '../lib/contato'
import Revelar from '../components/Revelar'
import CtaWhatsApp from '../components/CtaWhatsApp'
import { IconeSeta } from '../components/Icones'

const PRINCIPIOS = [
  {
    titulo: 'Escuta antes de técnica',
    texto: 'Equipamento ajuda, mas o que define o som é entender a música. Por isso todo projeto começa numa conversa, não num preset.',
  },
  {
    titulo: 'A música continua sua',
    texto: 'A gente propõe, testa, discute — mas a última palavra é de quem escreveu. O objetivo é soar como você, só que inteiro.',
  },
  {
    titulo: 'Acabamento de verdade',
    texto: 'A faixa só sai daqui pronta para tocar em qualquer lugar: fone, carro, caixinha de som e plataformas de streaming.',
  },
]

// Nomes que são do próprio portfólio da STU, não de artistas atendidos
const NAO_ARTISTAS = ['stu', 'portfólio', 'portfolio']

export default function Sobre() {
  useTitulo('Sobre', 'O lado musical da STU Produções: produção, arranjo e trilhas sonoras com escuta e acabamento de verdade.')
  const { projetos, carregando } = useProjetosMusicais()

  const numeros = useMemo(() => {
    const artistas = new Set()
    for (const p of projetos) {
      // "Felipe Mattoss · Pietra Keiber" conta como dois artistas
      p.artista.split(/\s*[·&,]\s*/).forEach(a => {
        if (a && !NAO_ARTISTAS.includes(a.toLowerCase())) artistas.add(a)
      })
    }
    return {
      projetos: projetos.length,
      faixas: projetos.reduce((n, p) => n + p.faixas.length, 0),
      artistas: [...artistas],
    }
  }, [projetos])

  return (
    <>
      <section className="sb-cabeca">
        <div className="container">
          <Revelar>
            <span className="eyebrow">Sobre</span>
            <h1 className="titulo-display sb-titulo">
              Um estúdio que <span className="acento">escuta primeiro.</span>
            </h1>
          </Revelar>
        </div>
      </section>

      <section className="sb-texto">
        <div className="container sb-grade">
          <Revelar className="sb-coluna-lead">
            <p className="sb-destaque">
              A STU faz som e imagem para marcas. Mas a música sempre esteve no centro
              de tudo — e agora ganhou uma casa própria.
            </p>
          </Revelar>
          <Revelar className="sb-coluna" atraso={0.1}>
            <p>
              O <strong>stu. música</strong> é o lado autoral da STU Produções: o espaço onde a gente
              produz, arranja e finaliza música para artistas, bandas e compositores, e compõe
              trilhas para quem conta histórias com imagem.
            </p>
            <p>
              O jeito de trabalhar é próximo. Cada projeto passa pelas mesmas mãos do primeiro
              rascunho à master final, sem linha de montagem. A gente gosta de entender a pessoa
              por trás da música — porque é dali que vem o som certo.
            </p>
            <p>
              Do pop ao acústico, da canção ao documentário, o que une tudo é o cuidado: com a
              ideia original, com o tempo de cada faixa e com o que fica quando a música termina.
            </p>
          </Revelar>
        </div>
      </section>

      {!carregando && numeros.projetos > 0 && (
        <section className="sb-numeros">
          <div className="container">
            <dl className="sb-numeros-grade">
              <Revelar><dt>Produções no portfólio</dt><dd>{numeros.projetos}</dd></Revelar>
              <Revelar atraso={0.08}><dt>Faixas para ouvir</dt><dd>{numeros.faixas}</dd></Revelar>
              <Revelar atraso={0.16}><dt>Artistas e parceiros</dt><dd>{numeros.artistas.length}</dd></Revelar>
            </dl>
          </div>
        </section>
      )}

      <section className="secao sb-principios">
        <div className="container">
          <Revelar>
            <span className="eyebrow">No que a gente acredita</span>
          </Revelar>
          <ol className="sb-principios-lista">
            {PRINCIPIOS.map((p, i) => (
              <Revelar como="li" key={p.titulo} atraso={i * 0.08}>
                <span className="sb-principio-num">{String(i + 1).padStart(2, '0')}</span>
                <h2>{p.titulo}</h2>
                <p>{p.texto}</p>
              </Revelar>
            ))}
          </ol>
        </div>
      </section>

      {numeros.artistas.length > 0 && (
        <section className="secao sb-artistas">
          <div className="container">
            <Revelar>
              <span className="eyebrow">Quem já passou por aqui</span>
              <p className="sb-artistas-lista">
                {numeros.artistas.map((a, i) => (
                  <span key={a}>
                    {a}
                    {i < numeros.artistas.length - 1 && <span className="sb-sep" aria-hidden="true"> / </span>}
                  </span>
                ))}
              </p>
            </Revelar>
          </div>
        </section>
      )}

      <section className="sb-irma">
        <div className="container">
          <Revelar>
            <a href={SITE_PRINCIPAL} target="_blank" rel="noopener noreferrer" className="sb-irma-link">
              <span>
                <span className="eyebrow">STU Produções</span>
                <strong>Precisa de áudio ou vídeo para uma marca?</strong>
              </span>
              <IconeSeta tamanho={22} />
            </a>
          </Revelar>
        </div>
      </section>

      <CtaWhatsApp />

      <style>{`
        .sb-cabeca { padding: clamp(64px, 10vw, 120px) 0 clamp(40px, 6vw, 72px); }
        .sb-titulo { margin-top: 24px; max-width: 980px; }

        .sb-grade {
          display: grid;
          grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
          gap: clamp(32px, 6vw, 96px);
        }
        .sb-destaque {
          font-size: clamp(22px, 2.6vw, 30px);
          font-weight: 500;
          line-height: 1.3;
          letter-spacing: -0.015em;
        }
        .sb-coluna p {
          font-size: 18px;
          font-weight: 300;
          line-height: 1.75;
          color: var(--stu-cream-70);
        }
        .sb-coluna p + p { margin-top: 1.2em; }
        .sb-coluna strong { color: var(--stu-cream); font-weight: 700; }

        .sb-numeros { padding: clamp(72px, 10vw, 120px) 0 0; }
        .sb-numeros-grade {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          border-top: 1px solid var(--stu-cream-12);
        }
        .sb-numeros-grade > div { padding: 28px 24px 0 0; display: flex; flex-direction: column-reverse; gap: 8px; }
        .sb-numeros-grade dd {
          font-size: clamp(56px, 9vw, 120px);
          font-weight: 200;
          font-style: italic;
          line-height: 1;
          color: var(--stu-orange);
        }
        .sb-numeros-grade dt {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--stu-cream-50);
        }

        .sb-principios-lista {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(24px, 4vw, 56px);
          margin-top: 48px;
        }
        .sb-principio-num { font-size: 12px; font-weight: 800; letter-spacing: 2px; color: var(--stu-orange); }
        .sb-principios-lista h2 {
          margin-top: 16px;
          font-size: clamp(24px, 2.6vw, 32px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .sb-principios-lista p { margin-top: 14px; font-size: 16px; font-weight: 300; color: var(--stu-cream-70); }

        .sb-artistas-lista {
          margin-top: 32px;
          font-size: clamp(26px, 4.4vw, 56px);
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.03em;
        }
        .sb-sep { color: var(--stu-orange); font-weight: 200; }

        .sb-irma-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 40px 0;
          border-top: 1px solid var(--stu-cream-12);
          border-bottom: 1px solid var(--stu-cream-12);
          transition: color var(--stu-dur-media);
        }
        .sb-irma-link > span { display: flex; flex-direction: column; gap: 14px; }
        .sb-irma-link strong { font-size: clamp(22px, 3vw, 34px); font-weight: 700; letter-spacing: -0.02em; line-height: 1.15; }
        .sb-irma-link svg { flex-shrink: 0; transition: transform 0.5s var(--stu-ease); }
        .sb-irma-link:hover { color: var(--stu-orange); }
        .sb-irma-link:hover svg { transform: translateX(8px); }

        @media (max-width: 860px) {
          .sb-grade, .sb-principios-lista { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 520px) {
          .sb-numeros-grade { grid-template-columns: minmax(0, 1fr); }
          .sb-numeros-grade > div { padding: 24px 0; border-bottom: 1px solid var(--stu-cream-06); }
        }
      `}</style>
    </>
  )
}
