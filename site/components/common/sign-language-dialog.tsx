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
  const [recognizedText, setRecognizedText] = useState<string>("")
  const [retryCount, setRetryCount] = useState(0)

  const {
    loading,
    error,
    start: startRecognition,
    stop: stopRecognition,
    lastWord,
    recognizedGesture,
    cameraReady,
  } = useSignLanguage({
    videoRef,
    onRecognizedWord: (word) => {
      console.log("[v0] Sign language dialog received word:", word)
      setRecognizedText((prev) => prev + word + " ")
      onResult(word)
    },
  })

  useEffect(() => {
    let cancelled = false
    async function open() {
      if (!isCameraModalOpen) return

      try {
        console.log("[v0] Dialog opening, starting recognition...")
        setRecognizedText("") // Clear text when opening
        setRetryCount(0) // Reset retry count
        await startRecognition()
        if (!cancelled) {
          console.log("[v0] Recognition started successfully")
          setStreaming(true)
        }
      } catch (err) {
        console.error("[v0] Failed to start recognition in dialog:", err)
        setStreaming(false)
      }
    }

    if (isCameraModalOpen) {
      open()
    } else {
      stopRecognition()
      setStreaming(false)
      setRecognizedText("")
      setRetryCount(0)
    }

    return () => {
      cancelled = true
    }
  }, [isCameraModalOpen, stopRecognition, startRecognition])

  const handleRetry = async () => {
    try {
      console.log("[v0] Retrying camera initialization...")
      setRetryCount((prev) => prev + 1)
      stopRecognition()
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait before retry
      await startRecognition()
      setStreaming(true)
    } catch (err) {
      console.error("[v0] Retry failed:", err)
      setStreaming(false)
    }
  }

  const handleClose = (open: boolean) => {
    setIsCameraModalOpen(open)
  }

  const handleClearText = () => {
    setRecognizedText("")
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
          <video
            ref={videoRef}
            className="mx-auto h-48 w-full max-w-[420px] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 object-cover"
            muted
            playsInline
          />

          <div className="text-sm text-gray-500">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                "Loading camera..."
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
              "Show hand gestures to the camera (Demo Mode)"
            ) : (
              "Click Start Camera to begin"
            )}
          </div>

          {recognizedText && (
            <div className="bg-gray-50 rounded-lg p-3 border">
              <div className="text-sm text-gray-600 mb-1">Recognized Text:</div>
              <div className="font-mono text-lg break-words">{recognizedText.trim()}</div>
              <Button variant="outline" size="sm" onClick={handleClearText} className="mt-2 bg-transparent">
                Clear
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Camera:</span>{" "}
              <span className={`font-medium ${cameraReady ? "text-green-600" : "text-orange-600"}`}>
                {cameraReady ? "Ready" : "Not Ready"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>{" "}
              <span className={`font-medium ${streaming ? "text-green-600" : "text-gray-600"}`}>
                {streaming ? "Active" : "Stopped"}
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

          <div className="flex gap-2 justify-center flex-wrap">
            {streaming ? (
              <Button
                variant="outline"
                onClick={() => {
                  console.log("[v0] User clicked pause")
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
                    console.log("[v0] User clicked start camera")
                    await startRecognition()
                    setStreaming(true)
                  } catch (err) {
                    console.error("[v0] Failed to start from button click:", err)
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