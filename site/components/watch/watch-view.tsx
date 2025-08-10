"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

type WatchViewProps = {
  videoId?: string
  videoUrl?: string | null
  captionUrl?: string | null
  posterUrl?: string | null
  
  signVideoUrl?: string | null
  signCaptionUrl?: string | null
  initialSpeed?: number
}

export default function WatchView({
  videoId = "1",
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
  
  const [mainTime, setMainTime] = useState<number>(0)
  
  const [simOffset, setSimOffset] = useState<number>(0) 
  const [showGrid, setShowGrid] = useState<boolean>(false) 
  const [highContrast, setHighContrast] = useState<boolean>(false) 
  
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
  
  useEffect(() => {
    const main = mainRef.current
    const sign = signRef.current
    if (!main || !sign) return

    const onPlay = async () => {
      try {
        sign.playbackRate = main.playbackRate
        await sign.play()
      } catch { }
    }
    const onPause = () => {
      sign.pause()
    }
    const onSeeking = () => {
      const desired = (main.currentTime || 0) + simOffset
      sign.currentTime = Math.max(0, desired)
    }
    const onRateChange = () => {
      sign.playbackRate = main.playbackRate
    }

    main.addEventListener("play", onPlay)
    main.addEventListener("pause", onPause)
    main.addEventListener("seeking", onSeeking)
    main.addEventListener("ratechange", onRateChange)
    return () => {
      main.removeEventListener("play", onPlay)
      main.removeEventListener("pause", onPause)
      main.removeEventListener("seeking", onSeeking)
      main.removeEventListener("ratechange", onRateChange)
    }
  }, [simOffset, hasSignVideo])
  
  useEffect(() => {
    const main = mainRef.current
    const sign = signRef.current
    if (!main || !sign) return

    let raf = 0
    const DRIFT_THRESHOLD = 0.25 
    const tick = () => {
      const t = main.currentTime || 0
      setMainTime(t)
      const desired = t + simOffset
      const current = sign.currentTime || 0
      const drift = desired - current
      if (Math.abs(drift) > DRIFT_THRESHOLD) {
        sign.currentTime = Math.max(0, desired)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [simOffset, hasVideo, hasSignVideo])
  const formatOffset = (sec: number) => {
    if (sec === 0) return "0.0s"
    return `${sec > 0 ? "+" : ""}${sec.toFixed(1)}s`
  }

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="order-1 lg:order-1 aspect-video rounded-lg overflow-hidden relative border bg-background">
          {hasSignVideo ? (
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
              <source src={signVideoUrl!} type="video/mp4" />
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
            <video
              ref={mainRef}
              className="w-full h-full"
              controls
              preload="metadata"
              playsInline
              poster={posterUrl ?? undefined}
              aria-label="Main source video"
            >
              <source src={videoUrl!} type="video/mp4" />
              {captionUrl ? <track src={captionUrl} kind="captions" srcLang="en" label="English" default /> : null}
              {"Your browser does not support the video tag!"}
            </video>
          ) : (
            <>
              <Image
                src={posterUrl || "/placeholder.svg?height=720&width=1280&query=video%20placeholder"}
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
            <label className="block text-sm font-medium mb-1">{"Playback speed"}</label>
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
            <label className="block text-sm font-medium mb-1">{"Sync strategy"}</label>
            <Select value={syncMode} onValueChange={(v) => setSyncMode(v as "adjust" | "pause")}>
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
            <label className="block text-sm font-medium mb-1">{"Simulation offset (lead/lag)"}</label>
            <Slider
              value={[simOffset]}
              min={-2}
              max={2}
              step={0.1}
              onValueChange={(v) => setSimOffset(v[0] ?? 0)}
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