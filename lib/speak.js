export function speakText(text, locale) {
  if (typeof window === "undefined" || !text) return
  const synth = window.speechSynthesis
  if (!synth) return

  synth.cancel()

  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = locale || "en-US"

  const voices = synth.getVoices()
  const base = locale?.split("-")[0]
  const match =
    voices.find((v) => v.lang === locale) ||
    voices.find((v) => v.lang?.startsWith(base ?? "")) ||
    voices[0]
  if (match) utter.voice = match

  synth.speak(utter)
}

export function loadVoices(callback) {
  if (typeof window === "undefined") return
  const synth = window.speechSynthesis
  if (!synth) return
  const run = () => callback(synth.getVoices())
  run()
  synth.onvoiceschanged = run
}
