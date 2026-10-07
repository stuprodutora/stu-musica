// ─── Picos das waveforms ────────────────────────────────────────────────────
//
// A onda de uma faixa sai, nesta ordem (da mais barata para a mais cara):
//
//   1. public/picos.json — servido pela Vercel, nada do Supabase. Cobre as
//      faixas antigas; gerado por `npm run picos` (scripts/gerar-picos.mjs).
//   2. projeto_faixas.picos — gravado pelo painel do produtorastu.com no
//      upload de cada faixa nova (calculado no navegador de quem sobe o
//      arquivo). ~2 KB, buscado só para a faixa que aparece na tela.
//   3. nenhum dos dois: o AudioPlayer só desenha a onda depois do play,
//      quando o áudio já está descendo para tocar.
//
// Por que tanto cuidado: o wavesurfer baixa o áudio inteiro para desenhar, e
// a cota de tráfego do Supabase (5 GB/mês) é dividida com o produtorastu.com.
//
// Formato nos dois lugares: { d: duração em segundos, p: [picos 0–100] }

import { supabase } from './supabase'

let pedidoArquivo = null
const doBanco = new Map() // faixa.id → Promise<picos | null>

export function carregarPicos() {
  if (!pedidoArquivo) {
    pedidoArquivo = fetch('/picos.json')
      .then(r => (r.ok ? r.json() : {}))
      .catch(() => ({}))
  }
  return pedidoArquivo
}

// Faixa "virtual" (áudio no próprio projeto, sem linha em projeto_faixas)
const temLinhaNoBanco = id => id && !String(id).startsWith('projeto-')

export async function picosDaFaixa(faixa) {
  const mapa = await carregarPicos()
  if (mapa[faixa.audio_url]) return mapa[faixa.audio_url]
  if (!temLinhaNoBanco(faixa.id)) return null

  if (!doBanco.has(faixa.id)) {
    doBanco.set(faixa.id, supabase
      .from('projeto_faixas')
      .select('picos')
      .eq('id', faixa.id)
      .maybeSingle()
      // Sem a coluna (antes da migração) ou sem picos: o site cai no item 3
      .then(({ data, error }) => (!error && data?.picos?.p?.length ? data.picos : null))
      .catch(() => null))
  }
  return doBanco.get(faixa.id)
}
