import { useEffect } from 'react'

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

export function useBackButton(onBack: () => void) {
  useEffect(() => {
    if (!isTelegram) return
    const canLockSwipes = webApp.isVersionAtLeast('7.7')
    webApp.BackButton.onClick(onBack)
    webApp.BackButton.show()
    if (canLockSwipes) webApp.disableVerticalSwipes()
    return () => {
      webApp.BackButton.offClick(onBack)
      webApp.BackButton.hide()
      if (canLockSwipes) webApp.enableVerticalSwipes()
    }
  }, [onBack])
}

export function haptic(type: 'success' | 'warning' | 'error') {
  if (isTelegram) webApp.HapticFeedback.notificationOccurred(type)
}
