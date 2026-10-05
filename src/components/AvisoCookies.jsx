import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  lerEscolha, gravarEscolha, ativarAnalytics, desativarAnalytics,
  registrarPagina, EVENTO_PREFERENCIAS,
} from '../lib/analytics'

/*
 * Aviso de cookies + quem liga o Google Analytics. Regras em lib/analytics.js.
 *
 * - Sem escolha registrada, o aviso aparece e o GA fica desligado.
 * - "Aceitar" e "Recusar" são idênticos de propósito: a ANPD pede que recusar
 *   seja tão fácil quanto aceitar, sem empurrar uma opção.
 * - "Preferências de cookies" (rodapé e Política) reabre o aviso a qualquer
 *   momento; recusar depois de aceitar desliga o GA e apaga os cookies dele.
 * - Fica acima do player global (--player-h), para não esconder os controles.
 */
export default function AvisoCookies() {
  const { pathname } = useLocation()
  const menosMovimento = useReducedMotion()
  const [escolha, setEscolha] = useState(() => lerEscolha())
  const [reaberto, setReaberto] = useState(false)

  // Liga o GA (uma vez) e registra cada página. Fica depois das rotas no App:
  // o título da página já está definido quando este efeito roda.
  useEffect(() => {
    if (escolha !== 'aceito') return
    ativarAnalytics()
    registrarPagina(pathname)
  }, [escolha, pathname])

  useEffect(() => {
    const abrir = () => setReaberto(true)
    window.addEventListener(EVENTO_PREFERENCIAS, abrir)
    return () => window.removeEventListener(EVENTO_PREFERENCIAS, abrir)
  }, [])

  const decidir = (valor) => {
    gravarEscolha(valor)
    if (valor === 'recusado') desativarAnalytics()
    setEscolha(valor)
    setReaberto(false)
  }

  const visivel = escolha === null || reaberto

  return (
    <AnimatePresence>
      {visivel && (
        <motion.div
          className="ck"
          role="dialog"
          aria-live="polite"
          aria-labelledby="ck-titulo"
          initial={menosMovimento ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, delay: escolha === null ? 1.2 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="ck-titulo" id="ck-titulo">Cookies de análise</p>
          <p className="ck-texto">
            Com a sua permissão, usamos o Google Analytics para entender quantas pessoas visitam o site e o que
            mais ouvem. Nada de publicidade. Sem permissão, nada é gravado e o site funciona igual.{' '}
            <Link to="/privacidade">Política de Privacidade</Link>
          </p>
          {reaberto && escolha && (
            <p className="ck-texto ck-atual">
              Sua escolha atual: <strong>{escolha === 'aceito' ? 'aceito' : 'recusado'}</strong>.
            </p>
          )}
          <div className="ck-botoes">
            <button type="button" onClick={() => decidir('recusado')}>Recusar</button>
            <button type="button" onClick={() => decidir('aceito')}>Aceitar</button>
          </div>

          <style>{`
            .ck {
              position: fixed;
              left: var(--gutter);
              bottom: calc(20px + var(--player-h));
              z-index: 950;
              width: min(420px, calc(100vw - var(--gutter) * 2));
              padding: 22px;
              background: rgba(6, 12, 30, 0.96);
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
              border: 1px solid var(--stu-cream-12);
              border-top: 2px solid var(--stu-orange);
              box-shadow: 0 24px 60px -20px rgba(0, 0, 0, 0.7);
              transition: bottom var(--stu-dur-media) var(--stu-ease);
            }
            .ck-titulo {
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 2.5px;
              text-transform: uppercase;
              color: var(--stu-orange);
              margin-bottom: 8px;
            }
            .ck-texto { font-size: 14px; font-weight: 300; line-height: 1.6; color: var(--stu-cream-70); }
            .ck-texto strong { color: var(--stu-cream); font-weight: 700; }
            .ck-atual { margin-top: 8px; }
            .ck-texto a {
              color: var(--stu-cream);
              text-decoration: underline;
              text-underline-offset: 3px;
              white-space: nowrap;
            }
            .ck-texto a:hover { color: var(--stu-orange); }
            .ck-botoes { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 16px; }
            /* Os dois botões são idênticos de propósito: nenhuma opção é empurrada */
            .ck-botoes button {
              min-height: 44px;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 2px;
              text-transform: uppercase;
              color: var(--stu-cream);
              border: 1px solid var(--stu-cream-30);
              transition: border-color var(--stu-dur-rapida), color var(--stu-dur-rapida);
            }
            .ck-botoes button:hover { border-color: var(--stu-orange); color: var(--stu-orange); }
            @media (max-width: 520px) {
              .ck { left: 12px; width: calc(100vw - 24px); bottom: calc(12px + var(--player-h)); padding: 18px; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
