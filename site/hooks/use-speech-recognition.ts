"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type UseSpeechRecognitionOptions = {
  lang?: string
  continuous?: boolean
  interimResults?: boolean
  onResult?: (text: string, isFinal: boolean) => void
}

type UseSpeechRecognitionReturn = {
  supported: boolean
  listening: boolean
  interimTranscript: string
  finalTranscript: string
  error: string | null
  start: () => Promise<void>
  stop: () => void
  reset: () => void
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const { lang = "en-US", continuous = true, interimResults = true, onResult } = options

  const recognitionRef = useRef<any | null>(null)
  const restartTimerRef = useRef<number | null>(null)
  const lastErrorRef = useRef<string | null>(null)

  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState("")
  const [finalTranscript, setFinalTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const SR =
      (typeof window !== "undefined" &&
        ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) ||
      null

    setSupported(Boolean(SR))
    if (!SR) return

    const recognition: any = new SR()
    recognition.lang = lang
    recognition.continuous = continuous
    recognition.interimResults = interimResults

    recognition.onstart = () => {
      setListening(true)
      lastErrorRef.current = null
    }

    recognition.onresult = (event: any) => {
      let interim = ""
      let final = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i]
        const text = res[0].transcript
        if (res.isFinal) final += text
        else interim += text
      }

      setInterimTranscript(interim)
      if (final) setFinalTranscript((prev) => (prev ? `${prev} ${final}` : final))

      const latest = final || interim
      if (latest && onResult) onResult(latest, Boolean(final))
    }

    recognition.onerror = (e: any) => {
      const err: string = e?.error || "unknown"
      lastErrorRef.current = err

      const benign = err === "aborted" || err === "no-speech"
      if (!benign) {
        setError(err)
      } else {
        setError(null)
      }

      setListening(false)

      const fatal = err === "not-allowed" || err === "service-not-allowed" || err === "audio-capture"
      if (fatal) return

      if (!benign && continuous && recognitionRef.current?._shouldRestart) {
        if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current)
        restartTimerRef.current = window.setTimeout(() => {
          try {
            recognition.start()
            setListening(true)
          } catch { }
        }, 500)
      }
    }

    recognition.onend = () => {
      setListening(false)
      const hadError = lastErrorRef.current !== null
      if (!hadError && continuous && recognitionRef.current?._shouldRestart) {
        if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current)
        restartTimerRef.current = window.setTimeout(() => {
          try {
            recognition.start()
            setListening(true)
          } catch { }
        }, 250)
      }
    }

    recognitionRef.current = recognition

    return () => {
      if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current)
      restartTimerRef.current = null
      try {
        recognition.stop()
      } catch { }
      recognitionRef.current = null
    }
  }, [lang, continuous, interimResults, onResult])

  const start = useCallback(async () => {
    setError(null)
    setInterimTranscript("")
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setError("not-allowed")
      throw new Error("Mic permission not granted")
    }

    const recognition = recognitionRef.current
    if (!recognition) return

    try {
      recognitionRef.current._shouldRestart = true
      recognition.start()
      setListening(true)
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes("start")) return
      setError("network")
      throw err
    }
  }, [])

  const stop = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition) return
    recognitionRef.current._shouldRestart = false
    try {
      recognition.stop()
    } catch { }
    setListening(false)
  }, [])

  const reset = useCallback(() => {
    setInterimTranscript("")
    setFinalTranscript("")
    setError(null)
    lastErrorRef.current = null
  }, [])

  return {
    supported,
    listening,
    interimTranscript,
    finalTranscript,
    error,
    start,
    stop,
    reset,
  }
}