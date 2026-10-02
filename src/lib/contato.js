// ─── Contato da STU: um lugar só ────────────────────────────────────────────
// Mudou o número, o e-mail ou o perfil? Troque aqui e em mais nenhum lugar.

export const WHATSAPP = '5551992256884'              // formato do wa.me: país + DDD + número
export const WHATSAPP_EXIBICAO = '+55 51 99225-6884'   // como aparece para o visitante
export const EMAIL = 'contato@produtorastu.com'
export const INSTAGRAM = 'https://www.instagram.com/produtora.stu/'
export const INSTAGRAM_EXIBICAO = '@produtora.stu'
export const SITE_PRINCIPAL = 'https://produtorastu.com'

const MENSAGEM_PADRAO = 'Olá! Vim pelo stu. música e quero conversar sobre um projeto musical.'

// Link do WhatsApp, com mensagem pronta opcional
export function linkWhatsSTU(mensagem = MENSAGEM_PADRAO) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`
}
