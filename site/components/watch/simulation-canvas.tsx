"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type SimulationCanvasProps = {
  timeSec: number
  highContrast?: boolean
  showGrid?: boolean
  className?: string
}

export default function SimulationCanvas({
  timeSec,
  highContrast = false,
  showGrid = true,
  className,
}: SimulationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = window.devicePixelRatio || 1
      const w = parent.clientWidth
      const h = Math.round((w * 9) / 16)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement as Element)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const w = (canvas as HTMLCanvasElement).clientWidth
    const h = (canvas as HTMLCanvasElement).clientHeight

    const bg = highContrast ? "#0a0a0a" : "#111827"
    const fg = highContrast ? "#00ff88" : "#10b981"
    const fg2 = highContrast ? "#ffd400" : "#fbbf24"
    const gridColor = highContrast ? "#333333" : "rgba(255,255,255,0.08)"

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    if (showGrid) {
      ctx.strokeStyle = gridColor
      ctx.lineWidth = 1
      const spacing = 32
      for (let x = 0; x < w; x += spacing) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += spacing) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }
    }

    const cx = w / 2
    const cy = h / 2
    const headR = Math.min(w, h) * 0.06
    const shoulderW = Math.min(w, h) * 0.25
    const torsoH = Math.min(w, h) * 0.2
    const armLen = Math.min(w, h) * 0.22
    const handR = Math.min(w, h) * 0.03

    const t = timeSec
    const leftAngle = Math.sin(t * 2.0) * 0.8
    const rightAngle = Math.cos(t * 1.6) * 0.9
    const leftLift = Math.sin(t * 1.3) * 10
    const rightLift = Math.cos(t * 1.1) * 10

    const leftShoulder = { x: cx - shoulderW / 2, y: cy }
    const rightShoulder = { x: cx + shoulderW / 2, y: cy }

    const leftHand = {
      x: leftShoulder.x + Math.cos(leftAngle) * armLen,
      y: leftShoulder.y + Math.sin(leftAngle) * armLen + leftLift,
    }
    const rightHand = {
      x: rightShoulder.x + Math.cos(Math.PI - rightAngle) * armLen,
      y: rightShoulder.y + Math.sin(Math.PI - rightAngle) * armLen + rightLift,
    }
    
    ctx.fillStyle = fg
    ctx.beginPath()
    ctx.arc(cx, cy - torsoH - headR * 0.5, headR, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.fillStyle = fg
    roundRect(ctx, cx - (shoulderW * 0.7) / 2, cy - torsoH / 2, shoulderW * 0.7, torsoH, 8)
    ctx.fill()
    
    ctx.strokeStyle = fg2
    ctx.lineCap = "round"
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(leftShoulder.x, leftShoulder.y)
    ctx.lineTo(leftHand.x, leftHand.y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(rightShoulder.x, rightShoulder.y)
    ctx.lineTo(rightHand.x, rightHand.y)
    ctx.stroke()
    
    ctx.fillStyle = fg2
    ctx.beginPath()
    ctx.arc(leftHand.x, leftHand.y, handR, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(rightHand.x, rightHand.y, handR, 0, Math.PI * 2)
    ctx.fill()
    
    const baseY = h - 28
    ctx.strokeStyle = highContrast ? "#ffffff" : "rgba(255,255,255,0.6)"
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let x = 0; x <= w; x += 6) {
      const phase = (x / w) * Math.PI * 4 + t * 3.0
      const y = baseY + Math.sin(phase) * 6
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }, [timeSec, highContrast, showGrid])

  return <canvas ref={canvasRef} className={cn("w-full h-auto block", className)} />
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}