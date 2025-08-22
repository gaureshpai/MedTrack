"use client"

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

  ASL_A: "a",
  ASL_B: "b",
  ASL_C: "c",
  ASL_D: "d",
  ASL_E: "e",
  ASL_F: "f",
  ASL_G: "g",
  ASL_H: "h",
  ASL_I: "i",
  ASL_J: "j",
  ASL_K: "k",
  ASL_L: "l",
  ASL_M: "m",
  ASL_N: "n",
  ASL_O: "o",
  ASL_P: "p",
  ASL_Q: "q",
  ASL_R: "r",
  ASL_S: "s",
  ASL_T: "t",
  ASL_U: "u",
  ASL_V: "v",
  ASL_W: "w",
  ASL_X: "x",
  ASL_Y: "y",
  ASL_Z: "z",

  Letter_A: "a",
  Letter_B: "b",
  Letter_C: "c",
  Letter_D: "d",
  Letter_E: "e",
  Letter_F: "f",
  Letter_G: "g",
  Letter_H: "h",
  Letter_I: "i",
  Letter_J: "j",
  Letter_K: "k",
  Letter_L: "l",
  Letter_M: "m",
  Letter_N: "n",
  Letter_O: "o",
  Letter_P: "p",
  Letter_Q: "q",
  Letter_R: "r",
  Letter_S: "s",
  Letter_T: "t",
  Letter_U: "u",
  Letter_V: "v",
  Letter_W: "w",
  Letter_X: "x",
  Letter_Y: "y",
  Letter_Z: "z",
}

type UseSignLanguageOptions = {
  videoRef: React.RefObject<HTMLVideoElement | null>
  onRecognizedWord?: (word: string) => void
  confidenceThreshold?: number
  stableFrames?: number
  cooldownMs?: number
}
declare interface WasmFileset {
    wasmLoaderPath: string;
    wasmBinaryPath: string;
    assetLoaderPath?: string;
    assetBinaryPath?: string;
}

export const getAvailableLetters = (): string[] => {
  return Object.values(GESTURE_TO_TEXT)
    .filter((value) => value.length === 1 && /[a-z]/.test(value))
    .sort()
}

export const getGestureDescription = (letter: string): string => {
  const descriptions: Record<string, string> = {
    a: "Closed fist with thumb alongside",
    b: "Flat hand, fingers together, thumb across palm",
    c: "Curved hand forming C shape",
    d: "Index finger up, other fingers touch thumb",
    e: "Fingers curled down touching thumb",
    f: "Index and thumb touch, other fingers up",
    g: "Index finger and thumb extended horizontally",
    h: "Index and middle fingers extended horizontally",
    i: "Pinky finger extended, others closed",
    j: "Pinky extended, draw J motion",
    k: "Index and middle fingers up, thumb between them",
    l: "Index finger and thumb form L shape",
    m: "Thumb under first three fingers",
    n: "Thumb under first two fingers",
    o: "Fingers curved forming O shape",
    p: "Index and middle fingers down, thumb between",
    q: "Index finger and thumb down",
    r: "Index and middle fingers crossed",
    s: "Closed fist with thumb over fingers",
    t: "Thumb between index and middle finger",
    u: "Index and middle fingers up together",
    v: "Index and middle fingers up, separated",
    w: "Index, middle, and ring fingers up",
    x: "Index finger crooked",
    y: "Thumb and pinky extended",
    z: "Draw Z shape with index finger",
  }
  return descriptions[letter.toLowerCase()] || "Unknown gesture"
}

export function useSignLanguage(options: UseSignLanguageOptions) {
  const { videoRef, onRecognizedWord, confidenceThreshold = 0.7, stableFrames = 5, cooldownMs = 1200 } = options

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recognizedGesture, setRecognizedGesture] = useState<string | null>(null)
  const [lastWord, setLastWord] = useState<string | null>(null)

  const streamRef = useRef<MediaStream | null>(null)
  const visionRef = useRef<WasmFileset | null>(null)
  const recognizerRef = useRef<GestureRecognizer | null>(null)
  const rafRef = useRef<number | null>(null)

  const lastGestureRef = useRef<string | null>(null)
  const sameCountRef = useRef<number>(0)
  const lastAppendAtRef = useRef<number>(0)
  const lastTimestampRef = useRef<number>(0)

  const loadModel = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.6/wasm",
      )
      visionRef.current = vision

      const modelPath =
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/latest/gesture_recognizer.task"

      const recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: modelPath,
        },
        runningMode: "VIDEO",
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })
      recognizerRef.current = recognizer
      setLoading(false)
    } catch (error) {
      console.error("Failed to load gesture model:", error)
      setError("Failed to load gesture model. Check your internet connection.")
      setLoading(false)
      throw error
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
    } catch (error) {
      console.error("Error accessing camera:", error)
      setError("Camera access denied or unavailable.")
      throw error
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
      } catch {}
      videoRef.current.srcObject = null
    }
  }, [videoRef])

  const recognizeFrame = useCallback(() => {
    const videoEl = videoRef.current
    const recognizer = recognizerRef.current
    if (!videoEl || !recognizer) return

    const currentTime = performance.now()
    const nowMs = Math.max(currentTime, lastTimestampRef.current + 1)
    lastTimestampRef.current = nowMs

    let result: GestureRecognizerResult | undefined
    try {
      result = recognizer.recognizeForVideo(videoEl, nowMs)
    } catch (_e) {}

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

    lastTimestampRef.current = 0

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
  }, [stop])

  return {
    loading,
    error,
    recognizedGesture,
    lastWord,
    start,
    stop,
    getAvailableLetters,
    getGestureDescription,
  }
}