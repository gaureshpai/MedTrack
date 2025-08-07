import {
	ThumbsUp,
	ThumbsDown,
	Share,
	Download,
	MoreHorizontal,
	Bell,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

const relatedVideos = [
	{
		id: 2,
		title: "Advanced Sign Language Techniques",
		channel: "SignLearn Academy",
		views: "89K views",
		time: "1 week ago",
		thumbnail: "/advanced-sign-language.png",
	},
	{
		id: 3,
		title: "Cooking with Sign Language Commentary",
		channel: "Accessible Cooking",
		views: "156K views",
		time: "3 days ago",
		thumbnail: "/cooking-sign-language.png",
	},
	{
		id: 4,
		title: "Math Tutorial: Fractions Explained",
		channel: "EduSign",
		views: "234K views",
		time: "5 days ago",
		thumbnail: "/math-fractions.png",
	},
];

export default function WatchPage({ params }: { params: { id: string } }) {
	console.log(params);
	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-6">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2 space-y-4">
						<div className="aspect-video bg-black rounded-lg overflow-hidden relative">
							<video
								className="w-full h-full"
								controls
								preload="metadata"
							>
								<source src="/path-to-your-video.mp4" type="video/mp4" />
								<track
									src="/captions/video-en.vtt"
									kind="captions"
									srcLang="en"
									label="English"
									default
								/>
								{"Your browser does not support the video tag!"}
							</video>


							<div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900/90 rounded-lg border-2 border-white">
								<div className="w-full h-full flex items-center justify-center text-white text-sm">
									Sign Language Interpreter
								</div>
							</div>
						</div>

						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
							<h3 className="font-semibold text-blue-900 mb-3">
								Sign Language Controls
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label htmlFor="#" className="text-sm font-medium text-blue-800 block mb-2">
										Sign Language Delay
									</label>
									<Slider
										defaultValue={[0]}
										max={5}
										step={0.1}
										className="w-full"
									/>
									<span className="text-xs text-blue-600">0.0s delay</span>
								</div>
								<div>
									<label htmlFor="#" className="text-sm font-medium text-blue-800 block mb-2">
										Sign Speed
									</label>
									<Slider
										defaultValue={[1]}
										max={2}
										min={0.5}
										step={0.1}
										className="w-full"
									/>
									<span className="text-xs text-blue-600">1.0x speed</span>
								</div>
								<div className="flex items-end">
									<Button variant="outline" size="sm" className="w-full">
										Toggle Sign Language
									</Button>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<h1 className="text-xl font-bold">
								Introduction to Sign Language - Basic Greetings
							</h1>

							<div className="flex items-center justify-between">
								<div className="text-sm text-gray-600">
									125,432 views • Mar 15, 2024
								</div>
								<div className="flex items-center gap-2">
									<Button variant="ghost" size="sm" className="gap-2">
										<ThumbsUp className="h-4 w-4" />
										1.2K
									</Button>
									<Button variant="ghost" size="sm" className="gap-2">
										<ThumbsDown className="h-4 w-4" />
										12
									</Button>
									<Button variant="ghost" size="sm" className="gap-2">
										<Share className="h-4 w-4" />
										Share
									</Button>
									<Button variant="ghost" size="sm" className="gap-2">
										<Download className="h-4 w-4" />
										Download
									</Button>
									<Button variant="ghost" size="icon">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</div>
							</div>

							<Separator />

							<div className="flex items-start gap-4">
								<Avatar className="h-10 w-10">
									<AvatarImage src="/abstract-channel-avatar.png" />
									<AvatarFallback>SL</AvatarFallback>
								</Avatar>
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<h3 className="font-semibold">SignLearn Academy</h3>
										<div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
											<div className="w-2 h-2 bg-white rounded-full"></div>
										</div>
									</div>
									<p className="text-sm text-gray-600 mb-2">2.1M subscribers</p>
									<p className="text-sm">
										Welcome to SignLearn Academy! We provide comprehensive sign
										language education with synchronized captions and
										interactive learning tools. This video covers basic
										greetings in sign language with clear demonstrations and
										practice exercises.
									</p>
								</div>
								<Button className="gap-2">
									<Bell className="h-4 w-4" />
									Subscribe
								</Button>
							</div>
						</div>

						<div className="space-y-4">
							<div className="flex items-center gap-4">
								<h3 className="text-lg font-semibold">Comments</h3>
								<span className="text-sm text-gray-600">847</span>
							</div>

							<div className="space-y-4">
								{[1, 2, 3].map((i) => (
									<div key={i} className="flex gap-3">
										<Avatar className="h-8 w-8">
											<AvatarFallback>U{i}</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<span className="text-sm font-medium">@user{i}</span>
												<span className="text-xs text-gray-500">
													2 days ago
												</span>
											</div>
											<p className="text-sm">
												This is such a helpful tutorial! The sign language
												interpretation makes it so much easier to follow along.
												Thank you!
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<h3 className="font-semibold">Related Videos</h3>
						<div className="space-y-3">
							{relatedVideos.map((video) => (
								<Link
									key={video.id}
									href={`/watch/${video.id}`}
									className="flex gap-3 group"
								>
									<div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
										<Image
											src={video.thumbnail || "/placeholder.svg"}
											alt={video.title}
											fill
											className="object-cover group-hover:scale-105 transition-transform"
										/>
									</div>
									<div className="flex-1 min-w-0">
										<h4 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600">
											{video.title}
										</h4>
										<p className="text-xs text-gray-600 mt-1">
											{video.channel}
										</p>
										<p className="text-xs text-gray-600">
											{video.views} • {video.time}
										</p>
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
