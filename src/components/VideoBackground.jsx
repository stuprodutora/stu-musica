import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import bgVideo from '../assets/bg-video.mp4'

/*
 * Vídeo de fundo — mesma lógica do site principal.
 *
 * Renderiza por portal dentro de #stu-fundo (index.html), a camada sticky que
 * faz o quique do iOS mostrar a cor sólida do html em vez do vídeo cru — ver
 * global.css. Aqui o véu por cima é mais quente: um brilho âmbar vindo do
 * alto, como luz de estúdio, sobre o navy da marca.
 */
const VEU = [
  'radial-gradient(ellipse 80% 60% at 18% 0%, rgba(207, 94, 44, 0.22) 0%, rgba(207, 94, 44, 0) 60%)',
  'radial-gradient(ellipse 60% 50% at 100% 100%, rgba(163, 58, 24, 0.16) 0%, rgba(163, 58, 24, 0) 65%)',
  'linear-gradient(to bottom, rgba(6, 12, 30, 0.62) 0%, rgba(6, 12, 30, 0.78) 55%, rgba(6, 12, 30, 0.9) 100%)',
].join(', ')

export default function VideoBackground({ veu = VEU }) {
  const videoRef = useRef(null)
  const menosMovimento = useReducedMotion()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (menosMovimento) video.pause()
    else video.play().catch(() => {})
  }, [menosMovimento])

  const camada = document.getElementById('stu-fundo')

  const fundo = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      style={{
        // Sem a camada (não deveria acontecer), cai no fixo
        position: camada ? 'absolute' : 'fixed',
        // 140% da altura, de -20% a 120%: o mesmo enquadramento do site principal
        top: '-20%',
        left: 0,
        width: '100%',
        height: '140%',
        zIndex: camada ? undefined : -1,
        overflow: 'hidden',
        pointerEvents: 'none',
        backgroundColor: 'var(--stu-black)',
      }}
    >
      <video
        ref={videoRef}
        autoPlay={!menosMovimento}
        loop
        muted
        playsInline
        preload="auto"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>
      <div style={{ position: 'absolute', inset: 0, background: veu }} />
    </motion.div>
  )

  return camada ? createPortal(fundo, camada) : fundo
}
