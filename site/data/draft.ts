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
}

export interface Playlist {
  id: number
  title: string
  videoCount: number
  thumbnail: string
}

export const subscribedChannels: Channel[] = [
  {
    id: "1",
    name: "ASL Learning Hub",
    avatar: "/placeholder.svg?height=40&width=40&text=ASL",
    subscribers: "2.1M",
    isVerified: true,
    isSubscribed: true
  },
  {
    id: "2", 
    name: "Sign Language Stories",
    avatar: "/placeholder.svg?height=40&width=40&text=SLS",
    subscribers: "890K",
    isVerified: true,
    isSubscribed: true
  },
  {
    id: "3",
    name: "Deaf Culture Today",
    avatar: "/placeholder.svg?height=40&width=40&text=DCT",
    subscribers: "1.5M",
    isVerified: true,
    isSubscribed: true
  },
  {
    id: "4",
    name: "SignFlix Originals",
    avatar: "/placeholder.svg?height=40&width=40&text=SFO",
    subscribers: "3.2M",
    isVerified: true,
    isSubscribed: true
  },
  {
    id: "5",
    name: "Hearing Impaired Tech",
    avatar: "/placeholder.svg?height=40&width=40&text=HIT",
    subscribers: "650K",
    isVerified: false,
    isSubscribed: true
  },
  {
    id: "6",
    name: "SignLearn Academy",
    avatar: "/placeholder.svg?height=40&width=40&text=SLA",
    subscribers: "1.2M",
    isVerified: true,
    isSubscribed: false
  },
  {
    id: "7",
    name: "Accessible Cooking",
    avatar: "/placeholder.svg?height=40&width=40&text=AC",
    subscribers: "567K",
    isVerified: true,
    isSubscribed: false
  },
  {
    id: "8",
    name: "EduSign",
    avatar: "/placeholder.svg?height=40&width=40&text=ES",
    subscribers: "890K",
    isVerified: true,
    isSubscribed: false
  },
  {
    id: "9",
    name: "AccessNews",
    avatar: "/placeholder.svg?height=40&width=40&text=AN",
    subscribers: "234K",
    isVerified: true,
    isSubscribed: false
  },
  {
    id: "10",
    name: "Inclusive Fitness",
    avatar: "/placeholder.svg?height=40&width=40&text=IF",
    subscribers: "445K",
    isVerified: false,
    isSubscribed: false
  },
  {
    id: "11",
    name: "HistorySign",
    avatar: "/placeholder.svg?height=40&width=40&text=HS",
    subscribers: "1.8M",
    isVerified: true,
    isSubscribed: false
  }
]

export const getChannelByName = (name: string): Channel | undefined => {
  return subscribedChannels.find(channel => channel.name === name)
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
  },
  {
    id: "2",
    title: "Cooking Tutorial: Easy Pasta Recipe with Sign Language",
    thumbnail: "/cooking-tutorial.png",
    duration: "15:22",
    views: "89K",
    time: "1 week ago",
    channel: getChannelByName("Accessible Cooking")
  },
  {
    id: "3",
    title: "Math Explained: Algebra Basics for Everyone",
    thumbnail: "/placeholder-eeetx.png",
    duration: "18:45",
    views: "234K",
    time: "3 days ago",
    channel: getChannelByName("EduSign")
  },
  {
    id: "4",
    title: "News Update: Technology Accessibility Advances",
    thumbnail: "/technology-news-collage.png",
    duration: "8:12",
    views: "67K",
    time: "5 hours ago",
    channel: getChannelByName("AccessNews")
  },
  {
    id: "5",
    title: "Fitness for All: Morning Yoga with Sign Language",
    thumbnail: "/yoga-fitness.png",
    duration: "25:30",
    views: "156K",
    time: "4 days ago",
    channel: getChannelByName("Inclusive Fitness")
  },
  {
    id: "6",
    title: "History Lesson: World War II Documentary",
    thumbnail: "/history-documentary.png",
    duration: "42:15",
    views: "445K",
    time: "1 week ago",
    channel: getChannelByName("HistorySign")
  }
]

export const subscriptionVideos: Video[] = [
  {
    id: "sub-1",
    title: "Learn Basic ASL Greetings in 10 Minutes",
    thumbnail: "/placeholder.svg?height=180&width=320&text=ASL+Greetings",
    duration: "10:24",
    views: "125K",
    time: "2 hours ago",
    channel: subscribedChannels[0]
  },
  {
    id: "sub-2",
    title: "LIVE: ASL Q&A Session with Expert Interpreters",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Live+ASL+QA",
    duration: "LIVE",
    views: "2.1K watching",
    time: "Started 30 minutes ago",
    channel: subscribedChannels[0]
  },
  {
    id: "sub-3",
    title: "The Beautiful Story of Deaf Poetry",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Deaf+Poetry",
    duration: "15:42",
    views: "89K",
    time: "1 day ago",
    channel: subscribedChannels[1]
  },
  {
    id: "sub-4",
    title: "How Technology is Changing Deaf Education",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Deaf+Tech+Education",
    duration: "22:18",
    views: "156K",
    time: "3 days ago",
    channel: subscribedChannels[2]
  },
  {
    id: "sub-5",
    title: "PREMIERE: New SignFlix Original Series Trailer",
    thumbnail: "/placeholder.svg?height=180&width=320&text=SignFlix+Premiere",
    duration: "2:45",
    views: "45K waiting",
    time: "Premieres in 2 hours",
    channel: subscribedChannels[3]
  },
  {
    id: "sub-6",
    title: "Best Hearing Aids of 2024 - Complete Review",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Hearing+Aids+2024",
    duration: "18:33",
    views: "78K",
    time: "5 days ago",
    channel: subscribedChannels[4]
  },
  {
    id: "sub-7",
    title: "ASL Storytelling: The Three Little Pigs",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Three+Little+Pigs+ASL",
    duration: "12:15",
    views: "234K",
    time: "1 week ago",
    channel: subscribedChannels[1]
  },
  {
    id: "sub-8",
    title: "Understanding Deaf Culture: Common Misconceptions",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Deaf+Culture+Myths",
    duration: "16:28",
    views: "167K",
    time: "1 week ago",
    channel: subscribedChannels[2]
  },
  {
    id: "sub-9",
    title: "Advanced ASL Grammar: Classifiers Explained",
    thumbnail: "/placeholder.svg?height=180&width=320&text=ASL+Classifiers",
    duration: "25:12",
    views: "92K",
    time: "2 weeks ago",
    channel: subscribedChannels[0]
  },
  {
    id: "sub-10",
    title: "Smart Home Setup for Deaf and Hard of Hearing",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Smart+Home+Deaf",
    duration: "14:56",
    views: "143K",
    time: "2 weeks ago",
    channel: subscribedChannels[4]
  }
]

export const channelVideos: Video[] = [
  {
    id: "ch-1",
    title: "Introduction to Sign Language - Basic Greetings",
    thumbnail: "/sign-language-tutorial.png",
    duration: "12:34",
    views: "125K",
    time: "2 days ago"
  },
  {
    id: "ch-2",
    title: "Advanced Sign Language Techniques",
    thumbnail: "/advanced-sign-language.png",
    duration: "25:18",
    views: "89K",
    time: "1 week ago"
  },
  {
    id: "ch-3",
    title: "Cooking with Sign Language Commentary",
    thumbnail: "/cooking-sign-language.png",
    duration: "18:45",
    views: "156K",
    time: "3 days ago"
  },
  {
    id: "ch-4",
    title: "Math Tutorial: Fractions Explained",
    thumbnail: "/math-tutorial.png",
    duration: "22:10",
    views: "234K",
    time: "5 days ago"
  },
]

export const playlists: Playlist[] = [
  {
    id: 1,
    title: "Sign Language Basics",
    videoCount: 12,
    thumbnail: "/sign-language-basics-playlist.png",
  },
  {
    id: 2,
    title: "Educational Content",
    videoCount: 8,
    thumbnail: "/placeholder-az198.png",
  },
  {
    id: 3,
    title: "ASL Learning Journey",
    videoCount: 15,
    thumbnail: "/placeholder.svg?height=180&width=320&text=ASL+Journey",
  },
  {
    id: 4,
    title: "Deaf Culture & Community",
    videoCount: 6,
    thumbnail: "/placeholder.svg?height=180&width=320&text=Deaf+Culture",
  }
]

export const getAllVideos = (): Video[] => {
  return [...videos, ...subscriptionVideos, ...channelVideos]
}

export const getVideosByChannel = (channelId: string): Video[] => {
  return getAllVideos().filter(video => 
    video.channel && typeof video.channel === 'object' && video.channel.id === channelId
  )
}

export const getSubscribedChannelVideos = (): Video[] => {
  return subscriptionVideos
}

export const getRecommendedVideos = (): Video[] => {
  return videos
}