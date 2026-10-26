import { useEffect } from 'react'

export const webApp = window.Telegram?.WebApp

export const isTelegram = Boolean(webApp?.initData)

const APP_BACKGROUND = '#1a1815'

export function initTelegram() {
  if (!isTelegram) return
  webApp.setHeaderColor(APP_BACKGROUND)
  webApp.setBackgroundColor(APP_BACKGROUND)
  if (webApp.isVersionAtLeast('7.10')) webApp.setBottomBarColor(APP_BACKGROUND)
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
