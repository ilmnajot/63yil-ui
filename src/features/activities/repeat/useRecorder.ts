import { useCallback, useEffect, useRef, useState } from 'react'

export type RecorderStatus = 'idle' | 'requesting' | 'recording' | 'recorded' | 'denied' | 'unsupported'

/** Recording stops by itself after this long; a single letter needs far less. */
const MAX_RECORDING_MS = 5000

const isSupported = () =>
  typeof window !== 'undefined' && 'MediaRecorder' in window && !!navigator.mediaDevices?.getUserMedia

/**
 * Records audio from the microphone with the MediaRecorder API and returns
 * a playable URL of the recording. Nothing is uploaded anywhere.
 */
export function useRecorder() {
  const [status, setStatus] = useState<RecorderStatus>(() => (isSupported() ? 'idle' : 'unsupported'))
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<number | undefined>(undefined)

  const stop = useCallback(() => {
    window.clearTimeout(timerRef.current)
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
  }, [])

  const start = useCallback(async () => {
    if (!isSupported()) return
    setStatus('requesting')
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setStatus('denied')
      return
    }

    const chunks: Blob[] = []
    const recorder = new MediaRecorder(stream)
    recorder.ondataavailable = (event) => chunks.push(event.data)
    recorder.onstop = () => {
      // Release the microphone so the browser's "recording" indicator turns off.
      stream.getTracks().forEach((track) => track.stop())
      const blob = new Blob(chunks, { type: recorder.mimeType })
      setRecordingUrl(URL.createObjectURL(blob))
      setStatus('recorded')
    }
    recorderRef.current = recorder
    recorder.start()
    setStatus('recording')
    timerRef.current = window.setTimeout(stop, MAX_RECORDING_MS)
  }, [stop])

  // Free the previous recording's memory whenever a new one replaces it, and on leaving the screen.
  useEffect(
    () => () => {
      if (recordingUrl) URL.revokeObjectURL(recordingUrl)
    },
    [recordingUrl],
  )

  // Leaving the screen while recording: stop and release the microphone.
  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current)
      const recorder = recorderRef.current
      if (recorder?.state === 'recording') {
        recorder.onstop = null
        recorder.stop()
        recorder.stream.getTracks().forEach((track) => track.stop())
      }
    },
    [],
  )

  return { status, recordingUrl, start, stop }
}
