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
  wasmLoaderPath: string
  wasmBinaryPath: string
  assetLoaderPath?: string
  assetBinaryPath?: string
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

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recognizedGesture, setRecognizedGesture] = useState<string | null>(null)
  const [lastWord, setLastWord] = useState<string | null>(null)
  const [cameraReady, setCameraReady] = useState(false)

  const streamRef = useRef<MediaStream | null>(null)
  const visionRef = useRef<WasmFileset | null>(null)
  const recognizerRef = useRef<GestureRecognizer | null>(null)
  const rafRef = useRef<number | null>(null)
  const isRunningRef = useRef<boolean>(false)

  const lastGestureRef = useRef<string | null>(null)
  const sameCountRef = useRef<number>(0)
  const lastAppendAtRef = useRef<number>(0)

  const loadModel = useCallback(async () => {
    if (recognizerRef.current) return // Already loaded

    setLoading(true)
    setError(null)
    try {
      console.log("[v0] Loading MediaPipe model...")
      const vision = await FilesetResolver.forVisionTasks(
        "",
      )
      visionRef.current = vision

      const recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "gesture_recognizer.task",
        },
        runningMode: "VIDEO",
        numHands: 2,
      })
      recognizerRef.current = recognizer
      console.log("[v0] MediaPipe model loaded successfully")
      setLoading(false)
    } catch (error) {
      console.error("[v0] Failed to load gesture model:", error)
      setError("Failed to load gesture model. Check your internet connection.")
      setLoading(false)
      throw error
    }
  }, [])

  const startCamera = useCallback(async () => {
    if (streamRef.current) return // Already started

    setError(null)
    setCameraReady(false)
    try {
      console.log("[v0] Requesting camera permissions...")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await new Promise<void>((resolve, reject) => {
          const videoEl = videoRef.current!
          const handleLoadedData = () => {
            videoEl.removeEventListener("loadeddata", handleLoadedData)
            videoEl.removeEventListener("error", handleError)
            resolve()
          }
          const handleError = (e: Event) => {
            videoEl.removeEventListener("loadeddata", handleLoadedData)
            videoEl.removeEventListener("error", handleError)
            reject(new Error("Video failed to load"))
          }

          videoEl.addEventListener("loadeddata", handleLoadedData)
          videoEl.addEventListener("error", handleError)
          videoEl.play().catch(reject)
        })

        console.log("[v0] Camera started successfully")
        setCameraReady(true)
      }
    } catch (error) {
      console.error("[v0] Error accessing camera:", error)
      const errorMessage =
        error instanceof Error && error.name === "NotAllowedError"
          ? "Camera access denied. Please allow camera permissions and try again."
          : error instanceof Error && error.name === "NotFoundError"
            ? "No camera found. Please connect a camera and try again."
            : "Camera access failed. Please check your camera and try again."
      setError(errorMessage)
      setCameraReady(false)
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
    setCameraReady(false)
  }, [videoRef])

  const recognizeFrame = useCallback(
    (videoEl: HTMLVideoElement) => {
      const recognizer = recognizerRef.current
      if (!recognizer || !videoEl || !isRunningRef.current) return

      if (
        videoEl.readyState < 2 || // HAVE_CURRENT_DATA
        videoEl.videoWidth === 0 ||
        videoEl.videoHeight === 0 ||
        videoEl.paused ||
        videoEl.ended ||
        !videoEl.isConnected
      ) {
        if (isRunningRef.current) {
          rafRef.current = requestAnimationFrame(() => recognizeFrame(videoEl))
        }
        return
      }

      const nowMs = performance.now()
      let result: GestureRecognizerResult | undefined

      try {
        result = recognizer.recognizeForVideo(videoEl, nowMs)
      } catch (error) {
        console.warn("[v0] MediaPipe recognition error:", error)
        if (isRunningRef.current) {
          rafRef.current = requestAnimationFrame(() => recognizeFrame(videoEl))
        }
        return
      }

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
                console.log("[v0] Recognized gesture:", name, "->", word)
              }
            }
            sameCountRef.current = stableFrames
          }
        }
      }

      if (isRunningRef.current) {
        rafRef.current = requestAnimationFrame(() => recognizeFrame(videoEl))
      }
    },
    [confidenceThreshold, stableFrames, cooldownMs, onRecognizedWord],
  )

  const start = useCallback(async () => {
    if (isRunningRef.current) return // Already running

    try {
      setError(null)
      console.log("[v0] Starting sign language detection...")

      await loadModel()
      await startCamera()

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const videoEl = videoRef.current
      const recognizer = recognizerRef.current

      if (!videoEl) {
        throw new Error("Video element not found")
      }

      if (!recognizer) {
        throw new Error("MediaPipe recognizer not initialized")
      }

      if (!streamRef.current || !streamRef.current.active) {
        throw new Error("Camera stream not active")
      }

      if (videoEl.readyState < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        if (videoEl.readyState < 2) {
          throw new Error("Video not loaded after waiting")
        }
      }

      if (videoEl.videoWidth === 0 || videoEl.videoHeight === 0) {
        throw new Error("Video has no dimensions")
      }

      if (videoEl.paused || videoEl.ended) {
        try {
          await videoEl.play()
        } catch (playError) {
          throw new Error("Failed to start video playback")
        }
      }

      isRunningRef.current = true
      console.log("[v0] Starting gesture recognition loop")
      rafRef.current = requestAnimationFrame(() => recognizeFrame(videoEl))
    } catch (error) {
      console.error("[v0] Failed to start sign language detection:", error)
      setError(error instanceof Error ? error.message : "Failed to start detection")
      isRunningRef.current = false
    }
  }, [loadModel, startCamera, recognizeFrame, videoRef])

  const stop = useCallback(() => {
    console.log("[v0] Stopping sign language detection")
    isRunningRef.current = false
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    stopCamera()
    setRecognizedGesture(null)
    setLastWord(null)
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
    cameraReady,
    start,
    stop,
  }
}