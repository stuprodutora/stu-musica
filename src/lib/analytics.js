// ─── Google Analytics, só com consentimento (LGPD) ──────────────────────────
//
// Cookie de análise não é essencial: pela LGPD (e pelo guia de cookies da
// ANPD) ele só pode ser gravado depois que o visitante aceita, e recusar tem
// que ser tão fácil quanto aceitar. Por isso o gtag NÃO fica no index.html:
// ele só é injetado aqui, depois do "Aceitar" (componente AvisoCookies).
// Antes disso, nenhuma requisição ao Google e nenhum cookie. Um teste
// (tests/analytics.test.js) falha se o snippet voltar para o index.html.
//
// Mesma lógica do produtorastu.com (stu-producoes, src/lib/analytics.js),
// com propriedade e consentimento próprios: a escolha feita num site não vale
// para o outro, e os cookies ficam só no host de cada um.
//
// Mudou o uso (outra ferramenta, outra finalidade, outro cookie)? Suba
// VERSAO_AVISO para perguntar de novo a todos e atualize a Política de
// Privacidade (pages/Privacidade.jsx).
//
// Configuração que fica no próprio Google Analytics (Admin), não no código:
//   - Fluxos de dados → Medição otimizada → Visualizações de página →
//     DESLIGAR "alterações de página com base em eventos do histórico".
//     As visualizações são enviadas daqui (registrarPagina); com a opção
//     ligada, cada página seria contada duas vezes.
//   - Coleta de dados: Google Signals desligado.
//   - Retenção de dados: 2 meses (é o que a Política de Privacidade diz).

export const GA_ID = 'G-F9DZLCJG4V'
export const VERSAO_AVISO = 1

const CHAVE = 'stu_cookies'
const DESLIGA = `ga-disable-${GA_ID}` // chave oficial de opt-out do gtag
const UM_ANO = 60 * 60 * 24 * 365

// ── Escolha do visitante ────────────────────────────────────────────────────
// Guarda a escolha, a versão do aviso e a data: o controlador precisa poder
// demonstrar o consentimento (LGPD, art. 8º, § 2º).

export function lerEscolha(armazenamento = globalThis.localStorage) {
  try {
    const salvo = JSON.parse(armazenamento.getItem(CHAVE))
    if (salvo?.v !== VERSAO_AVISO) return null
    return salvo.escolha === 'aceito' || salvo.escolha === 'recusado' ? salvo.escolha : null
  } catch {
    return null
  }
}

export function gravarEscolha(escolha, armazenamento = globalThis.localStorage, agora = new Date()) {
  try {
    armazenamento.setItem(CHAVE, JSON.stringify({ v: VERSAO_AVISO, escolha, em: agora.toISOString() }))
  } catch { /* navegação privada: vale só para esta visita */ }
}

// ── Liga e desliga ──────────────────────────────────────────────────────────

let injetado = false

export function ativarAnalytics(win = window, doc = document) {
  win[DESLIGA] = false
  if (injetado) return
  injetado = true

  win.dataLayer = win.dataLayer || []
  // O gtag.js exige o objeto `arguments`, não um array
  win.gtag = function gtag() { win.dataLayer.push(arguments) }

  // Só análise: nada de anúncio, mesmo que alguém ligue algo no painel do GA
  win.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
  win.gtag('js', new Date())
  win.gtag('config', GA_ID, {
    send_page_view: false,              // registrarPagina envia a cada troca de página
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: UM_ANO,             // padrão do GA é 2 anos
    // Só neste host, nunca em .produtorastu.com (compartilhado com o site
    // principal, que tem consentimento próprio). 'none' = localhost.
    cookie_domain: win.location.hostname.includes('.') ? win.location.hostname : 'none',
  })

  const script = doc.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  doc.head.appendChild(script)
}

export function registrarPagina(pathname, win = window, doc = document) {
  if (!injetado || win[DESLIGA]) return
  win.gtag('event', 'page_view', {
    // Só o caminho: query string e âncora ficam de fora
    page_location: win.location.origin + pathname,
    page_path: pathname,
    page_title: doc.title,
  })
}

// Revogação: para de enviar na hora e apaga os cookies do GA deste site
export function desativarAnalytics(win = window, doc = document) {
  win[DESLIGA] = true
  for (const nome of cookiesDoGA(doc.cookie)) {
    for (const dominio of dominiosDoSite(win.location.hostname)) {
      doc.cookie = `${nome}=; Max-Age=0; path=/${dominio ? `; domain=${dominio}` : ''}`
    }
  }
}

export function cookiesDoGA(textoCookies = '') {
  return textoCookies
    .split(';')
    .map(c => c.split('=')[0].trim())
    .filter(nome => nome === '_ga' || nome.startsWith('_ga_') || nome === '_gid' || nome === '_gat')
}

// Um cookie só é apagado informando o mesmo domínio com que foi gravado: o
// host (com ou sem ponto) ou nenhum (localhost). Nunca o domínio-pai.
export function dominiosDoSite(hostname = '') {
  if (!hostname.includes('.')) return ['']
  return ['', hostname, '.' + hostname]
}

// ── Reabrir o aviso (rodapé e Política de Privacidade) ─────────────────────

export const EVENTO_PREFERENCIAS = 'stu:preferencias-cookies'

export function abrirPreferenciasCookies() {
  window.dispatchEvent(new Event(EVENTO_PREFERENCIAS))
}
