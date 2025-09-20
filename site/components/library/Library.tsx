"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, CheckCircle, Grid3X3, List, Play, Clock } from 'lucide-react';
import { getLibraryVideos, type Video } from "@/data/draft";

const Library = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'title'>('recent');

  const libraryVideos = getLibraryVideos();

  const sortedVideos = [...libraryVideos].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.time.localeCompare(a.time);
      case 'oldest':
        return a.time.localeCompare(b.time);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-4 px-4 pb-20 md:pb-4">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Watch Later</h1>
              <p className="text-gray-600 text-sm">
                {libraryVideos.length} video{libraryVideos.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>

          {libraryVideos.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant={sortBy === 'recent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('recent')}
                >
                  Most Recent
                </Button>
                <Button
                  variant={sortBy === 'oldest' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('oldest')}
                >
                  Oldest
                </Button>
                <Button
                  variant={sortBy === 'title' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('title')}
                >
                  A-Z
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                  {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>

        {libraryVideos.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedVideos.map((video) => (
                <VideoListItem key={video.id} video={video} />
              ))}
            </div>
          )
        ) : (
          <EmptyLibraryState />
        )}
      </main>
    </div>
  );
};

const EmptyLibraryState = () => {
  return (
    <div className="text-center py-16">
      <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <Clock className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">
        No videos saved yet
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Save videos to watch later by clicking the save button on any video.
        They'll appear here so you can easily find them when you're ready to watch.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/">
          <Button className="w-full sm:w-auto">
            Browse Videos
          </Button>
        </Link>
        <Link href="/subscriptions">
          <Button variant="outline" className="w-full sm:w-auto">
            Check Subscriptions
          </Button>
        </Link>
      </div>

      <div className="mt-12 max-w-2xl mx-auto">
        <h4 className="text-lg font-medium mb-4 text-gray-900">How to save videos</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Bookmark className="w-4 h-4 text-blue-600" />
            </div>
            <h5 className="font-medium mb-2">Save for Later</h5>
            <p className="text-sm text-gray-600">
              Click the save button on any video to add it to your Watch Later list.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Play className="w-4 h-4 text-green-600" />
            </div>
            <h5 className="font-medium mb-2">Watch Anytime</h5>
            <p className="text-sm text-gray-600">
              Access your saved videos from any device, anytime you want to watch.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <List className="w-4 h-4 text-purple-600" />
            </div>
            <h5 className="font-medium mb-2">Stay Organized</h5>
            <p className="text-sm text-gray-600">
              Sort and organize your saved videos by date or title for easy browsing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoCard = ({ video }: { video: Video }) => {
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
          <div className="absolute top-2 left-2">
            <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Saved
            </div>
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-3">
            {channelInfo && (
              <Avatar className="w-9 h-9 flex-shrink-0">
                <AvatarImage src={channelInfo.avatar || "/placeholder.svg"} alt={channelInfo.name} />
                <AvatarFallback>{channelInfo.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
                {video.title}
              </h3>
              {channelInfo && (
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

const VideoListItem = ({ video }: { video: Video }) => {
  const channelInfo = video.channel && typeof video.channel === 'object' ? video.channel : null;

  return (
    <Link href={`/watch/${video.id}`} className="group">
      <div className="flex flex-col md:flex-row gap-0 md:gap-4 rounded-lg hover:bg-white transition-colors overflow-hidden md:p-4 border border-transparent hover:border-gray-200 hover:shadow-sm">
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
          <div className="absolute top-2 left-2">
            <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Saved
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
          {channelInfo && (
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

export default Library;
