"use client"

import React, { createElement, useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { extractSrt } from "@/lib/extractor"

type CaptionType = {
  sequence: number
  start_time: string
  end_time: string
  caption: string
}

type WatchViewProps = {
  videoId?: string
  videoUrl?: string | "/test.mp4"
  captionUrl?: string | null
  posterUrl?: string | null

  signVideoUrl?: string | "/test.mp4"
  signCaptionUrl?: string | null
  initialSpeed?: number
}

export default function WatchView({
  videoUrl,
  captionUrl,
  posterUrl,
  signVideoUrl,
  signCaptionUrl,
  initialSpeed = 1.0,
}: WatchViewProps) {
  const hasVideo = Boolean(videoUrl)
  const hasSignVideo = Boolean(signVideoUrl)

  const mainRef = useRef<HTMLVideoElement | null>(null)
  const signRef = useRef<HTMLVideoElement | null>(null)

  const [syncMode, setSyncMode] = useState<"adjust" | "pause">("adjust")
  const [speed, setSpeed] = useState<string>(() => `${initialSpeed}`)
  const numericSpeed = useMemo(() => Number.parseFloat(speed) || 1.0, [speed])
  const [captions, setCaptions] = useState<CaptionType[]>([])
  const [currentCaption, setCurrentCaption] = useState<string>("")
  const [_poseData, setPoseData] = useState<string | null>(null)

  const [_mainTime, setMainTime] = useState<number>(0)

  const [simOffset, setSimOffset] = useState<number>(0)
  const [showGrid, setShowGrid] = useState<boolean>(false)
  const [highContrast, setHighContrast] = useState<boolean>(false)

  const prevCaptionRef = useRef<string>("")
  const poseUrlRef = useRef<string | null>(null)

  const fetchPoseData = useCallback(async (caption: string): Promise<string | null> => {
    console.log("Fetching pose data for caption:", caption)
    if (!caption) return null
    try {
      const response = await fetch(
        `https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_pose?text=${encodeURI(
          caption,
        )}&spoken=en&signed=ase`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      if (!response.ok) {
        throw new Error("Failed to fetch pose file")
      }

      const poseFileBlob = await response.blob()

      if (poseUrlRef.current) {
        URL.revokeObjectURL(poseUrlRef.current)
      }

      const fileUrl = URL.createObjectURL(poseFileBlob)
      poseUrlRef.current = fileUrl

      return fileUrl
    } catch (error) {
      console.error("Error fetching pose data:", error)
      return null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (poseUrlRef.current) {
        URL.revokeObjectURL(poseUrlRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const main = mainRef.current
    const sign = signRef.current
    const targetRate = syncMode === "adjust" ? numericSpeed : 1.0
    if (main) main.playbackRate = targetRate
    if (sign) sign.playbackRate = targetRate
  }, [syncMode, numericSpeed])

  const pauseBoth = () => {
    mainRef.current?.pause()
    signRef.current?.pause()
  }

  const formatOffset = (sec: number) => {
    if (sec === 0) return "0.0s"
    return `${sec > 0 ? "+" : ""}${sec.toFixed(1)}s`
  }

  const timeStringToSeconds = useCallback((timeString: string): number => {
    const [hours, minutes, seconds] = timeString.split(":")
    const [sec, ms] = seconds.split(",")
    return (
      Number.parseInt(hours) * 3600 + Number.parseInt(minutes) * 60 + Number.parseInt(sec) + Number.parseInt(ms) / 1000
    )
  }, [])

  const findCurrentCaption = useCallback(
    (currentTime: number, captionsC: CaptionType[]): CaptionType | undefined => {
      return captionsC.find((caption) => {
        const startTime = timeStringToSeconds(caption.start_time)
        const endTime = timeStringToSeconds(caption.end_time)
        return currentTime >= startTime && currentTime <= endTime
      })
    },
    [timeStringToSeconds],
  )

  useEffect(() => {
    if (captionUrl) {
      extractSrt(captionUrl)
        .then((extractedCaptions: CaptionType[]) => {
          console.log("Extracted captions:", extractedCaptions)
          setCaptions(extractedCaptions)
        })
        .catch((error: unknown) => {
          console.error("Error extracting captions:", error)
        })
    }
  }, [captionUrl])

  useEffect(() => {
    const main = mainRef.current
    const sign = signRef.current
    if (!main) return

    let raf = 0
    const DRIFT_THRESHOLD = 0.25
    let lastCaptionTime = -1

    const tick = async () => {
      const t = main.currentTime || 0
      setMainTime(t)

      if (captionUrl && captions.length > 0 && Math.abs(t - lastCaptionTime) > 0.1) {
        lastCaptionTime = t
        const caption = findCurrentCaption(t, captions)
        const newCaptionText = caption?.caption || ""

        if (newCaptionText !== prevCaptionRef.current) {
          prevCaptionRef.current = newCaptionText
          setCurrentCaption(newCaptionText)

          if (newCaptionText) {
            const poseFileData = await fetchPoseData(newCaptionText)
            if (poseFileData) {
              setPoseData(poseFileData)
            }
          } else {
            setPoseData(null)
          }
        }
      }

      if (sign) {
        const desired = t + simOffset
        const current = sign.currentTime || 0
        const drift = desired - current
        if (Math.abs(drift) > DRIFT_THRESHOLD) {
          sign.currentTime = Math.max(0, desired)
        }
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [captionUrl, captions, findCurrentCaption, simOffset, fetchPoseData])

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="order-1 lg:order-1 aspect-video rounded-lg overflow-hidden relative border bg-background">
          {captionUrl && captions.length > 0 ? (
            <>
              {createElement("pose-viewer", {
                className: "w-full h-full",
                src: "/test/shape.pose",
                "aria-label": "Sign language pose viewer",
                loop: "true",
              })}
              <div className="absolute inset-x-0 top-0 bg-black/40 text-white text-xs px-3 py-1">
                {"Pose Simulation — synchronized with captions"}
              </div>
              {currentCaption && (
                <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs px-3 py-2">
                  {currentCaption}
                </div>
              )}
            </>
          ) : hasSignVideo ? (
            <video
              ref={signRef}
              className="w-full h-full"
              controls={false}
              muted
              playsInline
              preload="metadata"
              poster="/placeholder.svg?height=720&width=1280"
              aria-label="Sign language simulation video"
            >
              <source src={signVideoUrl} type="video/mp4" />
              {signCaptionUrl ? <track src={signCaptionUrl} kind="captions" srcLang="en" label="English" /> : null}
              {"Your browser does not support the video tag!"}
            </video>
          ) : (
            <>
              <Image
                src="/placeholder.svg?height=720&width=1280"
                alt="Sign simulation unavailable"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs px-3 py-2">
                {"Sign Language Simulation (no video available)"}
              </div>
            </>
          )}
          <div className="absolute inset-x-0 top-0 bg-black/40 text-white text-xs px-3 py-1">
            {"Simulation — synchronized with main"}
          </div>
        </div>

        <div className="order-2 lg:order-2 aspect-video rounded-lg overflow-hidden bg-black relative">
          {hasVideo ? (
            <React.Fragment>
              <video
                ref={mainRef}
                className="w-full h-full"
                controls
                preload="metadata"
                playsInline
                poster={posterUrl ?? undefined}
                aria-label="Main source video"
              >
                <source src={videoUrl} type="video/mp4" />
                <track src={captionUrl || undefined} kind="captions" srcLang="en" label="English" default />
              </video>
              {!captionUrl && <div className="text-xs text-red-600">No captions available for this video.</div>}
              <div>{"Your browser does not support the video tag!"}</div>
            </React.Fragment>
          ) : (
            <>
              <Image
                src={
                  posterUrl || "/placeholder.svg?height=720&width=1280&query=video%20placeholder" || "/placeholder.svg"
                }
                alt="Video unavailable"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover opacity-80"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-md bg-black/60 text-white px-4 py-2 text-sm">
                  {"Video unavailable in this draft"}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-40">
            <label htmlFor="speed" className="block text-sm font-medium mb-1">
              {"Playback speed"}
            </label>
            <Select value={speed} onValueChange={setSpeed}>
              <SelectTrigger aria-label="Select playback speed">
                <SelectValue placeholder="1.0x" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">{"0.5x"}</SelectItem>
                <SelectItem value="0.75">{"0.75x"}</SelectItem>
                <SelectItem value="1.0">{"1.0x"}</SelectItem>
                <SelectItem value="1.25">{"1.25x"}</SelectItem>
                <SelectItem value="1.5">{"1.5x"}</SelectItem>
                <SelectItem value="2.0">{"2.0x"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-40">
            <label htmlFor="sync" className="block text-sm font-medium mb-1">
              {"Sync strategy"}
            </label>
            <Select value={syncMode} onValueChange={(v: string) => setSyncMode(v as "adjust" | "pause")}>
              <SelectTrigger aria-label="Select sync strategy">
                <SelectValue placeholder="Adjust speed (default)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adjust">{"Adjust speed (default)"}</SelectItem>
                <SelectItem value="pause">{"Pause to match"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {syncMode === "pause" ? (
            <div className="flex items-end">
              <Button variant="outline" onClick={pauseBoth} disabled={!hasVideo && !hasSignVideo}>
                {"Pause both now"}
              </Button>
            </div>
          ) : null}
        </div>

        <p className="text-xs text-muted-foreground">
          {"Both videos follow the same speed. Use offset below for fine alignment."}
        </p>
      </div>

      <div className="rounded-lg border p-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[220px]">
            <label htmlFor="sim-offset" className="block text-sm font-medium mb-1">
              {"Simulation offset (lead/lag)"}
            </label>
            <Slider
              value={[simOffset]}
              min={-2}
              max={2}
              step={0.1}
              onValueChange={(v: number[]) => setSimOffset(v[0] ?? 0)}
              aria-label="Simulation offset seconds"
            />
            <span className="text-xs text-muted-foreground">{formatOffset(simOffset)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="sim-grid" checked={showGrid} onCheckedChange={setShowGrid} />
            <label htmlFor="sim-grid" className="text-sm">
              {"Grid (visual aid)"}
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="sim-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
            <label htmlFor="sim-contrast" className="text-sm">
              {"High contrast (visual aid)"}
            </label>
          </div>

          <div className="ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSimOffset(0)
                setShowGrid(false)
                setHighContrast(false)
              }}
            >
              {"Reset"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}