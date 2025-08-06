import { Bell, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { channelVideos, playlists } from "@/data/draft";
import Navbar from "@/components/common/Navbar";

export default function ChannelPage({ params }: { params: { id: string } }) {
	console.log(params);
	return (
		<div className="min-h-screen bg-background">
			<div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
				<div className="absolute inset-0 bg-black/20"></div>
				<div className="absolute bottom-4 left-4 text-white">
					<h1 className="text-3xl font-bold">SignLearn Academy</h1>
					<p className="text-lg opacity-90">
						Making education accessible through sign language
					</p>
				</div>
			</div>

			<div className="border-b bg-background">
				<div className="container px-4 py-6">
					<div className="flex items-start gap-6">
						<Avatar className="h-20 w-20">
							<AvatarImage src="/abstract-channel-avatar.png" />
							<AvatarFallback>SL</AvatarFallback>
						</Avatar>

						<div className="flex-1">
							<div className="flex items-center gap-2 mb-2">
								<h2 className="text-2xl font-bold">SignLearn Academy</h2>
								<div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
									<div className="w-3 h-3 bg-white rounded-full"></div>
								</div>
							</div>
							<div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
								<span>@signlearnacademy</span>
								<span>2.1M subscribers</span>
								<span>24 videos</span>
							</div>
							<p className="text-sm text-gray-700 max-w-2xl">
								Welcome to SignLearn Academy! We provide comprehensive sign
								language education with synchronized captions and interactive
								learning tools. Our mission is to make education accessible to
								everyone through innovative sign language integration.
							</p>
						</div>

						<div className="flex gap-3">
							<Button className="gap-2">
								<Bell className="h-4 w-4" />
								Subscribe
							</Button>
							<Button variant="outline">Join</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="container px-4 py-6">
				<Tabs defaultValue="videos" className="w-full">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="videos">Videos</TabsTrigger>
						<TabsTrigger value="playlists">Playlists</TabsTrigger>
						<TabsTrigger value="community">Community</TabsTrigger>
						<TabsTrigger value="about">About</TabsTrigger>
					</TabsList>

					<TabsContent value="videos" className="mt-6">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-lg font-semibold">Latest Videos</h3>
							<div className="flex items-center gap-2">
								<Button variant="outline" size="sm">
									<Search className="h-4 w-4 mr-2" />
									Search
								</Button>
								<select className="px-3 py-1 border rounded-md text-sm">
									<option>Latest</option>
									<option>Popular</option>
									<option>Oldest</option>
								</select>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{channelVideos.map((video) => (
								<Link
									key={video.id}
									href={`/watch/${video.id}`}
									className="group"
								>
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
											<div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
												<div className="w-3 h-3 bg-white rounded-full"></div>
												Sign Language
											</div>
										</div>
										<div className="space-y-1">
											<h4 className="font-medium line-clamp-2 group-hover:text-blue-600">
												{video.title}
											</h4>
											<p className="text-sm text-gray-600">
												{video.views} • {video.time}
											</p>
										</div>
									</div>
								</Link>
							))}
						</div>
					</TabsContent>

					<TabsContent value="playlists" className="mt-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{playlists.map((playlist) => (
								<Link
									key={playlist.id}
									href={`/playlist/${playlist.id}`}
									className="group"
								>
									<div className="space-y-3">
										<div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
											<Image
												src={playlist.thumbnail || "/placeholder.svg"}
												alt={playlist.title}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-200"
											/>
											<div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
												{playlist.videoCount} videos
											</div>
										</div>
										<div className="space-y-1">
											<h4 className="font-medium group-hover:text-blue-600">
												{playlist.title}
											</h4>
											<p className="text-sm text-gray-600">
												{playlist.videoCount} videos
											</p>
										</div>
									</div>
								</Link>
							))}
						</div>
					</TabsContent>

					<TabsContent value="community" className="mt-6">
						<div className="text-center py-12">
							<h3 className="text-lg font-semibold mb-2">Community Posts</h3>
							<p className="text-gray-600">
								{"This channel hasn't posted to the Community tab yet."}
							</p>
						</div>
					</TabsContent>

					<TabsContent value="about" className="mt-6">
						<div className="max-w-4xl space-y-6">
							<div>
								<h3 className="text-lg font-semibold mb-3">Description</h3>
								<p className="text-gray-700 leading-relaxed">
									SignLearn Academy is dedicated to making education accessible
									through innovative sign language integration. We create
									comprehensive educational content with synchronized sign
									language interpretation, helping bridge the communication gap
									for the deaf and hard-of-hearing community.
								</p>
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
										<span className="ml-2 text-gray-600">5,234,567</span>
									</div>
									<div>
										<span className="font-medium">Languages:</span>
										<span className="ml-2 text-gray-600">
											English, ASL, ISL
										</span>
									</div>
								</div>
							</div>

							<div>
								<h3 className="text-lg font-semibold mb-3">Links</h3>
								<div className="space-y-2">
									<a href="#" className="block text-blue-600 hover:underline">
										Official Website
									</a>
									<a href="#" className="block text-blue-600 hover:underline">
										Sign Language Resources
									</a>
									<a href="#" className="block text-blue-600 hover:underline">
										Contact Us
									</a>
								</div>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
