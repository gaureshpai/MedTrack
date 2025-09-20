"use client"

import type React from "react"

import { useCallback, useEffect, useRef, useState } from "react"
import { FilesetResolver, HandLandmarker, type HandLandmarkerResult } from "@mediapipe/tasks-vision"

// Accurate ASL Letter Recognition based on actual hand landmark positions
function recognizeASLLetter(landmarks: { x: number; y: number; z: number }[]): string | null {
  if (landmarks.length !== 21) return null // MediaPipe hands has 21 landmarks
  
  // MediaPipe hand landmark indices
  const WRIST = 0
  const THUMB_CMC = 1, THUMB_MCP = 2, THUMB_IP = 3, THUMB_TIP = 4
  const INDEX_MCP = 5, INDEX_PIP = 6, INDEX_DIP = 7, INDEX_TIP = 8
  const MIDDLE_MCP = 9, MIDDLE_PIP = 10, MIDDLE_DIP = 11, MIDDLE_TIP = 12
  const RING_MCP = 13, RING_PIP = 14, RING_DIP = 15, RING_TIP = 16
  const PINKY_MCP = 17, PINKY_PIP = 18, PINKY_DIP = 19, PINKY_TIP = 20
  
  // Precise helper functions for ASL recognition
  const distance = (p1: number, p2: number): number => {
    const landmark1 = landmarks[p1], landmark2 = landmarks[p2]
    return Math.sqrt((landmark1.x - landmark2.x)**2 + (landmark1.y - landmark2.y)**2 + (landmark1.z - landmark2.z)**2)
  }
  
  const isFingerExtended = (tip: number, pip: number, mcp: number): boolean => {
    return landmarks[tip].y < landmarks[pip].y && landmarks[pip].y < landmarks[mcp].y
  }
  
  const isFingerCurled = (tip: number, pip: number): boolean => {
    return landmarks[tip].y > landmarks[pip].y
  }
  
  const isThumbExtended = (): boolean => {
    return landmarks[THUMB_TIP].x > landmarks[THUMB_IP].x && 
           Math.abs(landmarks[THUMB_TIP].y - landmarks[THUMB_IP].y) < 0.05
  }
  
  const isThumbTucked = (): boolean => {
    return distance(THUMB_TIP, INDEX_MCP) < 0.08
  }
  
  const fingersCurledIntoFist = (): boolean => {
    return isFingerCurled(INDEX_TIP, INDEX_PIP) &&
           isFingerCurled(MIDDLE_TIP, MIDDLE_PIP) &&
           isFingerCurled(RING_TIP, RING_PIP) &&
           isFingerCurled(PINKY_TIP, PINKY_PIP)
  }
  
  // Check finger extension states
  const thumbExtended = isThumbExtended()
  const indexExtended = isFingerExtended(INDEX_TIP, INDEX_PIP, INDEX_MCP)
  const middleExtended = isFingerExtended(MIDDLE_TIP, MIDDLE_PIP, MIDDLE_MCP)
  const ringExtended = isFingerExtended(RING_TIP, RING_PIP, RING_MCP)
  const pinkyExtended = isFingerExtended(PINKY_TIP, PINKY_PIP, PINKY_MCP)
  
  // ASL Letter Recognition - Based on actual reference image positions
  
  // A: Closed fist with thumb alongside (tucked against index finger)
  if (fingersCurledIntoFist() && isThumbTucked()) {
    return "a"
  }
  
  // B: All four fingers extended straight up, thumb tucked across palm
  if (indexExtended && middleExtended && ringExtended && pinkyExtended && isThumbTucked()) {
    // Verify fingers are close together and straight
    const fingersClose = distance(INDEX_TIP, MIDDLE_TIP) < 0.05 &&
                        distance(MIDDLE_TIP, RING_TIP) < 0.05 &&
                        distance(RING_TIP, PINKY_TIP) < 0.05
    if (fingersClose) {
      return "b"
    }
  }
  
  // C: Curved fingers forming C shape (all fingers partially curled)
  if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    // Check if fingers are in curved position (not fully closed)
    const fingersCurved = landmarks[INDEX_TIP].y > landmarks[INDEX_MCP].y &&
                         landmarks[MIDDLE_TIP].y > landmarks[MIDDLE_MCP].y &&
                         landmarks[RING_TIP].y > landmarks[RING_MCP].y &&
                         landmarks[PINKY_TIP].y > landmarks[PINKY_MCP].y &&
                         landmarks[INDEX_TIP].y < landmarks[INDEX_PIP].y + 0.02 // Not fully closed
    if (fingersCurved) {
      return "c"
    }
  }
  
  // D: Index finger up, other fingers curled, thumb touches middle finger
  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    const thumbTouchesMiddle = distance(THUMB_TIP, MIDDLE_TIP) < 0.06
    if (thumbTouchesMiddle) {
      return "d"
    }
  }
  
  // E: All fingertips curl down to touch palm, thumb curled over
  if (fingersCurledIntoFist()) {
    // Check if fingertips are really curled down (different from A)
    const fingertipsDown = landmarks[INDEX_TIP].y > landmarks[INDEX_DIP].y &&
                          landmarks[MIDDLE_TIP].y > landmarks[MIDDLE_DIP].y &&
                          landmarks[RING_TIP].y > landmarks[RING_DIP].y &&
                          landmarks[PINKY_TIP].y > landmarks[PINKY_DIP].y
    if (fingertipsDown) {
      return "e"
    }
  }
  
  // F: Index finger and thumb form circle, other fingers extended
  if (middleExtended && ringExtended && pinkyExtended && !indexExtended) {
    const thumbIndexCircle = distance(THUMB_TIP, INDEX_TIP) < 0.05
    if (thumbIndexCircle) {
      return "f"
    }
  }
  
  // G: Index finger and thumb extended horizontally, pointing same direction
  if (thumbExtended && indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    // Check if both pointing horizontally in same direction
    const bothHorizontal = Math.abs(landmarks[THUMB_TIP].y - landmarks[THUMB_MCP].y) < 0.03 &&
                          Math.abs(landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y) < 0.03
    const sameDirection = (landmarks[THUMB_TIP].x - landmarks[THUMB_MCP].x) * 
                         (landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x) > 0
    if (bothHorizontal && sameDirection) {
      return "g"
    }
  }
  
  // H: Index and middle fingers extended horizontally (side by side)
  if (!thumbExtended && indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
    // Check if fingers are horizontal and close together
    const bothHorizontal = Math.abs(landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y) < 0.03 &&
                          Math.abs(landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y) < 0.03
    const fingersClose = distance(INDEX_TIP, MIDDLE_TIP) < 0.04
    if (bothHorizontal && fingersClose) {
      return "h"
    }
  }
  
  // I: Pinky extended up, other fingers curled, thumb tucked
  if (pinkyExtended && !indexExtended && !middleExtended && !ringExtended && isThumbTucked()) {
    return "i"
  }
  
  // J: Pinky extended with J motion (we'll detect static position)
  if (pinkyExtended && !indexExtended && !middleExtended && !ringExtended) {
    // J is similar to I but with a hooking motion - detect the curved pinky
    const pinkyHooked = landmarks[PINKY_TIP].x < landmarks[PINKY_PIP].x
    if (pinkyHooked) {
      return "j"
    }
  }
  
  // K: Index and middle up, thumb touches middle finger between joints
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
    // Thumb should be positioned between index and middle, touching middle finger
    const thumbTouchesMiddle = distance(THUMB_TIP, MIDDLE_PIP) < 0.06
    const thumbBetweenFingers = landmarks[THUMB_TIP].x > Math.min(landmarks[INDEX_TIP].x, landmarks[MIDDLE_TIP].x) &&
                               landmarks[THUMB_TIP].x < Math.max(landmarks[INDEX_TIP].x, landmarks[MIDDLE_TIP].x)
    if (thumbTouchesMiddle && thumbBetweenFingers) {
      return "k"
    }
  }
  
  // L: Thumb and index form L shape (perpendicular)
  if (thumbExtended && indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    // Check angle between thumb and index
    const thumbDir = { x: landmarks[THUMB_TIP].x - landmarks[THUMB_MCP].x, 
                      y: landmarks[THUMB_TIP].y - landmarks[THUMB_MCP].y }
    const indexDir = { x: landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, 
                      y: landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y }
    const dotProduct = thumbDir.x * indexDir.x + thumbDir.y * indexDir.y
    const angle = Math.abs(dotProduct) / (Math.sqrt(thumbDir.x**2 + thumbDir.y**2) * 
                                         Math.sqrt(indexDir.x**2 + indexDir.y**2))
    
    // L shape should be roughly perpendicular (angle near 0)
    if (angle < 0.3) {
      return "l"
    }
  }
  
  // M: Fist with thumb under first three fingers
  if (fingersCurledIntoFist()) {
    // Thumb should be under/behind the first three fingers
    const thumbUnder = landmarks[THUMB_TIP].y > landmarks[INDEX_MCP].y &&
                      distance(THUMB_TIP, INDEX_MCP) < 0.08
    if (thumbUnder) {
      return "m"
    }
  }
  
  // N: Similar to M but thumb under only first two fingers
  if (fingersCurledIntoFist()) {
    // Thumb under index and middle, but ring and pinky may be slightly different
    const thumbUnderTwo = landmarks[THUMB_TIP].y > landmarks[INDEX_MCP].y &&
                         landmarks[THUMB_TIP].y > landmarks[MIDDLE_MCP].y &&
                         distance(THUMB_TIP, MIDDLE_MCP) < 0.08
    if (thumbUnderTwo) {
      return "n"
    }
  }
  
  // O: Fingers curved to form O shape (similar to C but more closed)
  if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    // More closed than C - fingertips should be closer to thumb
    const formingO = distance(THUMB_TIP, INDEX_TIP) < 0.06 &&
                    distance(THUMB_TIP, MIDDLE_TIP) < 0.08
    if (formingO) {
      return "o"
    }
  }
  
  // P: Like K but pointing downward
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
    // Similar to K but pointing down
    const pointingDown = landmarks[INDEX_TIP].y > landmarks[INDEX_MCP].y &&
                        landmarks[MIDDLE_TIP].y > landmarks[MIDDLE_MCP].y
    const thumbTouchesMiddle = distance(THUMB_TIP, MIDDLE_PIP) < 0.06
    if (pointingDown && thumbTouchesMiddle) {
      return "p"
    }
  }
  
  // Q: Like G but pointing downward
  if (thumbExtended && indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    // Similar to G but pointing down
    const pointingDown = landmarks[INDEX_TIP].y > landmarks[INDEX_MCP].y &&
                        landmarks[THUMB_TIP].y > landmarks[THUMB_MCP].y
    if (pointingDown) {
      return "q"
    }
  }
  
  // R: Index and middle fingers crossed
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && isThumbTucked()) {
    // Check if fingers are crossed
    const fingersCrossed = Math.abs(landmarks[INDEX_TIP].x - landmarks[MIDDLE_TIP].x) < 0.03 &&
                          Math.abs(landmarks[INDEX_PIP].x - landmarks[MIDDLE_PIP].x) > 0.02
    if (fingersCrossed) {
      return "r"
    }
  }
  
  // S: Closed fist with thumb over fingers
  if (fingersCurledIntoFist()) {
    // Thumb should be over the fingers, not tucked
    const thumbOver = landmarks[THUMB_TIP].y < landmarks[INDEX_MCP].y
    if (thumbOver) {
      return "s"
    }
  }
  
  // T: Thumb between index and middle finger (index curled over thumb)
  if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    // Thumb should be visible between curled fingers
    const thumbVisible = landmarks[THUMB_TIP].y < landmarks[INDEX_PIP].y &&
                        landmarks[THUMB_TIP].x > landmarks[INDEX_TIP].x &&
                        landmarks[THUMB_TIP].x < landmarks[MIDDLE_TIP].x
    if (thumbVisible) {
      return "t"
    }
  }
  
  // U: Index and middle fingers up together (like V but touching)
  if (!thumbExtended && indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
    // Fingers should be very close together
    const fingersTogether = distance(INDEX_TIP, MIDDLE_TIP) < 0.03
    if (fingersTogether) {
      return "u"
    }
  }
  
  // V: Index and middle fingers up in V shape (separated)
  if (!thumbExtended && indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
    // Fingers should be separated
    const fingersSeparated = distance(INDEX_TIP, MIDDLE_TIP) > 0.05
    if (fingersSeparated) {
      return "v"
    }
  }
  
  // W: Index, middle, and ring fingers up
  if (!thumbExtended && indexExtended && middleExtended && ringExtended && !pinkyExtended) {
    return "w"
  }
  
  // X: Index finger crooked/bent at PIP joint
  if (!thumbExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    // Index finger should be crooked (bent at PIP)
    const indexCrooked = landmarks[INDEX_TIP].y > landmarks[INDEX_PIP].y &&
                        landmarks[INDEX_PIP].y < landmarks[INDEX_MCP].y
    if (indexCrooked) {
      return "x"
    }
  }
  
  // Y: Thumb and pinky extended ("hang loose" gesture)
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
    return "y"
  }
  
  // Z: Index finger extended, draw Z motion (we'll detect the pointing position)
  if (!thumbExtended && indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    // Z is typically drawn with index finger - detect pointing gesture
    return "z"
  }
  
  return null // No letter recognized
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
  // Return the letters we can recognize with our ASL implementation
  return ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
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
  const [aiInitializing, setAiInitializing] = useState(false)

  const streamRef = useRef<MediaStream | null>(null)
  const visionRef = useRef<WasmFileset | null>(null)
  const recognizerRef = useRef<HandLandmarker | null>(null)
  const rafRef = useRef<number | null>(null)
  const isRunningRef = useRef<boolean>(false)

  const lastGestureRef = useRef<string | null>(null)
  const sameCountRef = useRef<number>(0)
  const lastAppendAtRef = useRef<number>(0)
  const initStartTimeRef = useRef<number>(0)

  const loadModel = useCallback(async () => {
    if (recognizerRef.current) return // Already loaded

    setLoading(true)
    setError(null)
    
    // Suppress TensorFlow messages during model loading too
    const originalError = console.error
    const originalInfo = console.info
    const originalLog = console.log
    
    console.error = (...args) => {
      const message = args.join(' ')
      if (message.includes('TensorFlow') || message.includes('MediaPipe') || message.includes('XNNPACK')) {
        return
      }
      originalError(...args)
    }
    
    console.info = (...args) => {
      const message = args.join(' ')
      if (message.includes('TensorFlow') || message.includes('MediaPipe')) {
        return
      }
      originalInfo(...args)
    }
    
    console.log = (...args) => {
      const message = args.join(' ')
      if (message.includes('TensorFlow') || message.includes('MediaPipe')) {
        return
      }
      originalLog(...args)
    }
    
    try {
      originalLog("Loading MediaPipe model...")
      
      // Try multiple CDN sources for better reliability
      const visionSources = [
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm",
        "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.3/wasm",
        "https://unpkg.com/@mediapipe/tasks-vision@0.10.3/wasm",
        "/wasm" // Local fallback
      ];
      
      let vision = null;
      let lastError = null;
      
      for (const source of visionSources) {
        try {
          console.log(`Trying to load vision from: ${source}`);
          vision = await FilesetResolver.forVisionTasks(source);
          if (vision) {
            console.log(`Successfully loaded vision from: ${source}`);
            break;
          }
        } catch (err) {
          console.warn(`Failed to load vision from ${source}:`, err);
          lastError = err;
          continue;
        }
      }
      
      if (!vision) {
        throw lastError || new Error('Failed to load MediaPipe vision tasks from any source');
      }
      
      visionRef.current = vision

      // Try multiple model sources for hand landmarker
      const modelSources = [
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        "/models/hand_landmarker.task",
        "./hand_landmarker.task"
      ];
      
      let recognizer = null;
      
      for (const modelPath of modelSources) {
        try {
          console.log(`Trying to load hand landmarker model from: ${modelPath}`);
          recognizer = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: modelPath,
            },
            runningMode: "VIDEO",
            numHands: 1,
            minHandDetectionConfidence: 0.7,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
          if (recognizer) {
            console.log(`Successfully loaded hand landmarker model from: ${modelPath}`);
            break;
          }
        } catch (err) {
          console.warn(`Failed to load hand landmarker model from ${modelPath}:`, err);
          continue;
        }
      }
      
      if (!recognizer) {
        throw new Error('Failed to load hand landmarker model from any source');
      }
      
      recognizerRef.current = recognizer
      
      // Restore console methods
      console.error = originalError
      console.info = originalInfo 
      console.log = originalLog
      
      console.log("MediaPipe model loaded successfully")
      console.log("TensorFlow will initialize silently on first use")
      setLoading(false)
    } catch (error) {
      // Restore console methods
      console.error = originalError
      console.info = originalInfo
      console.log = originalLog
      
      console.error("Failed to load gesture model:", error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      let friendlyError = "Failed to load gesture model. ";
      
      if (errorMessage.includes('fetch')) {
        friendlyError += "Please check your internet connection.";
      } else if (errorMessage.includes('CORS')) {
        friendlyError += "Network access blocked. Try refreshing the page.";
      } else if (errorMessage.includes('WebAssembly')) {
        friendlyError += "Your browser doesn't support this feature. Try updating your browser.";
      } else {
        friendlyError += "This feature requires an internet connection and a compatible browser.";
      }
      
      setError(friendlyError)
      setLoading(false)
      throw error
    }
  }, [])

  const startCamera = useCallback(async () => {
    if (streamRef.current) return // Already started

    setError(null)
    setCameraReady(false)
    try {
      console.log("Requesting camera permissions...")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      })
      streamRef.current = stream

      if (videoRef.current) {
        const videoEl = videoRef.current
        videoEl.srcObject = stream
        
        // Wait for video metadata to load with timeout
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            cleanup()
            reject(new Error("Video loading timeout - please check your camera"))
          }, 10000) // 10 second timeout
          
          const handleLoadedMetadata = () => {
            console.log('Video metadata loaded');
            cleanup()
            resolve()
          }
          
          const handleCanPlay = () => {
            console.log('Video can play');
            cleanup() 
            resolve()
          }
          
          const handleError = (e: Event) => {
            console.error('Video error:', e);
            cleanup()
            reject(new Error("Video failed to load - camera may be in use"))
          }
          
          const cleanup = () => {
            clearTimeout(timeout)
            videoEl.removeEventListener("loadedmetadata", handleLoadedMetadata)
            videoEl.removeEventListener("canplay", handleCanPlay)
            videoEl.removeEventListener("error", handleError)
          }

          videoEl.addEventListener("loadedmetadata", handleLoadedMetadata)
          videoEl.addEventListener("canplay", handleCanPlay)
          videoEl.addEventListener("error", handleError)
          
          // Start playing (don't await this as it may be interrupted)
          videoEl.play().catch((playError) => {
            console.warn('Initial play failed, will retry later:', playError);
            // Don't reject here, the video might still work for recognition
          })
        })

        console.log("Camera started successfully")
        setCameraReady(true)
      } else {
        throw new Error("Video element not available")
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      let errorMessage = "Camera access failed. Please check your camera and try again.";
      
      if (error instanceof Error) {
        switch (error.name) {
          case "NotAllowedError":
            errorMessage = "Camera access denied. Please click the camera icon in your browser's address bar to allow camera access.";
            break;
          case "NotFoundError":
            errorMessage = "No camera found. Please connect a camera and refresh the page.";
            break;
          case "NotReadableError":
            errorMessage = "Camera is being used by another application. Please close other apps using the camera.";
            break;
          case "OverconstrainedError":
            errorMessage = "Camera doesn't support the required settings. Try using a different camera.";
            break;
          case "SecurityError":
            errorMessage = "Camera access blocked by security settings. Please use HTTPS or localhost.";
            break;
          default:
            if (error.message.includes('https')) {
              errorMessage = "Camera access requires HTTPS. Please use a secure connection.";
            }
            break;
        }
      }
      
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
      let result: HandLandmarkerResult | undefined

      // Completely suppress all TensorFlow and MediaPipe console outputs during recognition
      const originalError = console.error
      const originalWarn = console.warn
      const originalInfo = console.info
      const originalLog = console.log
      
      // Override all console methods to suppress TensorFlow messages
      console.error = (...args) => {
        const message = args.join(' ')
        if (message.includes('INFO: Created TensorFlow') || 
            message.includes('XNNPACK delegate') ||
            message.includes('TensorFlow Lite') ||
            message.includes('MediaPipe')) {
          return // Completely suppress
        }
        originalError(...args)
      }
      
      console.warn = (...args) => {
        const message = args.join(' ')
        if (message.includes('TensorFlow') || message.includes('MediaPipe')) {
          return
        }
        originalWarn(...args)
      }
      
      console.info = (...args) => {
        const message = args.join(' ')
        if (message.includes('TensorFlow') || message.includes('MediaPipe')) {
          return
        }
        originalInfo(...args)
      }
      
      console.log = (...args) => {
        const message = args.join(' ')
        if (message.includes('TensorFlow') || message.includes('MediaPipe') || message.includes('XNNPACK')) {
          return
        }
        originalLog(...args)
      }

      try {
        result = recognizer.detectForVideo(videoEl, nowMs)
        
        // Restore all console methods
        console.error = originalError
        console.warn = originalWarn
        console.info = originalInfo
        console.log = originalLog
        
        // If we get here successfully, AI is fully initialized
        if (initStartTimeRef.current > 0) {
          const initTime = Date.now() - initStartTimeRef.current
          originalLog(`✅ AI fully initialized in ${initTime}ms`)
          initStartTimeRef.current = 0
        }
        setAiInitializing(false)
        
      } catch (error) {
        // Restore all console methods
        console.error = originalError
        console.warn = originalWarn
        console.info = originalInfo
        console.log = originalLog
        
        // During initialization, MediaPipe may throw while TensorFlow is loading
        if (initStartTimeRef.current === 0) {
          initStartTimeRef.current = Date.now()
          originalLog('🤖 AI initializing...')
        }
        
        setAiInitializing(true)
        // Silently handle initialization - no error logging
      }

      if (result?.landmarks?.length) {
        const landmarks = result.landmarks[0] // Use first hand
        const recognizedLetter = recognizeASLLetter(landmarks)
        
        if (recognizedLetter) {
          if (lastGestureRef.current === recognizedLetter) {
            sameCountRef.current += 1
          } else {
            lastGestureRef.current = recognizedLetter
            sameCountRef.current = 1
          }

          if (sameCountRef.current >= stableFrames) {
            setRecognizedGesture(recognizedLetter)
            const now = performance.now()
            if (now - lastAppendAtRef.current > cooldownMs) {
              lastAppendAtRef.current = now
              setLastWord(recognizedLetter)
              onRecognizedWord?.(recognizedLetter)
              console.log("Recognized ASL letter:", recognizedLetter)
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
      console.log("Starting sign language detection...")

      // Wait for video element to be available with retries
      let elementAttempts = 0
      const maxElementAttempts = 30 // 15 seconds total
      while (!videoRef.current && elementAttempts < maxElementAttempts) {
        console.log(`Waiting for video element... attempt ${elementAttempts + 1}/${maxElementAttempts}`);
        await new Promise(resolve => setTimeout(resolve, 500))
        elementAttempts++
        
        // Give the dialog more time to fully render
        if (elementAttempts === 5) {
          console.log('Giving dialog extra time to render...')
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
      
      if (!videoRef.current) {
        throw new Error("Video element not available after extended waiting. Please close and reopen the dialog.")
      }

      await loadModel()
      await startCamera()

      // Wait a bit longer for everything to be ready
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const videoEl = videoRef.current
      const recognizer = recognizerRef.current

      if (!videoEl) {
        throw new Error("Video element not found after initialization")
      }

      if (!recognizer) {
        throw new Error("MediaPipe recognizer not initialized")
      }

      if (!streamRef.current || !streamRef.current.active) {
        throw new Error("Camera stream not active")
      }

        // Wait for video to be fully loaded with multiple attempts
        let loadAttempts = 0
        const maxLoadAttempts = 10
        while (videoEl.readyState < 2 && loadAttempts < maxLoadAttempts) {
          console.log(`Waiting for video to load... attempt ${loadAttempts + 1}/${maxLoadAttempts}`);
          await new Promise((resolve) => setTimeout(resolve, 500))
          loadAttempts++
        }

      if (videoEl.readyState < 2) {
        throw new Error("Video not loaded after multiple attempts. Please check your camera connection.")
      }

      if (videoEl.videoWidth === 0 || videoEl.videoHeight === 0) {
        console.log(`Video dimensions: ${videoEl.videoWidth}x${videoEl.videoHeight}`);
        throw new Error("Video has no dimensions. Camera may not be working properly.")
      }

      // Ensure video is playing
      if (videoEl.paused || videoEl.ended) {
        try {
          await videoEl.play()
        } catch (playError) {
          console.warn('Play error:', playError);
          // Don't throw here, just log the warning as some browsers handle this differently
        }
      }

      // Final check before starting recognition
      if (!videoRef.current) {
        throw new Error("Video element became unavailable during setup")
      }

      isRunningRef.current = true
      setAiInitializing(true) // Start in initializing state
      console.log("Starting gesture recognition loop")
      console.log(`Video ready: ${videoEl.videoWidth}x${videoEl.videoHeight}, readyState: ${videoEl.readyState}`);
      console.log("AI model will initialize on first recognition attempt")
      rafRef.current = requestAnimationFrame(() => recognizeFrame(videoEl))
    } catch (error) {
      console.error("Failed to start sign language detection:", error)
      setError(error instanceof Error ? error.message : "Failed to start detection")
      isRunningRef.current = false
    }
  }, [loadModel, startCamera, recognizeFrame, videoRef])

  const stop = useCallback(() => {
    console.log("Stopping sign language detection")
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
    aiInitializing,
    start,
    stop,
  }
}