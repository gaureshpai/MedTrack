"use client"

import type React from "react"

import { useCallback, useEffect, useRef, useState } from "react"
import { FilesetResolver, GestureRecognizer, type GestureRecognizerResult } from "@mediapipe/tasks-vision"

const GESTURE_TO_TEXT: Record<string, string> = {
  Thumb_Up: "yes",
  Thumb_Down: "no",
  Victory: "victory",
  Open_Palm: "hello",
  Closed_Fist: "stop",
  Pointing_Up: "up",
  OK: "ok",
  ILoveYou: "love",
}

type UseSignLanguageOptions = {
  videoRef: React.RefObject<HTMLVideoElement | null>
  onRecognizedWord?: (word: string) => void
  confidenceThreshold?: number
  stableFrames?: number
  cooldownMs?: number
}

export function useSignLanguage(options: UseSignLanguageOptions) {
  const { videoRef, onRecognizedWord, confidenceThreshold = 0.7, stableFrames = 5, cooldownMs = 1200 } = options

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recognizedGesture, setRecognizedGesture] = useState<string | null>(null)
  const [lastWord, setLastWord] = useState<string | null>(null)

  const streamRef = useRef<MediaStream | null>(null)
  const visionRef = useRef<any | null>(null)
  const recognizerRef = useRef<GestureRecognizer | null>(null)
  const rafRef = useRef<number | null>(null)

  const lastGestureRef = useRef<string | null>(null)
  const sameCountRef = useRef<number>(0)
  const lastAppendAtRef = useRef<number>(0)

  const loadModel = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.6/wasm",
      )
      visionRef.current = vision

      const recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/latest/gesture_recognizer.task",
        },
        runningMode: "VIDEO",
        numHands: 2,
      })
      recognizerRef.current = recognizer
      setLoading(false)
    } catch (e: any) {
      console.error("Failed to load gesture model:", e)
      setError("Failed to load gesture model. Check your internet connection.")
      setLoading(false)
      throw e
    }
  }, [])

  const startCamera = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch (e: any) {
      console.error("Error accessing camera:", e)
      setError("Camera access denied or unavailable.")
      throw e
    }
  }, [videoRef])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      try {
        videoRef.current.pause()
      } catch { }
      videoRef.current.srcObject = null
    }
  }, [videoRef])

  const recognizeFrame = useCallback(() => {
    const videoEl = videoRef.current
    const recognizer = recognizerRef.current
    if (!videoEl || !recognizer) return

    const nowMs = Date.now()
    let result: GestureRecognizerResult | undefined
    try {
      result = recognizer.recognizeForVideo(videoEl, nowMs)
    } catch (e) { }

    if (result?.gestures?.length) {
      const top = result.gestures[0][0]
      if (top && top.score >= confidenceThreshold) {
        const name = top.categoryName
        if (lastGestureRef.current === name) {
          sameCountRef.current += 1
        } else {
          lastGestureRef.current = name
          sameCountRef.current = 1
        }

        if (sameCountRef.current >= stableFrames) {
          setRecognizedGesture(name)
          const word = GESTURE_TO_TEXT[name]
          if (word) {
            const now = performance.now()
            if (now - lastAppendAtRef.current > cooldownMs) {
              lastAppendAtRef.current = now
              setLastWord(word)
              onRecognizedWord?.(word)
            }
          }
          sameCountRef.current = stableFrames
        }
      }
    }

    rafRef.current = requestAnimationFrame(recognizeFrame)
  }, [videoRef, confidenceThreshold, stableFrames, cooldownMs, onRecognizedWord])

  const start = useCallback(async () => {
    if (!recognizerRef.current) {
      await loadModel()
    }
    await startCamera()
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(recognizeFrame)
  }, [loadModel, recognizeFrame, startCamera])

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    stopCamera()
  }, [stopCamera])

  useEffect(() => {
    return () => {
      stop()
      recognizerRef.current?.close?.()
      recognizerRef.current = null
      visionRef.current = null
    }
  }, [])

  return {
    loading,
    error,
    recognizedGesture,
    lastWord,
    start,
    stop,
  }
}