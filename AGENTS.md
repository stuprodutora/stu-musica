# stu. música — guia do repositório

Site musica.produtorastu.com: React 19 + Vite, deploy na Vercel a partir de
`main`. Lê o **mesmo Supabase do produtorastu.com** (só leitura, chave anon).

Toda mudança entra por PR — mesclar em `main` é publicar.

---

## 1. Tráfego do Supabase — a regra que não se negocia

O Supabase está no plano grátis: **5 GB de tráfego (egress) por mês, divididos
com o produtorastu.com**. A cota já estourou uma vez (5,98 GB, issue #58 do
stu-producoes): o painel baixava capas originais para mostrar miniaturas.

Regras:

- **Nenhum arquivo do Supabase é baixado sem ação do visitante, a não ser
  imagem otimizada.** Áudio só desce quando alguém aperta play.
- **Imagem sempre por `imagemOtimizada()`** (`src/lib/imagem.js`) ou pelo
  componente `Capa`. Nunca `thumbnail_url` direto num `src` — nem em lugares
  "invisíveis", como a capa da Media Session (tela de bloqueio).
- **Waveform sai de `public/picos.json`** (Vercel) **ou de `projeto_faixas.picos`**
  (gravado pelo painel do produtorastu.com no upload; ~2 KB, buscado só para
  a faixa na tela) — ver `src/lib/picos.js`. O wavesurfer
  baixa o áudio inteiro para desenhar sozinho; antes dos picos prontos, o
  `/musicas` custava 12,5 MB por visita sem ninguém tocar nada.
- **Faixa enviada pelo painel já tem a onda** (calculada no navegador de quem
  sobe o arquivo). `npm run picos` só é preciso para faixa que entrou por outro
  caminho; ele atualiza o `public/picos.json`. É incremental: baixa só as faixas novas, uma vez.
  Requer ffmpeg. Faixa sem picos continua funcionando: a onda aparece quando
  ela toca (o áudio já está descendo nessa hora).

Medido em 02/10/2026, depois da correção:

| Cenário | Supabase |
|---|---|
| Home, rolando até o fim | 0,03 MB |
| /musicas, rolando até o fim | 0,21 MB |
| Visita típica (home → músicas → serviços) | 0,23 MB |
| Tocar uma faixa (prévia de 1 min) | ~1,4 MB |

Mexeu em algo que carrega mídia? **Meça antes de abrir o PR**: some os bytes
das respostas de `*.supabase.co` no DevTools (aba Network, filtro
`supabase.co`) rolando a página inteira sem tocar nada. O número precisa
ficar na casa das centenas de KB.

## 2. LGPD — Google Analytics só com consentimento

- **Nunca cole o snippet do GA no `index.html`.** Ele carregaria o GA e
  gravaria cookies antes de o visitante escolher. O gtag é injetado por
  `src/lib/analytics.js` depois do "Aceitar" do `AvisoCookies`. O
  `npm test` falha se o snippet voltar para o `index.html`.
- "Aceitar" e "Recusar" têm o mesmo peso visual (guia de cookies da ANPD).
- "Preferências de cookies" (rodapé e Política) revoga a qualquer momento:
  o GA para e os cookies dele são apagados.
- Os cookies ficam só em `musica.produtorastu.com`, nunca em
  `.produtorastu.com`. O site principal tem consentimento próprio.
- **Ferramenta, cookie ou dado novo?** Atualize `src/pages/Privacidade.jsx`
  e suba `VERSAO_AVISO` em `lib/analytics.js` para perguntar de novo.

## 3. O player

Um único `<audio>` no site (módulo `contexts/MusicPlayerContext.jsx`), acima
do roteador: o som continua entre páginas. O wavesurfer **não toca** — só
desenha a onda e espelha o tempo do player global. Detalhes nos comentários
de `components/AudioPlayer.jsx`.

## 4. Dados

**Quem decide o que aparece aqui é o painel**: `projetos.site = 'musica'`
(área "stu. música" do /admin do produtorastu.com — e esses projetos não
aparecem mais lá). Além disso: ao menos uma faixa e nenhum audiobook. Antes
da coluna existir, vale o recorte antigo (categorias `audio` e
`producao-musical`, sem vídeo). Tudo em `src/lib/catalogo.js`. **Audiobook é do produtorastu.com**, não
deste site: a página de Serviços só aponta para lá (`AUDIOBOOK_URL`). Os slugs públicos de serviço não batem com os do banco — a ponte
fica em `src/lib/servicos.js`.

## 5. Identidade visual

Mesmas regras do site principal: cantos retos, Magallanes, paleta navy /
laranja / creme, larguras 1200 e 900. O `html` é o único rolador e o
`#stu-fundo` é sticky (quique do iOS) — ver `src/styles/global.css`.
