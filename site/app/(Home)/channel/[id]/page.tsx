import { Bell, Search, CheckCircle, Play, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
	getVideosByChannel,
	subscribedChannels,
	type Video,
	type Channel
} from "@/data/draft";

export default function ChannelPage({ params }: { params: { id: string } }) {
	const channel = subscribedChannels.find(c => c.id === params.id);
	const channelVideos = getVideosByChannel(params.id);

	const totalViews = channelVideos.reduce((sum, video) => {
		const views = parseInt(video.views.replace(/[KM]/g, '')) * (video.views.includes('K') ? 1000 : video.views.includes('M') ? 1000000 : 1);
		return sum + views;
	}, 0);

	const formatViews = (views: number) => {
		if (views >= 1000000) {
			return `${(views / 1000000).toFixed(1)}M`;
		} else if (views >= 1000) {
			return `${(views / 1000).toFixed(1)}K`;
		}
		return views.toString();
	};

	if (!channel) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-2">Channel not found</h1>
					<p className="text-gray-600">The channel you're looking for doesn't exist.</p>
					<Link href="/">
						<Button className="mt-4">Go Home</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
				<div className="absolute inset-0 bg-black/20"></div>
				<div className="absolute bottom-4 left-4 text-white">
					<h1 className="text-3xl font-bold">{channel.name}</h1>
					<p className="text-lg opacity-90">
						Making education accessible through sign language
					</p>
				</div>
			</div>

			<div className="border-b bg-background">
				<div className="container px-4 py-6">
					<div className="flex items-start gap-6">
						<Avatar className="h-20 w-20">
							<AvatarImage src={channel.avatar || "/placeholder.svg"} />
							<AvatarFallback>{channel.name.slice(0, 2)}</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-2">
								<h2 className="text-2xl font-bold">{channel.name}</h2>
								{channel.isVerified && (
									<CheckCircle className="w-6 h-6 text-blue-600" />
								)}
							</div>
							<div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
								<span>@{channel.name.toLowerCase().replace(/\s+/g, '')}</span>
								<span>{channel.subscribers} subscribers</span>
								<span>{channelVideos.length} videos</span>
								<span>{formatViews(totalViews)} total views</span>
							</div>
							<p className="text-sm text-gray-700 max-w-2xl">
								Welcome to {channel.name}! We provide comprehensive sign
								language education with synchronized captions and interactive
								learning tools. Our mission is to make education accessible to
								everyone through innovative sign language integration.
							</p>
						</div>
						<div className="flex gap-3">
							<Button className="gap-2" variant={channel.isSubscribed ? "outline" : "default"}>
								<Bell className="h-4 w-4" />
								{channel.isSubscribed ? "Subscribed" : "Subscribe"}
							</Button>
							<Button variant="outline">Join</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="container px-4 py-6">
				<Tabs defaultValue="videos" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="videos">Videos</TabsTrigger>
						<TabsTrigger value="shorts">Shorts</TabsTrigger>
						<TabsTrigger value="about">About</TabsTrigger>
					</TabsList>

					<TabsContent value="videos" className="mt-6">
						<ChannelVideosTab videos={channelVideos} />
					</TabsContent>

					<TabsContent value="shorts" className="mt-6">
						<div className="text-center py-12">
							<h3 className="text-lg font-semibold mb-2">No Shorts Yet</h3>
							<p className="text-gray-600">
								This channel hasn't uploaded any Shorts yet.
							</p>
						</div>
					</TabsContent>

					<TabsContent value="about" className="mt-6">
						<ChannelAboutTab channel={channel} totalViews={totalViews} videoCount={channelVideos.length} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

const ChannelVideosTab = ({ videos }: { videos: Video[] }) => {
	return (
		<>
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-lg font-semibold">Latest Videos</h3>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm">
						<Search className="h-4 w-4 mr-2" />
						Search
					</Button>
					<select className="px-3 py-1 border rounded-md text-sm">
						<option value="latest">Latest</option>
						<option value="popular">Popular</option>
						<option value="oldest">Oldest</option>
					</select>
				</div>
			</div>

			{videos.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{videos.map((video) => (
						<VideoCard key={video.id} video={video} />
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<h3 className="text-lg font-semibold mb-2">No Videos Yet</h3>
					<p className="text-gray-600">
						This channel hasn't uploaded any videos yet.
					</p>
				</div>
			)}
		</>
	);
};

const VideoCard = ({
	video
}: {
	video: Video;
}) => {
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

					<div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
						{video.duration}
					</div>

					{video.watchProgress && video.watchProgress > 0 && (
						<div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
							<div
								className="h-full bg-red-600"
								style={{ width: `${video.watchProgress}%` }}
							/>
						</div>
					)}

					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
						<Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
					</div>
				</div>

				<div className="space-y-2">
					<h4 className="font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
						{video.title}
					</h4>

					<div className="flex items-center justify-between text-sm text-gray-600">
						<span>{video.views} views • {video.time}</span>
						{video.isWatched && (
							<Badge variant="secondary" className="text-xs">
								Watched
							</Badge>
						)}
					</div>

					{(video.isLiked || video.hasCommented || video.isShared) && (
						<div className="flex items-center gap-2">
							{video.isLiked && (
								<div className="flex items-center gap-1 text-xs text-red-500">
									<Heart className="w-3 h-3 fill-current" />
								</div>
							)}
							{video.hasCommented && (
								<div className="flex items-center gap-1 text-xs text-blue-500">
									<MessageCircle className="w-3 h-3" />
								</div>
							)}
							{video.isShared && (
								<div className="flex items-center gap-1 text-xs text-green-500">
									<Share2 className="w-3 h-3" />
								</div>
							)}
						</div>
					)}

					{video.isWatched && video.watchProgress && (
						<div className="text-xs text-gray-500">
							{video.watchProgress}% watched
							{video.watchDuration && ` • ${video.watchDuration} watched`}
						</div>
					)}
				</div>
			</div>
		</Link>
	);
};

const ChannelAboutTab = ({
	channel,
	totalViews,
	videoCount
}: {
	channel: Channel;
	totalViews: number;
	videoCount: number;
}) => {
	const formatViews = (views: number) => {
		if (views >= 1000000) {
			return `${(views / 1000000).toFixed(1)}M`;
		} else if (views >= 1000) {
			return `${(views / 1000).toFixed(1)}K`;
		}
		return views.toString();
	};

	return (
		<div className="max-w-4xl space-y-6">
			<div>
				<h3 className="text-lg font-semibold mb-3">Description</h3>
				<p className="text-gray-700 leading-relaxed">
					{channel.name} is dedicated to making education accessible
					through innovative sign language integration. We create
					comprehensive educational content with synchronized sign
					language interpretation, helping bridge the communication gap
					for the deaf and hard-of-hearing community.
				</p>
			</div>

			<div>
				<h3 className="text-lg font-semibold mb-3">Channel Statistics</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<div className="bg-gray-50 p-4 rounded-lg">
						<div className="text-2xl font-bold text-blue-600">{channel.subscribers}</div>
						<div className="text-sm text-gray-600">Subscribers</div>
					</div>
					<div className="bg-gray-50 p-4 rounded-lg">
						<div className="text-2xl font-bold text-green-600">{videoCount}</div>
						<div className="text-sm text-gray-600">Videos</div>
					</div>
					<div className="bg-gray-50 p-4 rounded-lg">
						<div className="text-2xl font-bold text-purple-600">{formatViews(totalViews)}</div>
						<div className="text-sm text-gray-600">Total Views</div>
					</div>
					<div className="bg-gray-50 p-4 rounded-lg">
						<div className="text-2xl font-bold text-orange-600">
							{channel.isVerified ? 'Verified' : 'Unverified'}
						</div>
						<div className="text-sm text-gray-600">Status</div>
					</div>
				</div>
			</div>

			<div>
				<h3 className="text-lg font-semibold mb-3">Channel Details</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
					<div>
						<span className="font-medium">Location:</span>
						<span className="ml-2 text-gray-600">United States</span>
					</div>
					<div>
						<span className="font-medium">Joined:</span>
						<span className="ml-2 text-gray-600">Jan 15, 2020</span>
					</div>
					<div>
						<span className="font-medium">Total views:</span>
						<span className="ml-2 text-gray-600">{formatViews(totalViews)}</span>
					</div>
					<div>
						<span className="font-medium">Languages:</span>
						<span className="ml-2 text-gray-600">
							English, ASL, ISL
						</span>
					</div>
					<div>
						<span className="font-medium">Verification:</span>
						<span className="ml-2 text-gray-600">
							{channel.isVerified ? 'Verified Channel' : 'Not Verified'}
						</span>
					</div>
					<div>
						<span className="font-medium">Subscription Status:</span>
						<span className="ml-2 text-gray-600">
							{channel.isSubscribed ? 'Subscribed' : 'Not Subscribed'}
						</span>
					</div>
				</div>
			</div>

			<div>
				<h3 className="text-lg font-semibold mb-3">Accessibility Features</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
						<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
							<Eye className="w-4 h-4 text-white" />
						</div>
						<div>
							<div className="font-medium">Sign Language</div>
							<div className="text-sm text-gray-600">All videos include ASL interpretation</div>
						</div>
					</div>
					<div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
						<div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
							<MessageCircle className="w-4 h-4 text-white" />
						</div>
						<div>
							<div className="font-medium">Closed Captions</div>
							<div className="text-sm text-gray-600">Synchronized captions available</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};