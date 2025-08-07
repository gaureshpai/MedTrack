import Link from "next/link";
import Image from "next/image";
import { videos } from "@/data/draft";

export default function Feed() {
	return (
		<div className="min-h-screen bg-background">
			<div className="flex">
				<main className="flex-1">
					<div className="p-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{videos.map((video) => (
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
										</div>
										<div className="space-y-1">
											<h3 className="font-medium line-clamp-2 group-hover:text-blue-600">
												{video.title}
											</h3>
											<p className="text-sm text-gray-600">{video.channel && typeof video.channel === 'object' ? video.channel.name : video.channel}</p>
											<p className="text-sm text-gray-600">
												{video.views} • {video.time}
											</p>
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}