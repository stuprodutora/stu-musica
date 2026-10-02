// ─── Picos das waveforms ────────────────────────────────────────────────────
//
// Gera public/picos.json com a forma de onda de cada faixa publicada.
//
// POR QUE EXISTE: para desenhar a onda sozinho, o wavesurfer baixa o arquivo
// de áudio inteiro. No /musicas isso eram ~12 MB do Supabase por visita, sem
// ninguém apertar play — a cota grátis de tráfego (5 GB/mês, dividida com o
// produtorastu.com) acabaria em ~400 visitas. Já estouramos essa cota uma vez
// (issue #58 do stu-producoes). Com os picos prontos, a onda vem da Vercel e o
// Supabase só entrega áudio para quem aperta play.
//
// QUANDO RODAR: depois de cadastrar ou trocar faixas no painel.
//   npm run picos
// É incremental: só baixa as faixas que ainda não estão no arquivo (cada uma
// uma única vez) e remove as que saíram do banco. Depois, commit + deploy.
// Faixa sem picos continua funcionando: a onda aparece quando ela toca.
//
// Requer o ffmpeg instalado (https://ffmpeg.org) e o .env.local com as
// variáveis do Supabase.

import { spawn } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'

const ARQUIVO = new URL('../public/picos.json', import.meta.url)
const PONTOS = 600       // resolução da onda (barras de 2px + 2px de vão cabem folgadas)
const TAXA = 8000        // Hz — só para medir amplitude, não precisa de mais

try { process.loadEnvFile(new URL('../.env.local', import.meta.url)) } catch { /* usa o ambiente */ }
const { VITE_SUPABASE_URL: URL_SB, VITE_SUPABASE_ANON_KEY: CHAVE } = process.env
if (!URL_SB || !CHAVE) {
  console.error('Faltam VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (.env.local).')
  process.exit(1)
}

async function consultar(caminho) {
  const r = await fetch(`${URL_SB}/rest/v1/${caminho}`, { headers: { apikey: CHAVE, Authorization: `Bearer ${CHAVE}` } })
  if (!r.ok) throw new Error(`${caminho}: HTTP ${r.status}`)
  return r.json()
}

// Mesmas fontes de áudio que o site usa (lib/catalogo.js): as faixas e, só
// nos projetos antigos SEM faixa cadastrada, o audio_url do próprio projeto
async function urlsDeAudio() {
  const [faixas, projetos] = await Promise.all([
    consultar('projeto_faixas?select=nome,audio_url,projeto_id'),
    consultar('projetos?select=id,titulo,audio_url&publicado=eq.true&audio_url=not.is.null'),
  ])
  const mapa = new Map()
  const comFaixa = new Set()
  for (const f of faixas) {
    if (!f.audio_url) continue
    mapa.set(f.audio_url, f.nome)
    comFaixa.add(f.projeto_id)
  }
  for (const p of projetos) {
    if (!comFaixa.has(p.id) && !mapa.has(p.audio_url)) mapa.set(p.audio_url, p.titulo)
  }
  return mapa
}

// Decodifica com o ffmpeg (mono, 8 kHz, PCM 16 bits) e reduz a PONTOS picos
function calcularPicos(url) {
  return new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', ['-v', 'error', '-i', url, '-ac', '1', '-ar', String(TAXA), '-f', 's16le', '-'])
    const pedacos = []
    let erro = ''
    ff.stdout.on('data', c => pedacos.push(c))
    ff.stderr.on('data', c => { erro += c })
    ff.on('error', reject)
    ff.on('close', codigo => {
      if (codigo !== 0) return reject(new Error(erro.trim() || `ffmpeg saiu com ${codigo}`))
      const buf = Buffer.concat(pedacos)
      const amostras = new Int16Array(buf.buffer, buf.byteOffset, Math.floor(buf.length / 2))
      const porPonto = Math.max(1, Math.floor(amostras.length / PONTOS))
      const picos = []
      let maximo = 0
      for (let i = 0; i < PONTOS; i++) {
        let pico = 0
        const fim = Math.min(amostras.length, (i + 1) * porPonto)
        for (let j = i * porPonto; j < fim; j++) {
          const v = Math.abs(amostras[j])
          if (v > pico) pico = v
        }
        picos.push(pico)
        if (pico > maximo) maximo = pico
      }
      // Normalizado em inteiros 0–100: o arquivo fica pequeno
      resolve({
        d: Math.round((amostras.length / TAXA) * 100) / 100,
        p: picos.map(v => (maximo ? Math.round((v / maximo) * 100) : 0)),
      })
    })
  })
}

const atual = JSON.parse(await readFile(ARQUIVO, 'utf8').catch(() => '{}'))
const urls = await urlsDeAudio()
const novo = {}
let baixadas = 0
let falhas = 0

for (const [url, nome] of urls) {
  if (atual[url]) { novo[url] = atual[url]; continue }
  process.stdout.write(`↓ ${nome} … `)
  try {
    novo[url] = await calcularPicos(url)
    baixadas++
    console.log(`${novo[url].d}s`)
  } catch (e) {
    falhas++
    console.log(`falhou (${e.message.split('\n')[0]})`)
  }
}

const removidas = Object.keys(atual).filter(u => !urls.has(u)).length
await writeFile(ARQUIVO, JSON.stringify(novo) + '\n')

console.log(`\n${Object.keys(novo).length} faixas em public/picos.json — ${baixadas} novas, ${removidas} removidas, ${falhas} com falha.`)
if (baixadas || removidas) console.log('Agora faça commit e deploy para a onda aparecer no site.')
