/**
 * Plays how a letter sounds.
 * Uses the recorded audio file when the backend provides one; otherwise falls back
 * to the browser's built-in Arabic speech voice (Web Speech API).
 */

export interface PronounceOptions {
  /** Recorded pronunciation, if any. */
  audioUrl: string | null
  /** Arabic text the speech voice reads when there is no recording, e.g. "ألف". */
  text: string
  /** 1 = normal speed, below 1 = slower. */
  rate?: number
}

let currentAudio: HTMLAudioElement | null = null

/** Stops any sound that is still playing, so two sounds never overlap. */
export function stopPronouncing(): void {
  currentAudio?.pause()
  currentAudio = null
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

/** Resolves when the sound has finished playing. */
export function pronounce({ audioUrl, text, rate = 1 }: PronounceOptions): Promise<void> {
  stopPronouncing()
  return audioUrl ? playFile(audioUrl, rate) : speak(text, rate)
}

function playFile(url: string, rate: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url)
    audio.playbackRate = rate
    audio.onended = () => resolve()
    audio.onerror = () => reject(new Error('Could not play the audio file.'))
    currentAudio = audio
    audio.play().catch(reject)
  })
}

function findArabicVoice(): SpeechSynthesisVoice | undefined {
  return window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith('ar'))
}

function speak(text: string, rate: number): Promise<void> {
  if (!('speechSynthesis' in window)) {
    return Promise.reject(new Error('This browser cannot play speech.'))
  }
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ar-SA'
    utterance.rate = rate
    const voice = findArabicVoice()
    if (voice) utterance.voice = voice
    utterance.onend = () => resolve()
    // Some browsers fire `error` when cancelled by the next sound: treat it as finished.
    utterance.onerror = () => resolve()
    window.speechSynthesis.speak(utterance)
  })
}
