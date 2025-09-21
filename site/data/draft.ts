export interface Channel {
  id: string
  name: string
  avatar: string
  subscribers: string
  isVerified: boolean
  isSubscribed: boolean
}

export interface Video {
  id: string | number
  title: string
  thumbnail: string
  duration: string
  views: string
  time: string
  channel?: Channel | string
  isSaved?: boolean
  isWatched?: boolean
  watchedAt?: Date
  lastWatchedAt?: Date
  watchProgress?: number
  watchDuration?: string
  watchDurationSeconds?: number
  resumePosition?: number
  watchCount?: number
  completedAt?: Date
  addedToHistoryAt?: Date
  deviceWatchedOn?: string
  watchQuality?: string
  watchSpeed?: number
  isLive?: boolean
  watchSource?: string
  isLiked?: boolean
  isDisliked?: boolean
  hasCommented?: boolean
  isShared?: boolean
  hasClosedCaptions?: boolean
  hasSignLanguage?: boolean
  captionLanguage?: string
  signLanguageType?: string
}

export const subscribedChannels: Channel[] = [
  {
    id: "1",
    name: "ASL Learning Hub",
    avatar: "/placeholder.svg?height=40&width=40&text=ASL",
    subscribers: "2.1M",
    isVerified: true,
    isSubscribed: true,
  },
  {
    id: "2",
    name: "Sign Language Stories",
    avatar: "/placeholder.svg?height=40&width=40&text=SLS",
    subscribers: "890K",
    isVerified: true,
    isSubscribed: true,
  },
  {
    id: "3",
    name: "Deaf Culture Today",
    avatar: "/placeholder.svg?height=40&width=40&text=DCT",
    subscribers: "1.5M",
    isVerified: true,
    isSubscribed: true,
  },
  {
    id: "4",
    name: "MedTrack Originals",
    avatar: "/placeholder.svg?height=40&width=40&text=SFO",
    subscribers: "3.2M",
    isVerified: true,
    isSubscribed: true,
  },
  {
    id: "5",
    name: "Hearing Impaired Tech",
    avatar: "/placeholder.svg?height=40&width=40&text=HIT",
    subscribers: "650K",
    isVerified: false,
    isSubscribed: true,
  },
  {
    id: "6",
    name: "SignLearn Academy",
    avatar: "/placeholder.svg?height=40&width=40&text=SLA",
    subscribers: "1.2M",
    isVerified: true,
    isSubscribed: false,
  },
  {
    id: "7",
    name: "Accessible Cooking",
    avatar: "/placeholder.svg?height=40&width=40&text=AC",
    subscribers: "567K",
    isVerified: true,
    isSubscribed: false,
  },
  {
    id: "8",
    name: "EduSign",
    avatar: "/placeholder.svg?height=40&width=40&text=ES",
    subscribers: "890K",
    isVerified: true,
    isSubscribed: false,
  },
  {
    id: "9",
    name: "AccessNews",
    avatar: "/placeholder.svg?height=40&width=40&text=AN",
    subscribers: "234K",
    isVerified: true,
    isSubscribed: false,
  },
  {
    id: "10",
    name: "Inclusive Fitness",
    avatar: "/placeholder.svg?height=40&width=40&text=IF",
    subscribers: "445K",
    isVerified: false,
    isSubscribed: false,
  },
  {
    id: "11",
    name: "HistorySign",
    avatar: "/placeholder.svg?height=40&width=40&text=HS",
    subscribers: "1.8M",
    isVerified: true,
    isSubscribed: false,
  },
]

export const getChannelByName = (name: string): Channel | undefined => {
  return subscribedChannels.find((channel) => channel.name === name)
}

const generateWatchData = (baseDate: Date, isWatched = true) => {
  if (!isWatched) return {}
  const watchProgress = Math.floor(Math.random() * 100)
  const watchCount = Math.floor(Math.random() * 5) + 1
  const watchedAt = new Date(baseDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  return {
    isWatched: true,
    watchedAt,
    lastWatchedAt: watchCount > 1 ? new Date(watchedAt.getTime() + Math.random() * 24 * 60 * 60 * 1000) : watchedAt,
    watchProgress,
    watchDuration: `${Math.floor(Math.random() * 20) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    watchDurationSeconds: Math.floor(Math.random() * 1200) + 60,
    resumePosition: watchProgress < 100 ? Math.floor(Math.random() * 600) : 0,
    watchCount,
    completedAt: watchProgress === 100 ? watchedAt : undefined,
    addedToHistoryAt: watchedAt,
    deviceWatchedOn: ["mobile", "desktop", "tablet"][Math.floor(Math.random() * 3)],
    watchQuality: ["720p", "1080p", "480p"][Math.floor(Math.random() * 3)],
    watchSpeed: [1.0, 1.25, 1.5, 2.0][Math.floor(Math.random() * 4)],
    watchSource: ["recommended", "search", "subscription", "trending"][Math.floor(Math.random() * 4)],
    isLiked: Math.random() > 0.7,
    hasCommented: Math.random() > 0.8,
    isShared: Math.random() > 0.9,
    hasClosedCaptions: true,
    hasSignLanguage: true,
    captionLanguage: "en",
    signLanguageType: "ASL",
  }
}

export const videos: Video[] = [
  {
    id: "1",
    title: "Introduction to Sign Language - Basic Greetings",
    thumbnail: "/sign-language-tutorial.png",
    duration: "12:34",
    views: "125K",
    time: "2 days ago",
    channel: getChannelByName("SignLearn Academy"),
    isSaved: true,
    ...generateWatchData(new Date(), true),
  },
  {
    id: "2",
    title: "Cooking Tutorial: Easy Pasta Recipe with Sign Language",
    thumbnail: "/cooking-tutorial.png",
    duration: "15:22",
    views: "89K",
    time: "1 week ago",
    channel: getChannelByName("Accessible Cooking"),
    isSaved: true,
    ...generateWatchData(new Date(), true),
  },
  {
    id: "3",
    title: "Math Explained: Algebra Basics for Everyone",
    thumbnail: "/placeholder-eeetx.png",
    duration: "18:45",
    views: "234K",
    time: "3 days ago",
    channel: getChannelByName("EduSign"),
    isSaved: true,
    ...generateWatchData(new Date(), true),
  },
  {
    id: "4",
    title: "News Update: Technology Accessibility Advances",
    thumbnail: "/technology-news-collage.png",
    duration: "8:12",
    views: "67K",
    time: "5 hours ago",
    channel: getChannelByName("AccessNews"),
    isSaved: true,
    ...generateWatchData(new Date(), true),
  },
  {
    id: "5",
    title: "Fitness for All: Morning Yoga with Sign Language",
    thumbnail: "/yoga-fitness.png",
    duration: "25:30",
    views: "156K",
    time: "4 days ago",
    channel: getChannelByName("Inclusive Fitness"),
    isSaved: false,
    ...generateWatchData(new Date(), false),
  },
  {
    id: "6",
    title: "History Lesson: World War II Documentary",
    thumbnail: "/history-documentary.png",
    duration: "42:15",
    views: "445K",
    time: "1 week ago",
    channel: getChannelByName("HistorySign"),
    isSaved: false,
    ...generateWatchData(new Date(), true),
  },
  {
    id: "7",
    title: "Sign Language Alphabet Mastery",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Alphabet",
    duration: "9:15",
    views: "98K",
    time: "3 days ago",
    channel: getChannelByName("ASL Learning Hub"),
    isSaved: true,
    ...generateWatchData(new Date(), true),
  },
  {
    id: "8",
    title: "Top 10 Deaf Culture Facts You Didn't Know",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Deaf+Facts",
    duration: "13:27",
    views: "121K",
    time: "6 days ago",
    channel: getChannelByName("Deaf Culture Today"),
    isSaved: false,
    ...generateWatchData(new Date(), false),
  },
  {
    id: "9",
    title: "Live Interpretation Tips for Beginners",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Interpretation+Tips",
    duration: "19:03",
    views: "75K",
    time: "5 days ago",
    channel: getChannelByName("Sign Language Stories"),
    isSaved: true,
    ...generateWatchData(new Date(), true),
  },
  {
    id: "10",
    title: "Accessible Tech: Tools That Change Lives",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Accessible+Tech",
    duration: "11:44",
    views: "82K",
    time: "2 weeks ago",
    channel: getChannelByName("Hearing Impaired Tech"),
    isSaved: false,
    ...generateWatchData(new Date(), false),
  },
  {
    id: "11",
    title: "Understanding Facial Expressions in ASL",
    thumbnail: "/placeholder.svg?height=180&width=320&text=ASL+Expressions",
    duration: "14:29",
    views: "143K",
    time: "1 week ago",
    channel: getChannelByName("MedTrack Originals"),
    isSaved: true,
    ...generateWatchData(new Date(), true),
  },
  {
    id: "12",
    title: "Learn Numbers 1-100 in Sign Language",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Sign+Numbers",
    duration: "20:00",
    views: "211K",
    time: "4 days ago",
    channel: getChannelByName("EduSign"),
    isSaved: false,
    ...generateWatchData(new Date(), false),
  },
]

export const subscriptionVideos: Video[] = [
  {
    id: "sub-1",
    title: "Learn Basic ASL Greetings in 10 Minutes",
    thumbnail: "/placeholder.svg?height=180&width=320&text=ASL+Greetings",
    duration: "10:24",
    views: "125K",
    time: "2 hours ago",
    channel: subscribedChannels[0],
    ...generateWatchData(new Date(), true),
  },
  {
    id: "sub-2",
    title: "LIVE: ASL Q&A Session with Expert Interpreters",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Live+ASL+QA",
    duration: "LIVE",
    views: "2.1K watching",
    time: "Started 30 minutes ago",
    channel: subscribedChannels[0],
    isLive: true,
    ...generateWatchData(new Date(), true),
  },
  {
    id: "sub-3",
    title: "The Beautiful Story of Deaf Poetry",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Deaf+Poetry",
    duration: "15:42",
    views: "89K",
    time: "1 day ago",
    channel: subscribedChannels[1],
    ...generateWatchData(new Date(), true),
  },
  {
    id: "sub-4",
    title: "How Technology is Changing Deaf Education",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Deaf+Tech+Education",
    duration: "22:18",
    views: "156K",
    time: "3 days ago",
    channel: subscribedChannels[2],
    ...generateWatchData(new Date(), true),
  },
  {
    id: "sub-5",
    title: "PREMIERE: New MedTrack Original Series Trailer",
    thumbnail: "/placeholder.svg?height=180&width=320&text=MedTrack+Premiere",
    duration: "2:45",
    views: "45K waiting",
    time: "Premieres in 2 hours",
    channel: subscribedChannels[3],
    ...generateWatchData(new Date(), false),
  },
  {
    id: "sub-6",
    title: "Best Hearing Aids of 2024 - Complete Review",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Hearing+Aids+2024",
    duration: "18:33",
    views: "78K",
    time: "5 days ago",
    channel: subscribedChannels[4],
    ...generateWatchData(new Date(), true),
  },
  {
    id: "sub-7",
    title: "ASL Storytelling: The Three Little Pigs",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Three+Little+Pigs+ASL",
    duration: "12:15",
    views: "234K",
    time: "1 week ago",
    channel: subscribedChannels[1],
    ...generateWatchData(new Date(), true),
  },
  {
    id: "sub-8",
    title: "Understanding Deaf Culture: Common Misconceptions",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Deaf+Culture+Myths",
    duration: "16:28",
    views: "167K",
    time: "1 week ago",
    channel: subscribedChannels[2],
    ...generateWatchData(new Date(), true),
  },
  {
    id: "sub-9",
    title: "Advanced ASL Grammar: Classifiers Explained",
    thumbnail: "/placeholder.svg?height=180&width=320&text=ASL+Classifiers",
    duration: "25:12",
    views: "92K",
    time: "2 weeks ago",
    channel: subscribedChannels[0],
    ...generateWatchData(new Date(), true),
  },
  {
    id: "sub-10",
    title: "Smart Home Setup for Deaf and Hard of Hearing",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Smart+Home+Deaf",
    duration: "14:56",
    views: "143K",
    time: "2 weeks ago",
    channel: subscribedChannels[4],
    ...generateWatchData(new Date(), true),
  },
]

export const channelVideos: Video[] = [
  {
    id: "ch-1",
    title: "Introduction to Sign Language - Basic Greetings",
    thumbnail: "/sign-language-tutorial.png",
    duration: "12:34",
    views: "125K",
    time: "2 days ago",
    ...generateWatchData(new Date(), true),
  },
  {
    id: "ch-2",
    title: "Advanced Sign Language Techniques",
    thumbnail: "/advanced-sign-language.png",
    duration: "25:18",
    views: "89K",
    time: "1 week ago",
    ...generateWatchData(new Date(), false),
  },
  {
    id: "ch-3",
    title: "Cooking with Sign Language Commentary",
    thumbnail: "/cooking-sign-language.png",
    duration: "18:45",
    views: "156K",
    time: "3 days ago",
    ...generateWatchData(new Date(), true),
  },
  {
    id: "ch-4",
    title: "Math Tutorial: Fractions Explained",
    thumbnail: "/math-tutorial.png",
    duration: "22:10",
    views: "234K",
    time: "5 days ago",
    ...generateWatchData(new Date(), true),
  },
]

export const getAllVideos = (): Video[] => {
  return [...videos, ...subscriptionVideos, ...channelVideos]
}

export const getVideosByChannel = (channelId: string): Video[] => {
  return getAllVideos().filter(
    (video) => video.channel && typeof video.channel === "object" && (video.channel as Channel).id === channelId,
  )
}

export const getSubscribedChannelVideos = (): Video[] => {
  return subscriptionVideos
}

export const getRecommendedVideos = (): Video[] => {
  return videos
}

export const getLibraryVideos = (): Video[] => {
  return getAllVideos().filter((video) => video.isSaved === true)
}

export const getWatchedVideos = (): Video[] => {
  return getAllVideos().filter((video) => video.isWatched === true)
}

export const getWatchHistoryVideos = (): Video[] => {
  return (
    getAllVideos()
      .filter((video) => video.isWatched === true)
      .sort((a, b) => {
        const aDate = a.lastWatchedAt || a.watchedAt || new Date(0)
        const bDate = b.lastWatchedAt || b.watchedAt || new Date(0)
        return bDate.getTime() - aDate.getTime()
      })
  )
}

export const getIncompleteVideos = (): Video[] => {
  return getAllVideos().filter(
    (video) =>
      video.isWatched === true &&
      video.watchProgress !== undefined &&
      (video.watchProgress as number) < 100 &&
      (video.watchProgress as number) > 10,
  )
}

export const getRecentlyWatchedVideos = (days = 7): Video[] => {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  return getAllVideos().filter((video) => {
    const watchDate = video.lastWatchedAt || video.watchedAt
    return !!watchDate && watchDate >= cutoffDate
  })
}

export const getVideosByWatchSource = (source: string): Video[] => {
  return getAllVideos().filter((video) => video.watchSource === source)
}

export const getVideosByDevice = (device: string): Video[] => {
  return getAllVideos().filter((video) => video.deviceWatchedOn === device)
}

export const getLikedVideos = (): Video[] => {
  return getAllVideos().filter((video) => video.isLiked === true)
}

export const getWatchTimeStats = () => {
  const watchedVideos = getWatchedVideos()
  const totalWatchTimeSeconds = watchedVideos.reduce((total, video) => {
    return total + (video.watchDurationSeconds || 0)
  }, 0)
  const totalVideosWatched = watchedVideos.length
  const completedVideos = watchedVideos.filter((v) => v.watchProgress === 100).length
  const averageWatchProgress =
    watchedVideos.reduce((sum, video) => {
      return sum + (video.watchProgress || 0)
    }, 0) / Math.max(watchedVideos.length, 1)

  return {
    totalWatchTimeSeconds,
    totalWatchTimeFormatted: formatSeconds(totalWatchTimeSeconds),
    totalVideosWatched,
    completedVideos,
    averageWatchProgress: Math.round(averageWatchProgress),
    incompleteVideos: totalVideosWatched - completedVideos,
  }
}

const formatSeconds = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export const updateVideoWatchData = (videoId: string | number, watchData: Partial<Video>): Video | null => {
  const allVideos = getAllVideos()
  const video = allVideos.find((v) => String(v.id) === String(videoId))
  if (video) {
    return {
      ...video,
      ...watchData,
      lastWatchedAt: new Date(),
      addedToHistoryAt: video.addedToHistoryAt?? new Date(),
    }
  }
  return null
}

export const getVideoById = (id: string | number): Video | null => {
  return getAllVideos().find((v) => String(v.id) === String(id)) ?? null
}

export type VideoSources = {
  videoUrl: string | null
  captionUrl: string | null
  posterUrl: string | null
}

const VIDEO_SOURCE_MAP: Record<string, { videoUrl?: string; captionUrl?: string }> = {
  "1": { videoUrl: "/test.mp4", captionUrl: "/captions/video-en.vtt" },
}

export function resolveVideoSources(video: Video): VideoSources {
  const id = String(video.id)
  const mapped = VIDEO_SOURCE_MAP[id]
  const videoUrl = mapped?.videoUrl ?? null

  const captionUrl =
    mapped?.captionUrl ??
    (video.hasClosedCaptions && video.captionLanguage ? `/captions/${id}-${video.captionLanguage}.vtt` : null)

  const posterUrl = video.thumbnail || "/placeholder.svg?height=720&width=1280"

  return { videoUrl, captionUrl, posterUrl }
}