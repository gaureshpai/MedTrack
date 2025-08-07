"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { History, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  getWatchHistoryVideos,
  type Video
} from "@/data/draft"

const WatchHistory = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const allHistoryVideos = getWatchHistoryVideos()

  const filteredVideos = useMemo(() => {
    return allHistoryVideos.filter(video =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.channel && typeof video.channel === "object" &&
        video.channel.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [allHistoryVideos, searchQuery])

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-4 px-4 pb-20 md:pb-4">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Watch History</h1>
              <p className="text-gray-600 text-sm">
                {allHistoryVideos.length} video{allHistoryVideos.length !== 1 ? "s" : ""} watched
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search watch history"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <button
                  type="submit"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        {allHistoryVideos.length === 0 ? (
          <EmptyHistoryState />
        ) : filteredVideos.length === 0 ? (
          <NoSearchResults searchQuery={searchQuery} onClearSearch={() => setSearchQuery("")} />
        ) : (
          <VideoList videos={filteredVideos} />
        )}
      </main>
    </div>
  )
}

const EmptyHistoryState = () => {
  return (
    <div className="text-center py-16">
      <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <History className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">
        No watch history yet
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Videos you watch will appear here so you can easily find them again later.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/">
          <Button className="w-full sm:w-auto">Start Watching</Button>
        </Link>
        <Link href="/subscriptions">
          <Button variant="outline" className="w-full sm:w-auto">
            Browse Subscriptions
          </Button>
        </Link>
      </div>
    </div>
  )
}

const NoSearchResults = ({
  searchQuery,
  onClearSearch
}: {
  searchQuery: string
  onClearSearch: () => void
}) => {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">
        No results found for "{searchQuery}"
      </h3>
      <p className="text-gray-600 mb-4">
        Try searching for something else or check your spelling.
      </p>
      <Button variant="outline" onClick={onClearSearch}>
        Clear search
      </Button>
    </div>
  )
}

const VideoList = ({ videos }: { videos: Video[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div key={video.id} className="bg-white rounded-lg shadow p-4">
          <div className="aspect-video bg-gray-200 rounded mb-3"></div>
          <h4 className="font-semibold">{video.title}</h4>
          <p className="text-sm text-gray-500">{typeof video.channel === 'object' ? video.channel.name : ''}</p>
          <p className="text-sm text-gray-400">{video.time} • {video.views} views</p>
        </div>
      ))}
    </div>
  )
}

export default WatchHistory