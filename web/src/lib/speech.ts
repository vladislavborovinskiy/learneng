const canSpeak = 'speechSynthesis' in window

export function speak(text: string) {
  if (!canSpeak) return
  speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.9
  const voice = speechSynthesis.getVoices().find((candidate) => candidate.lang === 'en-US')
  if (voice) utterance.voice = voice
  speechSynthesis.speak(utterance)
}
