const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, APP_URL } = process.env

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || !APP_URL) {
  console.error('Set TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID and APP_URL')
  process.exit(1)
}

const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text: 'Время английского! 15 минут — и стрик продолжается 🔥',
    reply_markup: { inline_keyboard: [[{ text: 'Заниматься', web_app: { url: APP_URL } }]] },
  }),
})

const result = await response.json()
if (!result.ok) {
  console.error(`Telegram error ${result.error_code}: ${result.description}`)
  process.exit(1)
}
console.log('Reminder sent')
