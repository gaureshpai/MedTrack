"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mic } from "lucide-react"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"

type VoiceSearchDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTranscriptChange: (transcript: string, isFinal: boolean) => void
}

export default function VoiceSearchDialog({ open, onOpenChange, onTranscriptChange }: VoiceSearchDialogProps) {
  const { supported, listening, interimTranscript, finalTranscript, error, start, stop, reset } = useSpeechRecognition({
    lang: "en-US",
    continuous: true,
    interimResults: true,
    onResult: (text, isFinal) => {
      onTranscriptChange(text, isFinal)
    },
  })

  const displayText = finalTranscript || interimTranscript || (listening ? "Listening..." : "")

  useEffect(() => {
    if (!open) {
      stop()
      reset()
      return
    }
    start().catch(() => {})
  }, [open, start, stop, reset])

  const friendlyError =
    error === "network"
      ? "Network error from the speech service. Check your internet/VPN and try again (Chrome + HTTPS recommended)."
      : error === "not-allowed"
        ? "Microphone permission was denied. Allow mic access in your browser settings and try again."
        : error === "audio-capture"
          ? "No microphone detected. Plug in or enable a mic and try again."
          : error === "aborted" || error === "no-speech"
            ? null
            : error || null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm mx-auto px-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className={`h-5 w-5 ${listening ? "text-red-600" : ""}`} />
            Voice Search
          </DialogTitle>
        </DialogHeader>

        {!supported ? (
          <div className="py-6 text-center space-y-3">
            <p className="text-sm text-gray-600 mb-3">
              Speech Recognition is not available in your current browser.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left text-sm">
              <div className="font-medium text-blue-800 mb-2">Supported Browsers:</div>
              <ul className="text-blue-700 space-y-1">
                <li>• Chrome (recommended)</li>
                <li>• Edge (latest versions)</li>
                <li>• Safari (iOS 14.5+)</li>
              </ul>
              <div className="mt-2 text-blue-600">
                <strong>Note:</strong> HTTPS is required for this feature.
              </div>
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Mic className={`h-10 w-10 ${listening ? "text-red-600 animate-pulse" : "text-red-600"}`} />
            </div>

            <p className="text-lg font-medium mb-2" aria-live="polite" aria-atomic="true">
              {displayText || "Listening..."}
            </p>
            <p className="text-sm text-gray-500 mb-4">Speak to fill the search box. Close when you&apos;re done.</p>

            {friendlyError && <p className="text-sm text-red-600 mb-3">{friendlyError}</p>}

            <div className="flex items-center justify-center gap-2">
              {listening ? (
                <Button variant="outline" onClick={stop}>
                  Stop
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={() => {
                    reset()
                    start().catch(() => {})
                  }}
                >
                  Retry
                </Button>
              )}
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}