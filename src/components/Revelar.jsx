import { motion, useReducedMotion } from 'framer-motion'

// Entrada suave ao aparecer na tela. Com "reduzir movimento", só aparece.
export default function Revelar({ children, atraso = 0, y = 32, como = 'div', className, ...resto }) {
  const menosMovimento = useReducedMotion()
  const Tag = motion[como]

  return (
    <Tag
      className={className}
      initial={menosMovimento ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={menosMovimento ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, delay: atraso, ease: [0.22, 1, 0.36, 1] }}
      {...resto}
    >
      {children}
    </Tag>
  )
}
