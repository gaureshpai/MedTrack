"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"

type LikeButtonProps = {
  videoId: string
  baseCount?: number
  initialLiked?: boolean
}

export default function LikeButton({ videoId, baseCount = 0, initialLiked = false }: LikeButtonProps) {
  const storageKey = useMemo(() => `like:video:${videoId}`, [videoId])
  const [liked, setLiked] = useState<boolean>(initialLiked)
  const [count, setCount] = useState<number>(baseCount + (initialLiked ? 1 : 0))

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(storageKey)
      if (v === "1" && !liked) {
        setLiked(true)
        setCount((c) => c + (initialLiked ? 0 : 1))
      }
    } catch {}
  }, [storageKey, liked, initialLiked])

  function toggle() {
    setLiked((prev) => {
      const next = !prev
      setCount((c) => c + (next ? 1 : -1))
      try {
        if (next) window.localStorage.setItem(storageKey, "1")
        else window.localStorage.removeItem(storageKey)
      } catch {}
      return next
    })
  }

  return (
    <Button
      variant={liked ? "default" : "outline"}
      size="sm"
      onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? "Unlike this video" : "Like this video"}
      className="gap-2"
    >
      <ThumbsUp className="h-4 w-4" />
      <span className="tabular-nums">{count.toLocaleString()}</span>
    </Button>
  )
}