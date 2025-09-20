"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Video, CirclePause, Play, AlertCircle, RefreshCw } from "lucide-react"
import { useSignLanguage } from "@/hooks/use-sign-language"

type Props = {
  isCameraModalOpen: boolean
  setIsCameraModalOpen: (open: boolean) => void
  onResult: (text: string) => void
}

export default function SignLanguageDialog({ isCameraModalOpen, setIsCameraModalOpen, onResult }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [streaming, setStreaming] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [videoMounted, setVideoMounted] = useState(false)

  const {
    loading,
    error,
    start: startRecognition,
    stop: stopRecognition,
    lastWord,
    recognizedGesture,
    cameraReady,
    aiInitializing,
  } = useSignLanguage({
    videoRef,
    onRecognizedWord: (word) => {
      console.log("Sign language dialog received word:", word)
      onResult(word)
    },
  })

  useEffect(() => {
    let cancelled = false
    async function open() {
      if (!isCameraModalOpen) return

      try {
        console.log("Dialog opening, waiting for video element...")
        setRetryCount(0) // Reset retry count
        
        // Wait for video element to be available
        let attempts = 0
        const maxAttempts = 20
        while (!videoRef.current && attempts < maxAttempts && !cancelled) {
          console.log(`Dialog waiting for video element... attempt ${attempts + 1}/${maxAttempts}`);
          await new Promise(resolve => setTimeout(resolve, 500))
          attempts++
          
          // Extra wait time for initial attempts
          if (attempts === 3) {
            console.log('Giving extra time for video element mounting...')
            await new Promise(resolve => setTimeout(resolve, 1500))
          }
        }
        
        if (!videoRef.current) {
          throw new Error("Video element not available in dialog. Please try closing and reopening.")
        }
        
        if (cancelled) return
        
        console.log("Video element found, starting recognition...")
        await startRecognition()
        if (!cancelled) {
          console.log("Recognition started successfully")
          setStreaming(true)
        }
      } catch (err) {
        console.error("Failed to start recognition in dialog:", err)
        setStreaming(false)
      }
    }

    if (isCameraModalOpen) {
      // Small delay to ensure dialog is fully rendered
      setTimeout(() => {
        if (!cancelled && isCameraModalOpen) {
          open()
        }
      }, 100)
    } else {
      stopRecognition()
      setStreaming(false)
      setRetryCount(0)
    }

    return () => {
      cancelled = true
    }
  }, [isCameraModalOpen, stopRecognition, startRecognition])

  const handleRetry = async () => {
    try {
      console.log("Retrying camera initialization...")
      setRetryCount((prev) => prev + 1)
      stopRecognition()
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait before retry
      await startRecognition()
      setStreaming(true)
    } catch (err) {
      console.error("Retry failed:", err)
      setStreaming(false)
    }
  }

  const handleClose = (open: boolean) => {
    setIsCameraModalOpen(open)
  }


  return (
    <Dialog open={isCameraModalOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-md mx-auto px-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Sign Language Search
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 text-center space-y-4">
          <div className="relative">
            <video
              ref={(el) => {
                videoRef.current = el
                if (el && !videoMounted) {
                  console.log('Video element mounted in dialog')
                  setVideoMounted(true)
                }
              }}
              className="mx-auto h-48 w-full max-w-[420px] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 object-cover"
              muted
              playsInline
              autoPlay
              style={{ transform: 'scaleX(-1)' }} // Mirror the video for better UX
              onLoadedMetadata={() => console.log('Video metadata loaded in dialog')}
              onCanPlay={() => console.log('Video can play in dialog')}
              onError={(e) => console.error('Video error in dialog:', e)}
            />
            {streaming && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                LIVE
              </div>
            )}
            {!cameraReady && !error && (
              <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-2"></div>
                  <div className="text-sm">Preparing camera...</div>
                </div>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                "Loading model and camera..."
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-2 text-red-600">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
                {retryCount < 3 && (
                  <Button variant="outline" size="sm" onClick={handleRetry} className="mt-2 bg-transparent">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry ({retryCount + 1}/3)
                  </Button>
                )}
              </div>
            ) : !cameraReady ? (
              "Initializing camera..."
            ) : streaming ? (
              aiInitializing ? (
                <div className="space-y-1">
                  <div className="text-blue-600 font-medium flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    AI Initializing...
                  </div>
                  <div className="text-xs text-gray-600">TensorFlow Lite is starting up (first time only)</div>
                  <div className="text-xs text-gray-500">This will only take a few seconds</div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-green-600 font-medium">✅ Ready! Show ASL letters (A-Z) to spell words</div>
                  <div className="text-xs text-blue-600 font-medium">Use the Search button to submit</div>
                  <div className="text-xs text-gray-500">AI model loaded and running</div>
                </div>
              )
            ) : (
              "Click Start Camera to begin sign language detection"
            )}
          </div>


          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Camera:</span>{" "}
              <span className={`font-medium ${cameraReady ? "text-green-600" : "text-orange-600"}`}>
                {cameraReady ? "Ready" : "Not Ready"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>{" "}
              <span className={`font-medium ${
                streaming 
                  ? aiInitializing 
                    ? "text-blue-600" 
                    : "text-green-600" 
                  : "text-gray-600"
              }`}>
                {streaming 
                  ? aiInitializing 
                    ? "Initializing" 
                    : "Active" 
                  : "Stopped"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Last gesture:</span>{" "}
              <span className="font-medium">{recognizedGesture || "—"}</span>
            </div>
            <div>
              <span className="text-gray-500">Last word:</span> <span className="font-medium">{lastWord || "—"}</span>
            </div>
          </div>

          {/* Instructions Panel */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-left text-sm">
            <div className="font-medium text-yellow-800 mb-2">📚 How to use:</div>
            <div className="space-y-1 text-yellow-700">
              <div>1. Form ASL letters A-Z to spell words</div>
              <div>2. Letters appear in the text box above</div>
              <div>3. Click the Search button to submit</div>
              <div>4. The camera is mirrored for easier use</div>
              <div>5. Hold gestures steady for 2-3 seconds</div>
            </div>
          </div>

          <div className="flex gap-2 justify-center flex-wrap">
            {streaming ? (
              <Button
                variant="outline"
                onClick={() => {
                  console.log("User clicked pause")
                  stopRecognition()
                  setStreaming(false)
                }}
              >
                <CirclePause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={async () => {
                  try {
                    console.log("User clicked start camera")
                    await startRecognition()
                    setStreaming(true)
                  } catch (err) {
                    console.error("Failed to start from button click:", err)
                  }
                }}
                disabled={loading}
              >
                <Play className="h-4 w-4 mr-2" />
                {loading ? "Loading..." : "Start Camera"}
              </Button>
            )}
            <Button variant="outline" onClick={() => handleClose(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}