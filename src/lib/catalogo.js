// ─── Catálogo musical ───────────────────────────────────────────────────────
//
// Este site lê as mesmas tabelas do produtorastu.com, mas só o recorte
// musical. As regras do recorte vivem aqui, num lugar só.
//
// Quem decide é o painel: projetos.site = 'musica' (área "stu. música" do
// /admin do produtorastu.com; migração 2026-10-07_site_musica.sql lá). Além
// disso, o projeto precisa ter faixa tocável e não ser audiobook.
//
// Enquanto a coluna `site` não existir no banco, vale o recorte antigo:
//
//   1. O projeto pertence a uma categoria musical (`audio` ou
//      `producao-musical` — os singles e EPs ficam nesta última).
//   2. Nenhum serviço vinculado é da categoria `video` — captação, vídeo
//      institucional, drone etc. ficam de fora mesmo que o projeto tenha
//      trilha ou mixagem.
//   3. Não é audiobook: esse serviço fica no produtorastu.com.
//   4. Tem ao menos uma faixa tocável. Este portfólio é um player; projeto que
//      só tem vídeo embedado não tem o que tocar aqui.
//
// `projeto_faixas` é a fonte única do áudio (mesma regra do site principal).
// Projetos antigos com o áudio direto no registro viram uma faixa virtual.

import { supabase } from './supabase'

export const CATEGORIAS_MUSICAIS = ['audio', 'producao-musical']
const CATEGORIA_EXCLUIDA = 'video'
const SITE_MUSICA = 'musica'
const SERVICO_EXCLUIDO = 'audiobook' // atendido pelo produtorastu.com

// O Supabase pode devolver a relação embutida como objeto ou como array
function slugDe(relacao) {
  if (!relacao) return null
  return Array.isArray(relacao) ? relacao[0]?.slug ?? null : relacao.slug ?? null
}

// "DRAMA | EP" → { nome: 'DRAMA', formato: 'EP' }
export function separarTitulo(titulo = '') {
  const [nome, ...resto] = titulo.split('|')
  return { nome: nome.trim(), formato: resto.join('|').trim() || null }
}

// Classificação usada nos filtros do portfólio
export const TIPOS = {
  musica: 'Música',
  trilha: 'Trilha sonora',
}

function tipoDoProjeto(slugsServicos) {
  if (slugsServicos.includes('trilhas-sonoras')) return 'trilha'
  return 'musica'
}

function faixasDoProjeto(projeto) {
  const lista = [...(projeto.projeto_faixas || [])]
    .filter(f => f.audio_url)
    .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))

  if (lista.length > 0) return lista

  // Só `audio_url`: `embed_url` costuma ser vídeo do Drive/YouTube
  if (projeto.audio_url) {
    return [{
      id: `projeto-${projeto.id}`,
      nome: separarTitulo(projeto.titulo).nome,
      audio_url: projeto.audio_url,
      spotify_url: projeto.spotify_url || null,
      ordem: 0,
    }]
  }

  return []
}

// "FAIXA 1", "Track 02": nome de arquivo, não de música
const NOME_GENERICO = /^(faixa|track|audio|áudio)s*d*$/i

// Num single, a faixa genérica leva o nome do projeto. Numa playlist isso
// repetiria o mesmo nome em todas — lá ela só deixa de gritar: "Faixa 1".
function nomeDaFaixa(nomeFaixa, nomeProjeto, totalFaixas) {
  const n = nomeFaixa?.trim()
  if (!n) return nomeProjeto
  if (!NOME_GENERICO.test(n)) return n
  if (totalFaixas === 1) return nomeProjeto
  return n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()
}

function normalizar(projeto) {
  const servicos = (projeto.projeto_servicos || [])
    .map(ps => ps.servicos)
    .filter(Boolean)

  const { nome, formato } = separarTitulo(projeto.titulo)
  const capa = projeto.thumbnail_url || null
  const artista = projeto.cliente?.trim() || 'STU'

  const lista = faixasDoProjeto(projeto)
  const faixas = lista.map(f => ({
    id: String(f.id),
    nome: nomeDaFaixa(f.nome, nome, lista.length),
    audio_url: f.audio_url,
    spotify_url: f.spotify_url || null,
    // Dados de exibição para o player global
    artista,
    capa,
    projetoId: projeto.id,
    projetoNome: nome,
  }))

  return {
    id: projeto.id,
    // undefined enquanto a coluna não existe (ver ehMusical)
    site: projeto.site,
    slug: projeto.slug || String(projeto.id),
    nome,
    formato,
    artista,
    descricao: projeto.descricao || projeto.resumo_curto || '',
    capa,
    destaque: !!projeto.destaque,
    ordem: typeof projeto.ordem_exibicao === 'number' ? projeto.ordem_exibicao : -Infinity,
    criadoEm: projeto.criado_em || '',
    categoria: slugDe(projeto.categorias),
    servicos: servicos.map(s => ({ id: s.id, nome: s.nome, slug: s.slug, categoria: slugDe(s.categorias) })),
    tipo: tipoDoProjeto(servicos.map(s => s.slug)),
    faixas,
  }
}

function ehMusical(p) {
  if (p.faixas.length === 0) return false
  if (p.servicos.some(s => s.slug === SERVICO_EXCLUIDO)) return false
  // Com a coluna `site` no banco, a escolha do painel manda
  if (p.site !== undefined) return p.site === SITE_MUSICA
  // Sem ela (antes da migração), o recorte por categoria e serviço
  return CATEGORIAS_MUSICAIS.includes(p.categoria)
    && !p.servicos.some(s => s.categoria === CATEGORIA_EXCLUIDA)
}

// Prioridade manual (ordem_exibicao, a mesma do admin) > destaque > mais recente.
// Ordenado no cliente, não na query: uma coluna que ainda não existe derrubaria
// a página inteira.
function comparar(a, b) {
  if (a.ordem !== b.ordem) return b.ordem - a.ordem
  if (a.destaque !== b.destaque) return a.destaque ? -1 : 1
  return b.criadoEm.localeCompare(a.criadoEm)
}

let pedido = null

// Uma busca só por visita: Home, Músicas e Serviços compartilham o resultado.
export function carregarProjetosMusicais() {
  if (!pedido) {
    pedido = supabase
      .from('projetos')
      .select('*, categorias(slug), projeto_faixas(id, nome, audio_url, spotify_url, ordem), projeto_servicos(servicos(id, nome, slug, categorias(slug)))')
      .eq('publicado', true)
      .then(({ data, error }) => {
        if (error) throw error
        return (data || []).map(normalizar).filter(ehMusical).sort(comparar)
      })
      .catch(err => {
        pedido = null // deixa a próxima tentativa buscar de novo
        throw err
      })
  }
  return pedido
}

// Descrições curtas cadastradas no admin, por slug (serviços e categorias)
export async function carregarDescricoesServicos(slugs) {
  const [servicos, categorias] = await Promise.all([
    supabase.from('servicos').select('slug, descricao_curta').in('slug', slugs),
    supabase.from('categorias').select('slug, descricao').in('slug', slugs),
  ])
  const mapa = {}
  for (const c of categorias.data || []) if (c.descricao) mapa[c.slug] = c.descricao
  for (const s of servicos.data || []) if (s.descricao_curta) mapa[s.slug] = s.descricao_curta
  return mapa
}
