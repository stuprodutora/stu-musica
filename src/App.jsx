import { useEffect } from 'react'
import { BrowserRouter, Link, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { MusicPlayerProvider } from './contexts/MusicPlayerContext'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import VideoBackground from './components/VideoBackground'
import MusicPlayerGlobal from './components/MusicPlayerGlobal'

import Home from './pages/Home'
import Musicas from './pages/Musicas'
import Servicos from './pages/Servicos'
import Sobre from './pages/Sobre'
import Contato from './pages/Contato'

// Toda troca de página abre no topo — exceto âncora (/servicos#arranjo-musical),
// em que a própria página rola até a seção
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

// A página nova entra com fade. Sem animação de saída de propósito: a página
// que sai continuaria montada enquanto o ScrollToTop já rolou para o topo.
function PaginaAnimada({ children }) {
  const { pathname } = useLocation()
  const menosMovimento = useReducedMotion()

  if (menosMovimento) return children

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Layout() {
  return (
    <>
      <VideoBackground />
      <Navbar />
      <main>
        <PaginaAnimada>
          <Outlet />
        </PaginaAnimada>
      </main>
      <Footer />
    </>
  )
}

function NaoEncontrada() {
  return (
    <section className="secao">
      <div className="container">
        <span className="eyebrow">404</span>
        <h1 className="titulo-display" style={{ marginTop: 24 }}>
          Essa faixa <span className="acento">não existe.</span>
        </h1>
        <Link to="/" className="btn btn--primario" style={{ marginTop: 40 }}>
          Voltar ao início
        </Link>
      </div>
    </section>
  )
}

export default function App() {
  return (
    // O provider fica acima do roteador: o áudio continua tocando entre páginas
    <MusicPlayerProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/musicas" element={<Musicas />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="*" element={<NaoEncontrada />} />
          </Route>
        </Routes>
        <MusicPlayerGlobal />
      </BrowserRouter>
    </MusicPlayerProvider>
  )
}
