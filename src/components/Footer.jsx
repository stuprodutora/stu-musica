import { Link } from 'react-router-dom'
import {
  linkWhatsSTU, WHATSAPP_EXIBICAO, EMAIL, INSTAGRAM, INSTAGRAM_EXIBICAO, SITE_PRINCIPAL,
} from '../lib/contato'
import { IconeWhatsApp, IconeInstagram, IconeEmail, IconeSeta } from './Icones'

export default function Footer() {
  const ano = new Date().getFullYear()

  return (
    <footer className="rodape">
      <div className="container">
        <div className="rodape-topo">
          <div className="rodape-marca">
            <Link to="/" className="rodape-logo" aria-label="stu. música — início">
              <img src="/logo.png" alt="stu." width="96" height="36" />
              <span>música</span>
            </Link>
            <p>Produção musical, arranjo e trilhas sonoras para quem leva a própria música a sério.</p>
          </div>

          <nav className="rodape-col" aria-label="Rodapé">
            <span className="rodape-titulo">Navegue</span>
            <Link to="/musicas">Músicas</Link>
            <Link to="/servicos">Serviços</Link>
            <Link to="/sobre">Sobre</Link>
            <Link to="/contato">Contato</Link>
          </nav>

          <div className="rodape-col">
            <span className="rodape-titulo">Fale com a gente</span>
            <a href={linkWhatsSTU()} target="_blank" rel="noopener noreferrer">
              <IconeWhatsApp tamanho={14} /> {WHATSAPP_EXIBICAO}
            </a>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
              <IconeInstagram tamanho={14} /> {INSTAGRAM_EXIBICAO}
            </a>
            <a href={`mailto:${EMAIL}`}>
              <IconeEmail tamanho={14} /> {EMAIL}
            </a>
          </div>
        </div>

        <a className="rodape-irma" href={SITE_PRINCIPAL} target="_blank" rel="noopener noreferrer">
          <span>Áudio e vídeo para marcas? Conheça a STU Produções</span>
          <IconeSeta />
        </a>

        <div className="rodape-base">
          <span>© {ano} STU Produções</span>
          <span>Feito com escuta.</span>
        </div>
      </div>

      <style>{`
        .rodape {
          position: relative;
          padding: 80px 0 32px;
          border-top: 1px solid var(--stu-cream-06);
          background: linear-gradient(to bottom, rgba(6, 12, 30, 0.4), rgba(6, 12, 30, 0.85));
        }
        .rodape-topo {
          display: grid;
          grid-template-columns: 2fr 1fr 1.4fr;
          gap: 48px;
        }
        .rodape-logo { display: inline-flex; align-items: flex-end; gap: 12px; margin-bottom: 20px; }
        .rodape-logo img { height: 36px; width: auto; }
        .rodape-logo span { font-size: 20px; font-style: italic; font-weight: 300; color: var(--stu-cream-70); line-height: 1; padding-bottom: 3px; }
        .rodape-marca p { max-width: 340px; color: var(--stu-cream-50); font-size: 15px; font-weight: 300; }
        .rodape-col { display: flex; flex-direction: column; gap: 12px; }
        .rodape-titulo {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--stu-orange);
          margin-bottom: 4px;
        }
        .rodape-col a {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          color: var(--stu-cream-70);
          transition: color var(--stu-dur-rapida);
          word-break: break-word;
        }
        .rodape-col a:hover { color: var(--stu-cream); }
        .rodape-irma {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-top: 64px;
          padding: 22px 0;
          border-top: 1px solid var(--stu-cream-06);
          border-bottom: 1px solid var(--stu-cream-06);
          font-size: 15px;
          color: var(--stu-cream-70);
          transition: color var(--stu-dur-rapida);
        }
        .rodape-irma svg { transition: transform var(--stu-dur-media) var(--stu-ease); flex-shrink: 0; }
        .rodape-irma:hover { color: var(--stu-orange); }
        .rodape-irma:hover svg { transform: translateX(6px); }
        .rodape-base {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px 24px;
          margin-top: 24px;
          font-size: 12px;
          color: var(--stu-cream-30);
        }
        @media (max-width: 860px) {
          .rodape-topo { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .rodape-marca { grid-column: 1 / -1; }
        }
        @media (max-width: 520px) {
          .rodape { padding-top: 64px; }
          .rodape-topo { grid-template-columns: minmax(0, 1fr); gap: 36px; }
        }
      `}</style>
    </footer>
  )
}
