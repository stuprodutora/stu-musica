// ─── Imagens otimizadas ─────────────────────────────────────────────────────
//
// O bucket guarda os originais como foram enviados — há thumbnails de vários
// megapixels lá. O endpoint /render/image do Supabase devolve a versão
// redimensionada (e em WebP, quando o navegador aceita).
//
// ATENÇÃO: passar só `width` NÃO preserva a proporção — o Supabase mantém a
// altura original e espreme a imagem. Por isso `resize=contain` (ou `cover`
// quando a altura também é informada).
//
// URLs de fora do bucket (capas do Spotify, CDNs de terceiros) passam intactas.

const MARCADOR = '/storage/v1/object/public/'

export function imagemOtimizada(url, largura = 800, opcoes = {}) {
  if (!url || typeof url !== 'string') return url
  if (!url.includes(MARCADOR)) return url

  const params = new URLSearchParams({
    width: String(largura),
    quality: String(opcoes.qualidade ?? 72),
  })

  if (opcoes.altura) {
    params.set('height', String(opcoes.altura))
    params.set('resize', opcoes.resize ?? 'cover')
  } else {
    params.set('resize', 'contain')
  }

  return url.replace(MARCADOR, '/storage/v1/render/image/public/') + '?' + params.toString()
}

// Larguras pensadas para telas 2x: o dobro do espaço que a imagem ocupa.
export const LARGURAS = {
  miniatura: 160,   // capa no player global e em listas compactas
  capa: 720,        // capa dos projetos no portfólio
}
