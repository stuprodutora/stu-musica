import { useState } from 'react'
import { imagemOtimizada } from '../lib/imagem'

/*
 * Capa quadrada de um projeto. Sem imagem (ou se ela falhar), desenha uma
 * capa tipográfica com o nome do projeto — nunca um quadro vazio.
 */
export default function Capa({ src, nome, largura = 720, className = '' }) {
  const [falhou, setFalhou] = useState(false)
  const [carregou, setCarregou] = useState(false)

  if (!src || falhou) {
    return (
      <div className={`capa capa--tipografica ${className}`} aria-hidden="true">
        <span className="capa-nome">{nome}</span>
        <span className="capa-marca">stu.</span>
        <style>{CSS}</style>
      </div>
    )
  }

  return (
    <div className={`capa ${className}`}>
      <img
        src={imagemOtimizada(src, largura, { altura: largura })}
        alt={`Capa de ${nome}`}
        loading="lazy"
        decoding="async"
        onLoad={() => setCarregou(true)}
        onError={() => setFalhou(true)}
        style={{ opacity: carregou ? 1 : 0 }}
      />
      <style>{CSS}</style>
    </div>
  )
}

const CSS = `
  .capa {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    background: var(--stu-navy);
  }
  .capa img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.6s var(--stu-ease), transform 1.2s var(--stu-ease);
  }
  .capa--tipografica {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 9%;
    background:
      radial-gradient(circle at 85% 85%, rgba(207, 94, 44, 0.55), rgba(207, 94, 44, 0) 55%),
      linear-gradient(135deg, var(--stu-navy), var(--stu-black));
  }
  .capa-nome {
    font-size: clamp(18px, 3.4vw, 34px);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.03em;
    color: var(--stu-cream);
    word-break: break-word;
  }
  .capa-marca {
    align-self: flex-end;
    font-size: 14px;
    font-weight: 900;
    color: var(--stu-cream-50);
  }
`
