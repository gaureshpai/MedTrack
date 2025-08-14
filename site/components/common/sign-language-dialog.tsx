"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Video, CirclePause, Play } from "lucide-react"
import { useSignLanguage } from "@/hooks/use-sign-language"

type Props = {
  isCameraModalOpen: boolean
  setIsCameraModalOpen: (open: boolean) => void
  onResult: (text: string) => void
}

export default function SignLanguageDialog({ isCameraModalOpen, setIsCameraModalOpen, onResult }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [streaming, setStreaming] = useState(false)

  const {
    loading,
    error,
    start: startRecognition,
    stop: stopRecognition,
    lastWord,
    recognizedGesture,
  } = useSignLanguage({
    videoRef,
    onRecognizedWord: (word) => {
      onResult(word)
    },
  })

  useEffect(() => {
    let cancelled = false
    async function open() {
      try {
        await startRecognition()
        if (!cancelled) setStreaming(true)
      } catch { }
    }
    if (isCameraModalOpen) open()
    return () => {
      cancelled = true
      stopRecognition()
      setStreaming(false)
    }
  }, [isCameraModalOpen, stopRecognition, startRecognition])

  const handleClose = (open: boolean) => {
    setIsCameraModalOpen(open)
  }

  return (
    <Dialog open={isCameraModalOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-sm mx-auto px-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Sign Language Search
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 text-center">
          <video
            ref={videoRef}
            className="mx-auto h-48 w-full max-w-[420px] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 object-cover"
            muted
            playsInline
          />
          <div className="mt-3 text-sm text-gray-500">
            {loading ? (
              "Loading gesture model..."
            ) : error ? (
              <span className="text-red-600">{error}</span>
            ) : (
              "Show a hand gesture in view"
            )}
          </div>

          <div className="mt-4">
            <div className="text-sm">
              <span className="text-gray-500">Last gesture:</span>{" "}
              <span className="font-medium">{recognizedGesture || "—"}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Appended word:</span>{" "}
              <span className="font-medium">{lastWord || "—"}</span>
            </div>
          </div>

          <div className="flex gap-2 justify-center flex-wrap mt-5">
            {streaming ? (
              <Button
                variant="outline"
                className="text-sm bg-transparent"
                onClick={() => {
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
                className="text-sm"
                onClick={async () => {
                  try {
                    await startRecognition()
                    setStreaming(true)
                  } catch { }
                }}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Camera
              </Button>
            )}
            <Button
              variant="outline"
              className="text-sm bg-transparent"
              onClick={() => {
                handleClose(false)
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
