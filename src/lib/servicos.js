// ─── Serviços musicais ──────────────────────────────────────────────────────
//
// O texto de cada serviço é autoral e fica aqui. Do banco vêm só a descrição
// curta cadastrada no admin (quando existe) e os projetos que exemplificam o
// serviço.
//
// Os slugs públicos (`producao-musical`, `arranjo-musical`) não batem com os
// do banco: lá, "produção musical" é uma CATEGORIA e o serviço de arranjo tem
// slug `arranjo`. `slugsBanco` faz essa ponte; `exemplo` decide quais projetos
// do portfólio ilustram o serviço.

export const SERVICOS = [
  {
    slug: 'producao-musical',
    slugsBanco: ['producao-musical'],
    numero: '01',
    nome: 'Produção musical',
    chamada: 'Da ideia no celular à faixa pronta para as plataformas.',
    descricao:
      'A gente entra no projeto como parceiro criativo: escuta a música crua, entende de onde ela vem e desenha com você o som que ela pede. Pré-produção, direção de gravação, edição, mixagem e masterização — tudo sob o mesmo teto e com a mesma escuta do começo ao fim.',
    paraQuem: [
      'Artistas lançando um single, EP ou álbum',
      'Compositores com canções guardadas no violão',
      'Bandas que querem soar como soam ao vivo — ou melhor',
    ],
    entregas: ['Pré-produção', 'Gravação', 'Edição', 'Mixagem', 'Masterização'],
    exemplo: p => p.tipo === 'musica',
  },
  {
    slug: 'arranjo-musical',
    slugsBanco: ['arranjo'],
    numero: '02',
    nome: 'Arranjo musical',
    chamada: 'A forma certa para a canção que você já tem.',
    descricao:
      'Harmonia, instrumentação, dinâmica e estrutura pensadas para servir à música, não para enfeitá-la. Pode ser uma releitura, uma versão acústica, uma base completa para gravar ou o arranjo de cordas que faltava no refrão.',
    paraQuem: [
      'Cantores e compositores que precisam de base',
      'Bandas buscando uma nova roupagem para o repertório',
      'Projetos de releitura, versão ou feat',
    ],
    entregas: ['Harmonia', 'Instrumentação', 'Estrutura', 'Partituras e guias'],
    exemplo: p => p.servicos.some(s => s.slug === 'arranjo'),
  },
  {
    slug: 'trilhas-sonoras',
    slugsBanco: ['trilhas-sonoras'],
    numero: '03',
    nome: 'Trilhas sonoras',
    chamada: 'Música original que conta a história junto com a imagem.',
    descricao:
      'Composição sob medida para filme, documentário, série, animação, espetáculo ou podcast. Cada trilha nasce do roteiro e do corte: tempo, respiro e emoção ajustados cena a cena, com mixagem pronta para a entrega final.',
    paraQuem: [
      'Diretores e produtoras de cinema e documentário',
      'Animações, games e espetáculos',
      'Podcasts e projetos autorais que precisam de identidade sonora',
    ],
    entregas: ['Composição original', 'Temas e variações', 'Mixagem para entrega', 'Stems'],
    exemplo: p => p.tipo === 'trilha',
  },
  {
    slug: 'audiobook',
    slugsBanco: ['audiobook'],
    numero: '04',
    nome: 'Audiobook',
    chamada: 'A sua história contada com o cuidado de um disco.',
    descricao:
      'Gravação, direção de narração, edição, desenho de som e masterização dentro dos padrões das plataformas de audiolivro. Para quem quer que o livro seja ouvido com a mesma atenção com que foi escrito.',
    paraQuem: [
      'Autores independentes',
      'Editoras',
      'Livros infantis com trilha e efeitos',
    ],
    entregas: ['Gravação', 'Direção de narração', 'Edição', 'Trilha e SFX', 'Masterização'],
    exemplo: p => p.tipo === 'audiobook',
  },
]

export const SLUGS_BANCO = SERVICOS.flatMap(s => s.slugsBanco)

export function mensagemOrcamento(servico) {
  return `Olá! Vim pelo stu. música e quero um orçamento de ${servico.nome.toLowerCase()}.`
}
