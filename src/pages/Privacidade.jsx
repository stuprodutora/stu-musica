import { Link } from 'react-router-dom'
import { useTitulo } from '../hooks/useTitulo'
import { abrirPreferenciasCookies, GA_ID } from '../lib/analytics'
import { EMAIL, SITE_PRINCIPAL } from '../lib/contato'
import Revelar from '../components/Revelar'

// ─── Política de Privacidade (LGPD) ─────────────────────────────────────────
//
// Tudo aqui descreve o que ESTE site faz — se o código mudar (dado novo,
// fornecedor novo, outro cookie), esta página muda junto. Fontes no código:
// formulário que só abre o WhatsApp (pages/Contato.jsx), catálogo lido do
// Supabase (lib/catalogo.js), Google Analytics com consentimento
// (lib/analytics.js, components/AvisoCookies.jsx).
//
// Controlador e contato são os mesmos da política do produtorastu.com.

const ATUALIZADA_EM = '5 de outubro de 2026'
const COOKIE_PROPRIEDADE = `_ga_${GA_ID.slice(2)}`

const SECOES = [
  {
    titulo: 'Quem cuida dos seus dados',
    corpo: (
      <>
        <p>
          O stu. música é o braço musical da STU Produções, nome comercial de{' '}
          <strong>48.716.838 THOMAS SANTOS CASSOL</strong>, CNPJ <strong>48.716.838/0001-02</strong>, com sede em
          Porto Alegre — RS. É quem decide como os dados pessoais recebidos por este site são usados (o{' '}
          <em>controlador</em>, nos termos da Lei Geral de Proteção de Dados — Lei nº 13.709/2018).
        </p>
        <p>Qualquer assunto sobre seus dados: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
      </>
    ),
  },
  {
    titulo: 'Quais dados recebemos',
    corpo: (
      <>
        <p>
          <strong>Pelo formulário de contato:</strong> nada fica guardado no site. O formulário só monta uma
          mensagem e abre o WhatsApp para você revisar e enviar. O que você mandar chega até nós como uma
          conversa de WhatsApp — nome, número, a mensagem e o que mais você decidir compartilhar.
        </p>
        <p>
          <strong>Navegação, só se você permitir:</strong> com o Google Analytics, registramos como o site é
          usado — páginas visitadas, tempo em cada página, tipo de aparelho e navegador, cidade aproximada e de
          onde você chegou (uma busca, uma rede social). Não recebemos seu nome, e-mail ou telefone por esse
          caminho, e o Google Analytics não guarda o seu endereço IP. Sem a sua permissão, nada disso é coletado.
        </p>
        <p>
          <strong>Dados técnicos da conexão:</strong> como em qualquer site, os serviços que entregam as páginas e
          as músicas recebem dados técnicos da conexão (como o endereço IP) para conseguir entregá-las.
        </p>
        <p>Não usamos ferramentas de publicidade nem de rastreamento entre sites.</p>
      </>
    ),
  },
  {
    titulo: 'Para que usamos',
    corpo: (
      <>
        <p>
          As mensagens que você envia servem para responder ao seu contato, montar o orçamento e, se houver
          contratação, executar o projeto. A base legal é a execução de procedimentos preliminares a um
          contrato, a pedido seu (art. 7º, V, da LGPD).
        </p>
        <p>
          As estatísticas de navegação servem só para entender a audiência e melhorar o site. A base legal é o
          seu consentimento (art. 7º, I), que você pode retirar a qualquer momento em{' '}
          <strong>Preferências de cookies</strong>, no rodapé.
        </p>
        <p>Não vendemos seus dados, não os usamos para publicidade e não enviamos mensagens que você não pediu.</p>
      </>
    ),
  },
  {
    titulo: 'Com quem compartilhamos',
    corpo: (
      <>
        <p>Usamos fornecedores que guardam ou transmitem dados em nosso nome, só para fazer o site funcionar:</p>
        <ul>
          <li><strong>Vercel</strong> — hospedagem do site;</li>
          <li><strong>Supabase</strong> — catálogo de produções e arquivos de áudio e capas;</li>
          <li><strong>Google</strong> — estatísticas de visita (Google Analytics), só com o seu consentimento.</li>
        </ul>
        <p>
          Esses serviços mantêm servidores fora do Brasil. A transferência internacional acontece com base nas
          garantias contratuais oferecidas por eles, conforme o art. 33 da LGPD.
        </p>
        <p>
          Os links para <strong>WhatsApp</strong>, <strong>Instagram</strong> e <strong>Spotify</strong> levam você
          para esses serviços, que têm suas próprias políticas de privacidade. Nada deles é carregado aqui antes
          de você clicar.
        </p>
      </>
    ),
  },
  {
    titulo: 'O que fica no seu navegador',
    corpo: (
      <>
        <p>
          Sem a sua permissão, o site não grava cookies. Ele guarda no seu navegador apenas a sua escolha sobre
          cookies, para não perguntar de novo a cada visita.
        </p>
        <p>
          Se você aceitar o Google Analytics, ele grava os cookies <strong>_ga</strong> e{' '}
          <strong>{COOKIE_PROPRIEDADE}</strong>, que duram até <strong>1 ano</strong> e servem para reconhecer
          visitas repetidas sem identificar quem você é. Recusar não muda nada no funcionamento do site.
        </p>
        <p>
          Mudou de ideia?{' '}
          <button type="button" className="pv-link" onClick={abrirPreferenciasCookies}>
            Abra as preferências de cookies
          </button>
          . Ao recusar, o Google Analytics para na hora e os cookies dele são apagados.
        </p>
        <p>
          A escolha feita aqui vale só para o stu. música. O{' '}
          <a href={SITE_PRINCIPAL} target="_blank" rel="noopener noreferrer">produtorastu.com</a> pergunta
          separadamente.
        </p>
      </>
    ),
  },
  {
    titulo: 'Por quanto tempo guardamos',
    corpo: (
      <>
        <p>
          Os dados de navegação do Google Analytics ligados ao seu aparelho (como o identificador do cookie) ficam
          guardados por até <strong>2 meses</strong> e depois são apagados pelo próprio Google. Ficam só os relatórios
          agregados — totais de visitas, sem identificar ninguém.
        </p>
        <p>
          As conversas sobre projetos são mantidas enquanto durar a negociação e, se houver contratação, pelo prazo
          exigido por obrigações legais e fiscais.
        </p>
      </>
    ),
  },
  {
    titulo: 'Seus direitos',
    corpo: (
      <>
        <p>Você pode, a qualquer momento, pedir:</p>
        <ul>
          <li>a confirmação de que tratamos seus dados e o acesso a eles;</li>
          <li>a correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>a anonimização, o bloqueio ou a eliminação de dados desnecessários ou tratados em desacordo com a lei;</li>
          <li>a portabilidade dos seus dados;</li>
          <li>a informação sobre com quem compartilhamos seus dados;</li>
          <li>a eliminação dos seus dados, ressalvado o que a lei nos obriga a guardar.</li>
        </ul>
        <p>
          Basta escrever para <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Respondemos em até 15 dias. Você também pode
          apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD), em{' '}
          <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer">gov.br/anpd</a>.
        </p>
      </>
    ),
  },
  {
    titulo: 'Mudanças nesta política',
    corpo: <p>Se esta política mudar, a versão nova é publicada nesta página, com a data de atualização.</p>,
  },
]

export default function Privacidade() {
  useTitulo('Política de Privacidade', 'Como o stu. música trata dados pessoais, cookies e o Google Analytics, conforme a LGPD.')

  return (
    <>
      <section className="pv-cabeca">
        <div className="container container--texto">
          <Revelar>
            <span className="eyebrow">LGPD</span>
            <h1 className="titulo-secao pv-titulo">Política de Privacidade</h1>
            <p className="pv-atualizada">Última atualização: {ATUALIZADA_EM}.</p>
            <p className="lead pv-intro">
              Esta página explica, de forma direta, quais dados pessoais o stu. música recebe, para que servem, com
              quem são compartilhados, por quanto tempo ficam guardados e como você exerce seus direitos.
            </p>
          </Revelar>
        </div>
      </section>

      <section className="pv-corpo">
        <div className="container container--texto">
          {SECOES.map(s => (
            <section key={s.titulo} className="pv-secao">
              <h2>{s.titulo}</h2>
              {s.corpo}
            </section>
          ))}
          <Link to="/contato" className="pv-voltar">← Voltar para o contato</Link>
        </div>
      </section>

      <style>{`
        .pv-cabeca { padding: clamp(64px, 10vw, 120px) 0 24px; }
        .pv-titulo { margin-top: 24px; }
        .pv-atualizada { margin-top: 16px; font-size: 14px; color: var(--stu-cream-50); }
        .pv-intro { margin-top: 24px; }
        .pv-corpo { padding-bottom: clamp(80px, 12vw, 140px); }
        .pv-secao { padding: 32px 0; border-top: 1px solid var(--stu-cream-12); }
        .pv-secao h2 {
          margin-bottom: 16px;
          font-size: clamp(20px, 2.4vw, 26px);
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .pv-secao p, .pv-secao li { font-size: 16px; font-weight: 300; line-height: 1.75; color: var(--stu-cream-70); }
        .pv-secao p + p { margin-top: 12px; }
        .pv-secao ul { list-style: disc; padding-left: 22px; margin: 12px 0; }
        .pv-secao li { margin-bottom: 6px; }
        .pv-secao strong { color: var(--stu-cream); font-weight: 700; }
        .pv-secao a, .pv-link {
          color: var(--stu-cream);
          text-decoration: underline;
          text-underline-offset: 3px;
          font-weight: 400;
        }
        .pv-secao a:hover, .pv-link:hover { color: var(--stu-orange); }
        .pv-link { display: inline; padding: 0; font-size: inherit; line-height: inherit; }
        .pv-voltar {
          display: inline-block;
          margin-top: 32px;
          font-size: 14px;
          color: var(--stu-cream-70);
          border-bottom: 1px solid var(--stu-cream-30);
        }
        .pv-voltar:hover { color: var(--stu-orange); border-color: var(--stu-orange); }
      `}</style>
    </>
  )
}
