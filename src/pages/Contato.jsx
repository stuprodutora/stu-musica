import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTitulo } from '../hooks/useTitulo'
import {
  linkWhatsSTU, WHATSAPP_EXIBICAO, EMAIL, INSTAGRAM, INSTAGRAM_EXIBICAO,
} from '../lib/contato'
import Revelar from '../components/Revelar'
import { IconeWhatsApp, IconeInstagram, IconeEmail, IconeSeta } from '../components/Icones'

const TIPOS_PROJETO = ['Single', 'EP ou álbum', 'Arranjo', 'Trilha sonora', 'Ainda não sei']
const ETAPAS = ['Só a ideia', 'Tenho uma demo', 'Já está gravado']

/*
 * O formulário não grava nada: ele monta uma mensagem organizada e abre o
 * WhatsApp com ela pronta. O visitante revisa e envia — e a conversa já
 * começa com o contexto todo, sem dado pessoal guardado em lugar nenhum.
 */
export default function Contato() {
  useTitulo('Contato', 'Conte sobre a sua música. Produção, arranjo e trilhas sonoras — fale com a STU pelo WhatsApp.')

  const [form, setForm] = useState({ nome: '', artista: '', tipos: [], etapa: '', referencia: '', mensagem: '' })
  const [tentou, setTentou] = useState(false)

  const atualizar = (campo) => (e) => setForm(f => ({ ...f, [campo]: e.target.value }))
  const alternarTipo = (t) => setForm(f => ({
    ...f,
    tipos: f.tipos.includes(t) ? f.tipos.filter(x => x !== t) : [...f.tipos, t],
  }))

  const valido = form.nome.trim() && form.mensagem.trim()

  const enviar = (e) => {
    e.preventDefault()
    setTentou(true)
    if (!valido) return

    const linhas = [
      'Olá! Vim pelo stu. música.',
      '',
      `*Nome:* ${form.nome.trim()}`,
      form.artista.trim() ? `*Artista / banda:* ${form.artista.trim()}` : null,
      form.tipos.length > 0 ? `*Projeto:* ${form.tipos.join(', ')}` : null,
      form.etapa ? `*Em que pé está:* ${form.etapa}` : null,
      form.referencia.trim() ? `*Referência / demo:* ${form.referencia.trim()}` : null,
      '',
      form.mensagem.trim(),
    ].filter(l => l !== null)

    window.open(linkWhatsSTU(linhas.join('\n')), '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <section className="ct">
        <div className="container ct-grade">
          <Revelar className="ct-lado">
            <span className="eyebrow">Contato</span>
            <h1 className="titulo-display ct-titulo">
              Conta pra gente <span className="acento">sobre a sua música.</span>
            </h1>
            <p className="lead ct-lead">
              Pode ser uma ideia solta, uma demo no celular ou um disco inteiro pronto para gravar.
              Quanto mais a gente souber, melhor o caminho que dá para propor.
            </p>

            <ul className="ct-canais">
              <li>
                <a href={linkWhatsSTU()} target="_blank" rel="noopener noreferrer">
                  <IconeWhatsApp tamanho={18} />
                  <span><small>WhatsApp</small>{WHATSAPP_EXIBICAO}</span>
                  <IconeSeta />
                </a>
              </li>
              <li>
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
                  <IconeInstagram tamanho={18} />
                  <span><small>Instagram</small>{INSTAGRAM_EXIBICAO}</span>
                  <IconeSeta />
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`}>
                  <IconeEmail tamanho={18} />
                  <span><small>E-mail</small>{EMAIL}</span>
                  <IconeSeta />
                </a>
              </li>
            </ul>
          </Revelar>

          <Revelar atraso={0.1}>
            <form className="ct-form" onSubmit={enviar} noValidate>
              <div className="ct-linha">
                <Campo rotulo="Seu nome" obrigatorio erro={tentou && !form.nome.trim()}>
                  <input value={form.nome} onChange={atualizar('nome')} autoComplete="name" required />
                </Campo>
                <Campo rotulo="Nome artístico ou banda">
                  <input value={form.artista} onChange={atualizar('artista')} />
                </Campo>
              </div>

              <fieldset className="ct-campo">
                <legend>O que você quer fazer?</legend>
                <div className="ct-opcoes">
                  {TIPOS_PROJETO.map(t => (
                    <button
                      type="button"
                      key={t}
                      className={`ct-opcao${form.tipos.includes(t) ? ' ativa' : ''}`}
                      aria-pressed={form.tipos.includes(t)}
                      onClick={() => alternarTipo(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="ct-campo">
                <legend>Em que pé está?</legend>
                <div className="ct-opcoes">
                  {ETAPAS.map(et => (
                    <button
                      type="button"
                      key={et}
                      className={`ct-opcao${form.etapa === et ? ' ativa' : ''}`}
                      aria-pressed={form.etapa === et}
                      onClick={() => setForm(f => ({ ...f, etapa: f.etapa === et ? '' : et }))}
                    >
                      {et}
                    </button>
                  ))}
                </div>
              </fieldset>

              <Campo rotulo="Link de referência ou demo" dica="Spotify, YouTube, Drive — o que tiver">
                <input value={form.referencia} onChange={atualizar('referencia')} inputMode="url" placeholder="https://" />
              </Campo>

              <Campo rotulo="Conta um pouco do projeto" obrigatorio erro={tentou && !form.mensagem.trim()}>
                <textarea rows={5} value={form.mensagem} onChange={atualizar('mensagem')} required />
              </Campo>

              <button type="submit" className="btn btn--primario ct-enviar">
                <IconeWhatsApp tamanho={18} /> Continuar no WhatsApp
              </button>
              <p className="ct-nota">
                A mensagem abre pronta no WhatsApp para você revisar antes de enviar. Nada fica salvo aqui.{' '}
                <Link to="/privacidade">Política de Privacidade</Link>
              </p>
            </form>
          </Revelar>
        </div>
      </section>

      <style>{`
        .ct { padding: clamp(64px, 10vw, 120px) 0 clamp(80px, 12vw, 140px); }
        .ct-grade {
          display: grid;
          grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
          gap: clamp(40px, 7vw, 112px);
          align-items: start;
        }
        .ct-lado { position: sticky; top: 110px; }
        .ct-titulo { margin-top: 24px; font-size: clamp(40px, 6vw, 80px); }
        .ct-lead { margin-top: 28px; }
        .ct-canais { margin-top: 48px; border-top: 1px solid var(--stu-cream-12); }
        .ct-canais a {
          display: grid;
          grid-template-columns: 24px minmax(0, 1fr) 16px;
          align-items: center;
          gap: 16px;
          padding: 18px 0;
          border-bottom: 1px solid var(--stu-cream-12);
          color: var(--stu-cream);
          font-size: 16px;
          transition: color var(--stu-dur-rapida);
        }
        .ct-canais a > span { display: flex; flex-direction: column; min-width: 0; overflow-wrap: anywhere; }
        .ct-canais small {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--stu-cream-50);
        }
        .ct-canais a > svg:first-child { color: var(--stu-orange); }
        .ct-canais a > svg:last-child { color: var(--stu-cream-30); transition: transform 0.4s var(--stu-ease), color var(--stu-dur-rapida); }
        .ct-canais a:hover { color: var(--stu-orange); }
        .ct-canais a:hover > svg:last-child { color: var(--stu-orange); transform: translateX(4px); }

        .ct-form {
          display: flex;
          flex-direction: column;
          gap: 28px;
          padding: clamp(24px, 4vw, 48px);
          background: var(--stu-painel);
          border: 1px solid var(--stu-cream-06);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .ct-linha { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px; }
        .ct-campo { display: flex; flex-direction: column; gap: 10px; border: none; min-width: 0; }
        .ct-campo label, .ct-campo legend {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--stu-cream-70);
          padding: 0;
        }
        .ct-campo legend { margin-bottom: 12px; }
        .ct-obrigatorio { color: var(--stu-orange); }
        .ct-campo input, .ct-campo textarea {
          display: block;
          width: 100%;
          margin-top: 6px;
          text-transform: none;
          letter-spacing: normal;
          font-weight: 400;
          padding: 12px 0;
          font-size: 17px;
          color: var(--stu-cream);
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--stu-cream-30);
          border-radius: 0;
          outline: none;
          resize: vertical;
          transition: border-color var(--stu-dur-rapida);
        }
        .ct-campo input::placeholder { color: var(--stu-cream-30); }
        .ct-campo input:focus, .ct-campo textarea:focus { border-bottom-color: var(--stu-orange); }
        .ct-campo.erro input, .ct-campo.erro textarea { border-bottom-color: #e2725b; }
        .ct-dica { font-size: 12px; color: var(--stu-cream-50); }
        .ct-erro { font-size: 12px; color: #e2725b; }
        .ct-opcoes { display: flex; flex-wrap: wrap; gap: 8px; }
        .ct-opcao {
          min-height: 40px;
          padding: 0 16px;
          font-size: 14px;
          color: var(--stu-cream-70);
          border: 1px solid var(--stu-cream-12);
          transition: all var(--stu-dur-rapida);
        }
        .ct-opcao:hover { border-color: var(--stu-cream-30); color: var(--stu-cream); }
        .ct-opcao.ativa { background: var(--stu-orange); border-color: var(--stu-orange); color: var(--stu-cream); }
        .ct-enviar { min-height: 60px; margin-top: 8px; }
        .ct-nota { font-size: 13px; color: var(--stu-cream-50); margin-top: -12px; }
        .ct-nota a { color: var(--stu-cream-70); text-decoration: underline; text-underline-offset: 3px; }
        .ct-nota a:hover { color: var(--stu-orange); }

        @media (max-width: 960px) {
          .ct-grade { grid-template-columns: minmax(0, 1fr); }
          .ct-lado { position: static; }
        }
        @media (max-width: 520px) {
          .ct-linha { grid-template-columns: minmax(0, 1fr); }
          .ct-form { margin: 0 calc(var(--gutter) * -1); border-left: none; border-right: none; }
        }
      `}</style>
    </>
  )
}

function Campo({ rotulo, obrigatorio, erro, dica, children }) {
  return (
    <div className={`ct-campo${erro ? ' erro' : ''}`}>
      <label>
        {rotulo} {obrigatorio && <span className="ct-obrigatorio" aria-hidden="true">*</span>}
        {children}
      </label>
      {dica && <span className="ct-dica">{dica}</span>}
      {erro && <span className="ct-erro" role="alert">Esse campo ajuda a gente a responder melhor — preenche aí?</span>}
    </div>
  )
}
