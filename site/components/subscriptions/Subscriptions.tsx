"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, CheckCircle, Grid3X3, List, Play } from 'lucide-react';
import { subscriptionVideos, subscribedChannels, type Video } from "@/data/draft";

const Subscriptions = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'today' | 'this-week'>('all');
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [showAllChannels, setShowAllChannels] = useState(false);

  const filteredVideos = subscriptionVideos.filter(video => {
    if (selectedChannelId && video.channel && typeof video.channel === 'object' && video.channel.id !== selectedChannelId) {
      return false;
    }

    if (filter === 'all') return true;
    if (filter === 'today') {
      return video.time.includes('hour') || video.time.includes('minute');
    }
    if (filter === 'this-week') {
      return video.time.includes('day') || video.time.includes('hour') || video.time.includes('minute');
    }
    return true;
  });

  const displayedChannels = showAllChannels ? subscribedChannels : subscribedChannels.slice(0, 7);
  const selectedChannel = selectedChannelId ? subscribedChannels.find(c => c.id === selectedChannelId) : null;

  const handleChannelSelect = (channelId: string | null) => {
    setSelectedChannelId(channelId);
  };

  const handleAllChannels = () => {
    setSelectedChannelId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-4 px-4 pb-20 md:pb-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>

          <div className="mb-6">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <button
                type="button"
                onClick={handleAllChannels}
                className="flex-shrink-0 cursor-pointer transition-all duration-200"
              >
                <div className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors ${!selectedChannelId
                  ? 'bg-blue-50 border-2 border-blue-200'
                  : 'hover:bg-gray-100 border-2 border-transparent'
                  }`}>
                  <div className={`w-12 h-12 rounded-full cursor-pointer flex items-center justify-center ${!selectedChannelId ? 'bg-blue-600' : 'bg-gray-200'
                    }`}>
                    <Grid3X3 className={`w-6 h-6 ${!selectedChannelId ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <span className={`text-xs font-medium cursor-pointer ${!selectedChannelId ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                    All
                  </span>
                </div>
              </button>

              {displayedChannels.map((channel) => (
                <button
                  type="button"
                  key={channel.id}
                  onClick={() => handleChannelSelect(channel.id)}
                  className={`flex-shrink-0 transition-all cursor-pointer duration-200 ${selectedChannelId === channel.id ? '' : ''
                    }`}
                >
                  <div className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors ${selectedChannelId === channel.id
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'hover:bg-gray-100 border-2 border-transparent'
                    }`}>
                    <div className="relative cursor-pointer">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={channel.avatar || "/placeholder.svg"} alt={channel.name} />
                        <AvatarFallback>{channel.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      {channel.isVerified && (
                        <CheckCircle className="absolute -bottom-1 -right-1 w-4 h-4 text-blue-600 bg-white rounded-full" />
                      )}
                    </div>
                    <span className={`text-xs text-center max-w-16 truncate font-medium ${selectedChannelId === channel.id ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                      {channel.name}
                    </span>
                  </div>
                </button>
              ))}

              {subscribedChannels.length > 7 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0 h-20 w-20 flex-col gap-1"
                  onClick={() => setShowAllChannels(!showAllChannels)}
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {showAllChannels ? '−' : `+${subscribedChannels.length - 7}`}
                    </span>
                  </div>
                  <span className="text-xs">{showAllChannels ? 'Less' : 'More'}</span>
                </Button>
              )}
            </div>
          </div>

          {selectedChannel && (
            <div className="mb-4 p-4 bg-white rounded-lg border shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedChannel.avatar || "/placeholder.svg"} alt={selectedChannel.name} />
                    <AvatarFallback>{selectedChannel.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold">{selectedChannel.name}</h2>
                      {selectedChannel.isVerified && (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedChannel.subscribers} subscribers • {filteredVideos.length} videos
                    </p>
                  </div>
                </div>
                <Link href={`/channel/${selectedChannel.id}`}>
                  <Button variant="outline" size="sm">
                    Visit Channel
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'today' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('today')}
              >
                Today
              </Button>
              <Button
                variant={filter === 'this-week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('this-week')}
              >
                This week
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} showChannelInfo={!selectedChannel} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVideos.map((video) => (
              <VideoListItem key={video.id} video={video} showChannelInfo={!selectedChannel} />
            ))}
          </div>
        )}

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              {selectedChannel ? (
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedChannel.avatar || "/placeholder.svg"} alt={selectedChannel.name} />
                  <AvatarFallback className="text-lg">{selectedChannel.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              ) : (
                <Bell className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium mb-2">
              {selectedChannel ? `No videos from ${selectedChannel.name}` : 'No videos found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedChannel
                ? `Try adjusting your filters or check back later for new content from ${selectedChannel.name}.`
                : 'Try adjusting your filters or check back later for new content.'
              }
            </p>
            {selectedChannel && (
              <Button variant="outline" onClick={handleAllChannels}>
                View All Channels
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const VideoCard = ({
  video,
  showChannelInfo = true
}: {
  video: Video;
  showChannelInfo?: boolean;
}) => {
  const channelInfo = video.channel && typeof video.channel === 'object' ? video.channel : null;

  return (
    <Link href={`/watch/${video.id}`} className="group">
      <div className="space-y-3">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={video.thumbnail || "/placeholder.svg"}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />

          <div className="absolute bottom-2 right-2">
            <div className="bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
              {video.duration}
            </div>
          </div>

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="space-y-2">
          <div className={`flex gap-3 ${showChannelInfo && channelInfo ? '' : 'justify-start'}`}>
            {showChannelInfo && channelInfo && (
              <Avatar className="w-9 h-9 flex-shrink-0">
                <AvatarImage src={channelInfo.avatar || "/placeholder.svg"} alt={channelInfo.name} />
                <AvatarFallback>{channelInfo.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
                {video.title}
              </h3>
              {showChannelInfo && channelInfo && (
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-sm text-gray-600">{channelInfo.name}</p>
                  {channelInfo.isVerified && (
                    <CheckCircle className="w-3 h-3 text-blue-600" />
                  )}
                </div>
              )}
              <p className="text-sm text-gray-600">
                {video.views} views • {video.time}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const VideoListItem = ({
  video,
  showChannelInfo = true
}: {
  video: Video;
  showChannelInfo?: boolean;
}) => {
  const channelInfo = video.channel && typeof video.channel === 'object' ? video.channel : null;

  return (
    <Link href={`/watch/${video.id}`} className="group">
      <div className="flex flex-col md:flex-row gap-0 md:gap-4 rounded-lg hover:bg-gray-50 transition-colors overflow-hidden md:p-4">
        <div className="relative w-full md:w-48 aspect-video md:rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={video.thumbnail || "/placeholder.svg"}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />

          <div className="absolute bottom-2 right-2">
            <div className="bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
              {video.duration}
            </div>
          </div>

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex-1 min-w-0 p-3 md:p-0">
          <h3 className="font-medium line-clamp-2 group-hover:text-blue-600 transition-colors mb-2 text-sm md:text-base">
            {video.title}
          </h3>

          {showChannelInfo && channelInfo && (
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="w-5 h-5 md:w-6 md:h-6">
                <AvatarImage src={channelInfo.avatar || "/placeholder.svg"} alt={channelInfo.name} />
                <AvatarFallback className="text-xs">{channelInfo.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1">
                <p className="text-xs md:text-sm text-gray-600">{channelInfo.name}</p>
                {channelInfo.isVerified && (
                  <CheckCircle className="w-3 h-3 text-blue-600" />
                )}
              </div>
            </div>
          )}

          <p className="text-xs md:text-sm text-gray-600">
            {video.views} views • {video.time}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Subscriptions;