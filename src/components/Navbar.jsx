import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { linkWhatsSTU } from '../lib/contato'
import { IconeWhatsApp } from './Icones'

const LINKS = [
  { to: '/musicas', rotulo: 'Músicas' },
  { to: '/servicos', rotulo: 'Serviços' },
  { to: '/sobre', rotulo: 'Sobre' },
  { to: '/contato', rotulo: 'Contato' },
]

export default function Navbar() {
  const [aberto, setAberto] = useState(false)
  const [rolou, setRolou] = useState(false)
  const { pathname } = useLocation()

  // Fecha o menu ao trocar de página
  const [rotaAnterior, setRotaAnterior] = useState(pathname)
  if (rotaAnterior !== pathname) {
    setRotaAnterior(pathname)
    setAberto(false)
  }

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Menu aberto trava a rolagem — no html, nunca no body (ver global.css)
  useEffect(() => {
    document.documentElement.style.overflow = aberto ? 'hidden' : ''
    const onKey = (e) => { if (e.key === 'Escape') setAberto(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [aberto])

  return (
    <>
    <header className={`nav${rolou || aberto ? ' nav--solida' : ''}`}>
      <div className="nav-interno container">
        <Link to="/" className="nav-logo" aria-label="stu. música — início">
          <img src="/logo.png" alt="stu." width="70" height="26" />
          <span className="nav-selo">música</span>
        </Link>

        <nav className="nav-links" aria-label="Principal">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} className="nav-link">
              {l.rotulo}
            </NavLink>
          ))}
        </nav>

        <a className="btn btn--primario nav-whats" href={linkWhatsSTU()} target="_blank" rel="noopener noreferrer">
          <IconeWhatsApp tamanho={15} />
          <span>WhatsApp</span>
        </a>

        <button
          className={`nav-hamburguer${aberto ? ' aberto' : ''}`}
          onClick={() => setAberto(a => !a)}
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={aberto}
          aria-controls="nav-mobile"
        >
          <span /><span />
        </button>
      </div>
    </header>

      {/* Fora do <header>: o backdrop-filter dele prenderia um position:fixed */}
      <AnimatePresence>
        {aberto && (
          <motion.nav
            id="nav-mobile"
            className="nav-mobile"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul>
              {[{ to: '/', rotulo: 'Início' }, ...LINKS].map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLink to={l.to} end className="nav-mobile-link">
                    <span className="nav-mobile-num">{String(i + 1).padStart(2, '0')}</span>
                    {l.rotulo}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
            <a className="btn btn--primario" href={linkWhatsSTU()} target="_blank" rel="noopener noreferrer">
              <IconeWhatsApp tamanho={16} />
              Conversar no WhatsApp
            </a>
          </motion.nav>
        )}
      </AnimatePresence>

      <style>{`
        .nav {
          position: sticky;
          top: 0;
          z-index: 800;
          transition: background var(--stu-dur-media) var(--stu-ease), border-color var(--stu-dur-media) var(--stu-ease);
          border-bottom: 1px solid transparent;
        }
        .nav--solida {
          background: rgba(6, 12, 30, 0.82);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom-color: var(--stu-cream-06);
        }
        .nav-interno {
          display: flex;
          align-items: center;
          gap: 32px;
          height: 76px;
        }
        .nav-logo {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          margin-right: auto;
          position: relative;
          z-index: 2;
        }
        .nav-logo img { height: 26px; width: auto; }
        .nav-selo {
          font-size: 15px;
          font-style: italic;
          font-weight: 300;
          color: var(--stu-cream-70);
          line-height: 1;
          padding-bottom: 2px;
        }
        .nav-links { display: flex; gap: 36px; }
        .nav-link {
          position: relative;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: var(--stu-cream-70);
          padding: 8px 0;
          transition: color var(--stu-dur-rapida);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: var(--stu-orange);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform var(--stu-dur-media) var(--stu-ease);
        }
        .nav-link:hover, .nav-link.active { color: var(--stu-cream); }
        .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }
        .nav-whats { min-height: 42px; padding: 0 18px; font-size: 11px; }

        .nav-hamburguer {
          display: none;
          position: relative;
          z-index: 2;
          width: 44px;
          height: 44px;
          margin-right: -10px;
        }
        .nav-hamburguer span {
          position: absolute;
          left: 10px;
          right: 10px;
          height: 1.5px;
          background: var(--stu-cream);
          transition: transform var(--stu-dur-media) var(--stu-ease), top var(--stu-dur-media) var(--stu-ease);
        }
        .nav-hamburguer span:first-child { top: 17px; }
        .nav-hamburguer span:last-child { top: 26px; }
        .nav-hamburguer.aberto span:first-child { top: 21.5px; transform: rotate(45deg); }
        .nav-hamburguer.aberto span:last-child { top: 21.5px; transform: rotate(-45deg); }

        .nav-mobile {
          position: fixed;
          inset: 0;
          z-index: 790;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 48px;
          padding: 96px var(--gutter) calc(48px + var(--player-h));
          background:
            radial-gradient(ellipse 90% 60% at 0% 0%, rgba(207, 94, 44, 0.18), transparent 60%),
            rgba(6, 12, 30, 0.98);
        }
        .nav-mobile ul { display: flex; flex-direction: column; gap: 6px; }
        .nav-mobile-link {
          display: flex;
          align-items: baseline;
          gap: 16px;
          font-size: clamp(36px, 11vw, 56px);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.15;
          color: var(--stu-cream);
        }
        .nav-mobile-link.active { color: var(--stu-orange); font-style: italic; font-weight: 300; }
        .nav-mobile-num {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          color: var(--stu-orange);
          font-style: normal;
        }
        .nav-mobile .btn { align-self: flex-start; }

        @media (max-width: 860px) {
          .nav-links, .nav-whats { display: none; }
          .nav-hamburguer { display: block; }
          .nav-interno { height: 64px; }
        }
        @media (min-width: 861px) {
          .nav-mobile { display: none; }
        }
      `}</style>
    </>
  )
}
