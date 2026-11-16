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

/** Stops the recording that is playing right now, if any. */
let stopCurrentAudio: (() => void) | null = null

/** Stops any sound that is still playing, so two sounds never overlap. */
export function stopPronouncing(): void {
  stopCurrentAudio?.()
  stopCurrentAudio = null
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

/**
 * Resolves when the sound has finished playing (or was stopped by another sound).
 * If the recording can't be played (missing file, network error, unsupported format),
 * the speech voice is used instead, so the child always hears something.
 */
export async function pronounce({ audioUrl, text, rate = 1 }: PronounceOptions): Promise<void> {
  stopPronouncing()
  if (audioUrl) {
    try {
      return await playFile(audioUrl, rate)
    } catch (error) {
      console.warn(`Recording ${audioUrl} could not be played, using the speech voice instead.`, error)
    }
  }
  return speak(text, rate)
}

function playFile(url: string, rate: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url)
    audio.playbackRate = rate
    const finish = () => {
      audio.onended = null
      audio.onerror = null
      if (stopCurrentAudio === stop) stopCurrentAudio = null
      resolve()
    }
    // Interrupted by the next sound: that is a normal end, not a failure.
    const stop = () => {
      audio.pause()
      finish()
    }
    stopCurrentAudio = stop
    audio.onended = finish
    audio.onerror = () => reject(new Error(`Could not load ${url}`))
    audio.play().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'AbortError') finish()
      else reject(error)
    })
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
