import { useSyncExternalStore } from 'react'

// A abertura (#stu-loader, no index.html) põe a classe stu-loading no <html>
// enquanto cobre a página e a tira no instante em que começa a sair: as
// barras caem e o ponto abre revelando o site. Quem tem entrada animada
// (o Hero da Home) espera esse instante, senão ela acontece escondida.
// Sem abertura (já saiu, foi resgatada ou nem existe) a resposta é true.

const saiu = () => !document.documentElement.classList.contains('stu-loading')

function assinar(aviso) {
  const observador = new MutationObserver(aviso)
  observador.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observador.disconnect()
}

export function useAberturaSaindo() {
  return useSyncExternalStore(assinar, saiu, () => true)
}
