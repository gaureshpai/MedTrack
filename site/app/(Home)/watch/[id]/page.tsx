import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import LikeButton from "@/components/watch/like-button"
import WatchView from "@/components/watch/watch-view"
import { getVideoById, getChannelByName, type Channel } from "@/data/draft"

type PageProps = {
  params?: Promise<{ id?: string }>
}

export default async function Page({ params }: PageProps) {
  const id = (await params)?.id ?? "1"
  const video = getVideoById(id)
  
  const MEDIA_MAP: Record<
    string,
    { videoUrl?: string; captionUrl?: string; signVideoUrl?: string; signCaptionUrl?: string }
  > = {
    "1": {
      videoUrl: "/test/shape.mp4",
      captionUrl: "/test/shape.srt",
      signVideoUrl: "/path-to-your-sign-video.mp4",
    },
  }

  const mapped = MEDIA_MAP[String(id)] || {}
  const videoUrl = mapped.videoUrl ?? null
  const captionUrl = mapped.captionUrl ?? null
  const signVideoUrl = mapped.signVideoUrl ?? null
  const signCaptionUrl = mapped.signCaptionUrl ?? null
  const posterUrl = video?.thumbnail || "/placeholder.svg?height=720&width=1280"

  const title = video?.title ?? "Untitled"
  const views = video?.views ?? "—"
  const time = video?.time ?? "—"
  const initialWatchSpeed = video?.watchSpeed ?? 1.0
  const initialLiked = Boolean(video?.isLiked)
  
  let channel: Channel | null = null
  if (video?.channel && typeof video.channel === "object") {
    channel = video.channel as Channel
  } else if (typeof video?.channel === "string") {
    channel = getChannelByName(video.channel) ?? null
  }

  return (
    <main className="min-h-screen bg-background">
      <script src="https://unpkg.com/pose-viewer@latest/dist/pose-viewer/pose-viewer.esm.js" type="module"></script>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6">
          <WatchView
            videoId={String(id)}
            videoUrl={videoUrl}
            captionUrl={captionUrl}
            posterUrl={posterUrl}
            signVideoUrl={signVideoUrl}
            signCaptionUrl={signCaptionUrl}
            initialSpeed={initialWatchSpeed}
          />

          <section className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl font-bold">{title}</h1>
              <LikeButton videoId={String(id)} baseCount={0} initialLiked={initialLiked} />
            </div>
            <div className="text-sm text-muted-foreground">{`${views} • ${time}`}</div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={channel?.avatar || "/placeholder.svg?height=80&width=80&query=channel%20avatar"}
                    alt={`${channel?.name ?? "Unknown Channel"} channel avatar`}
                  />
                  <AvatarFallback>{(channel?.name ?? "C").slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{channel?.name ?? "Unknown Channel"}</div>
                  <div className="text-xs text-muted-foreground">{channel?.subscribers ?? "—"}</div>
                </div>
              </div>
              <Button className="shrink-0">Subscribe</Button>
            </div>
          </section>

        </div>
      </div>
    </main>
  )
}