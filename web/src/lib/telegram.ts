export const webApp = window.Telegram?.WebApp

export const isTelegram = Boolean(webApp?.initData)

export function initTelegram() {
  const root = document.documentElement

  if (!isTelegram) {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const applyMedia = () => root.classList.toggle('dark', media.matches)
    applyMedia()
    media.addEventListener('change', applyMedia)
    return
  }

  const applyScheme = () => root.classList.toggle('dark', webApp.colorScheme === 'dark')
  applyScheme()
  webApp.onEvent('themeChanged', applyScheme)
  webApp.ready()
  webApp.expand()
}
