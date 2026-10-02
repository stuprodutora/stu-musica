// ─── Picos pré-calculados das waveforms ─────────────────────────────────────
//
// public/picos.json é gerado por `npm run picos` (scripts/gerar-picos.mjs) e
// servido pela Vercel. Com ele, a onda é desenhada sem baixar o áudio do
// Supabase — o Supabase só entrega áudio para quem aperta play. Ver o
// comentário do script para o porquê (cota de tráfego).
//
// Formato: { [audio_url]: { d: duração em segundos, p: [picos 0–100] } }

let pedido = null

export function carregarPicos() {
  if (!pedido) {
    pedido = fetch('/picos.json')
      .then(r => (r.ok ? r.json() : {}))
      .catch(() => ({}))
  }
  return pedido
}
