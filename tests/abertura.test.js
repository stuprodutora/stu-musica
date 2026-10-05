import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'

const lerIndex = () => readFile(new URL('../index.html', import.meta.url), 'utf8')

const trechoDaAbertura = html => {
  const ini = html.indexOf('<div id="stu-loader"')
  const fim = html.indexOf('<div id="stu-fundo"')
  assert.ok(ini >= 0 && fim > ini, 'a abertura (#stu-loader) precisa vir antes do #stu-fundo no index.html')
  return html.slice(ini, fim)
}

test('toda imagem da abertura existe em public/ (a abertura aparece antes do bundle)', async () => {
  const abertura = trechoDaAbertura(await lerIndex())
  const imagens = [...new Set([...abertura.matchAll(/src="\/([^"]+)"/g)].map(m => m[1]))]
  assert.ok(imagens.length > 0)
  for (const arquivo of imagens) {
    await assert.doesNotReject(access(new URL(`../public/${arquivo}`, import.meta.url)), `public/${arquivo} não existe`)
  }
})

test('a abertura nunca prende o visitante: tem teto de espera e resgate em caso de erro', async () => {
  const abertura = trechoDaAbertura(await lerIndex())
  assert.match(abertura, /MAX_ESPERA = \d+/)
  assert.match(abertura, /addEventListener\('error', resgate\)/)
  assert.match(abertura, /play\(pageLoaded\)\.catch\(resgate\)/)
})
