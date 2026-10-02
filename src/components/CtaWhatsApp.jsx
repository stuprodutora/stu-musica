import Revelar from './Revelar'
import { linkWhatsSTU } from '../lib/contato'
import { IconeWhatsApp } from './Icones'

// Chamada final das páginas: um convite direto para o WhatsApp
export default function CtaWhatsApp({
  eyebrow = 'Vamos fazer juntos',
  titulo = <>Sua próxima música <span className="acento">começa numa conversa.</span></>,
  texto = 'Manda a demo, a ideia, a referência ou só o que você está sentindo. A gente escuta e responde com um caminho.',
  mensagem,
  botao = 'Chamar no WhatsApp',
}) {
  return (
    <section className="secao cta">
      <div className="container container--texto">
        <Revelar>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="titulo-secao cta-titulo">{titulo}</h2>
          <p className="lead cta-texto">{texto}</p>
          <a className="btn btn--primario cta-botao" href={linkWhatsSTU(mensagem)} target="_blank" rel="noopener noreferrer">
            <IconeWhatsApp tamanho={18} />
            {botao}
          </a>
        </Revelar>
      </div>
      <style>{`
        .cta { text-align: center; }
        .cta .eyebrow { justify-content: center; }
        .cta .eyebrow::after {
          content: '';
          width: 28px;
          height: 1px;
          background: currentColor;
        }
        .cta-titulo { margin: 24px auto 0; max-width: 760px; }
        .cta-texto { margin: 24px auto 40px; max-width: 560px; }
        .cta-botao { min-height: 60px; padding: 0 36px; }
        @media (max-width: 520px) {
          .cta-botao { width: 100%; }
        }
      `}</style>
    </section>
  )
}
