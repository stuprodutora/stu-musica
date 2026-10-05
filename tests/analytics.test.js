import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  GA_ID, VERSAO_AVISO, lerEscolha, gravarEscolha,
  ativarAnalytics, registrarPagina, desativarAnalytics, cookiesDoGA, dominiosDoSite,
} from '../src/lib/analytics.js'

// ── Dublês de navegador ─────────────────────────────────────────────────────

function armazenamentoFalso(inicial = {}) {
  const dados = { ...inicial }
  return {
    dados,
    getItem: k => (k in dados ? dados[k] : null),
    setItem: (k, v) => { dados[k] = String(v) },
  }
}

function navegadorFalso({ cookies = '' } = {}) {
  const escritas = []
  const scripts = []
  const doc = {
    title: 'Músicas — stu. música',
    head: { appendChild: el => scripts.push(el) },
    createElement: tag => ({ tag }),
    get cookie() { return cookies },
    set cookie(v) { escritas.push(v) },
  }
  const win = { location: { origin: 'https://musica.produtorastu.com', hostname: 'musica.produtorastu.com' } }
  return { win, doc, escritas, scripts }
}

const chamadas = win => win.dataLayer.map(a => Array.from(a))
const recomecarGtag = win => { win.dataLayer = []; win.gtag = function () { win.dataLayer.push(arguments) } }

// ── O snippet não pode voltar para o index.html ─────────────────────────────

test('index.html não carrega o Google Analytics (só depois do consentimento, via lib/analytics)', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8')
  assert.doesNotMatch(html, /googletagmanager|gtag\(|G-[A-Z0-9]{8,}/)
})

// ── Escolha do visitante ────────────────────────────────────────────────────

test('sem escolha, sem versão atual ou com lixo gravado: pergunta de novo', () => {
  assert.equal(lerEscolha(armazenamentoFalso()), null)
  assert.equal(lerEscolha(armazenamentoFalso({ stu_cookies: JSON.stringify({ v: VERSAO_AVISO - 1, escolha: 'aceito' }) })), null)
  assert.equal(lerEscolha(armazenamentoFalso({ stu_cookies: '{quebrado' })), null)
})

test('a escolha é gravada com versão e data (prova do consentimento)', () => {
  const arm = armazenamentoFalso()
  gravarEscolha('recusado', arm, new Date('2026-10-05T12:00:00Z'))
  assert.equal(lerEscolha(arm), 'recusado')
  assert.deepEqual(JSON.parse(arm.dados.stu_cookies), { v: VERSAO_AVISO, escolha: 'recusado', em: '2026-10-05T12:00:00.000Z' })
})

test('navegação privada que não deixa gravar não quebra o site', () => {
  const travado = { getItem: () => { throw new Error('SecurityError') }, setItem: () => { throw new Error('SecurityError') } }
  assert.equal(lerEscolha(travado), null)
  assert.doesNotThrow(() => gravarEscolha('aceito', travado))
})

// ── Ligar, registrar, desligar (em sequência) ───────────────────────────────

test('antes de ativar, registrar página não envia nada', () => {
  const { win, doc } = navegadorFalso()
  win.gtag = () => assert.fail('enviou sem consentimento')
  registrarPagina('/', win, doc)
})

test('ativar injeta o gtag uma vez, sem anúncios e com cookie só neste host', () => {
  const { win, doc, scripts } = navegadorFalso()
  ativarAnalytics(win, doc)
  ativarAnalytics(win, doc)

  assert.equal(scripts.length, 1)
  assert.equal(scripts[0].src, `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`)

  const [consent, , config] = chamadas(win)
  assert.equal(consent[2].ad_storage, 'denied')
  assert.equal(consent[2].ad_user_data, 'denied')
  assert.equal(consent[2].ad_personalization, 'denied')
  assert.equal(config[1], GA_ID)
  assert.equal(config[2].send_page_view, false)
  assert.equal(config[2].allow_google_signals, false)
  assert.equal(config[2].cookie_domain, 'musica.produtorastu.com', 'nunca em .produtorastu.com (cookie do site principal)')
})

test('page_view leva só o caminho, sem query string', () => {
  const { win, doc } = navegadorFalso()
  ativarAnalytics(win, doc)
  recomecarGtag(win)
  registrarPagina('/musicas', win, doc)
  assert.deepEqual(chamadas(win), [['event', 'page_view', {
    page_location: 'https://musica.produtorastu.com/musicas',
    page_path: '/musicas',
    page_title: 'Músicas — stu. música',
  }]])
})

test('revogar para o envio e apaga só os cookies do GA deste site', () => {
  const { win, doc, escritas } = navegadorFalso({ cookies: '_ga=GA1.1.1; stu_x=1; _ga_F9DZLCJG4V=GS1.1' })
  ativarAnalytics(win, doc)
  recomecarGtag(win)

  desativarAnalytics(win, doc)
  registrarPagina('/musicas', win, doc)
  assert.equal(win.dataLayer.length, 0)

  assert.ok(escritas.includes('_ga=; Max-Age=0; path=/; domain=.musica.produtorastu.com'))
  assert.ok(escritas.includes('_ga_F9DZLCJG4V=; Max-Age=0; path=/'))
  assert.ok(!escritas.some(e => e.endsWith('domain=.produtorastu.com')), 'não toca no domínio-pai (cookie do www.)')
  assert.ok(!escritas.some(e => e.startsWith('stu_x=')), 'só apaga cookie do GA')
})

test('aceitar de novo depois de revogar volta a enviar', () => {
  const { win, doc } = navegadorFalso()
  desativarAnalytics(win, doc)
  ativarAnalytics(win, doc)
  assert.equal(win[`ga-disable-${GA_ID}`], false)
})

// ── Auxiliares ──────────────────────────────────────────────────────────────

test('reconhece só os cookies do GA', () => {
  assert.deepEqual(cookiesDoGA('_ga=1; _ga_ABC=2; stu_cookies=5; galinha=6'), ['_ga', '_ga_ABC'])
})

test('domínios apagados são só os do próprio host', () => {
  assert.deepEqual(dominiosDoSite('musica.produtorastu.com'), ['', 'musica.produtorastu.com', '.musica.produtorastu.com'])
  assert.deepEqual(dominiosDoSite('localhost'), [''])
})
