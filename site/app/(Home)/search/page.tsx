import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";

const searchResults = [
	{
		id: 1,
		title: "Introduction to Sign Language - Basic Greetings",
		channel: "SignLearn Academy",
		views: "125K views",
		time: "2 days ago",
		duration: "12:34",
		thumbnail: "/sign-language-tutorial.png",
		description:
			"Learn basic sign language greetings with clear demonstrations and practice exercises. Perfect for beginners looking to start their sign language journey.",
		hasSignLanguage: true,
	},
	{
		id: 2,
		title: "Advanced Sign Language Techniques for Educators",
		channel: "EduSign Professional",
		views: "89K views",
		time: "1 week ago",
		duration: "25:18",
		thumbnail: "/advanced-sign-language.png",
		description:
			"Professional development course for educators wanting to incorporate sign language into their teaching methods.",
		hasSignLanguage: true,
	},
	{
		id: 3,
		title: "Cooking Tutorial: Healthy Recipes with Sign Language",
		channel: "Accessible Cooking",
		views: "156K views",
		time: "3 days ago",
		duration: "18:45",
		thumbnail: "/cooking-tutorial-sign-language.png",
		description:
			"Learn to cook healthy meals with full sign language interpretation and synchronized captions.",
		hasSignLanguage: true,
	},
];

export default function SearchPage() {
	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			<div className="container mx-auto px-4 py-6">
				<div className="flex gap-6">
					<aside className="w-64 space-y-6">
						<div>
							<h3 className="font-semibold mb-3">Upload Date</h3>
							<div className="space-y-2">
								<label className="flex items-center gap-2">
									<input type="radio" name="date" />
									<span className="text-sm">Last hour</span>
								</label>
								<label className="flex items-center gap-2">
									<input type="radio" name="date" />
									<span className="text-sm">Today</span>
								</label>
								<label className="flex items-center gap-2">
									<input type="radio" name="date" />
									<span className="text-sm">This week</span>
								</label>
								<label className="flex items-center gap-2">
									<input type="radio" name="date" />
									<span className="text-sm">This month</span>
								</label>
							</div>
						</div>

						<div>
							<h3 className="font-semibold mb-3">Duration</h3>
							<div className="space-y-2">
								<label className="flex items-center gap-2">
									<input type="radio" name="duration" />
									<span className="text-sm">Under 4 minutes</span>
								</label>
								<label className="flex items-center gap-2">
									<input type="radio" name="duration" />
									<span className="text-sm">4-20 minutes</span>
								</label>
								<label className="flex items-center gap-2">
									<input type="radio" name="duration" />
									<span className="text-sm">Over 20 minutes</span>
								</label>
							</div>
						</div>

						<div>
							<h3 className="font-semibold mb-3">Features</h3>
							<div className="space-y-2">
								<label className="flex items-center gap-2">
									<input type="checkbox" defaultChecked />
									<span className="text-sm">Sign Language Support</span>
								</label>
								<label className="flex items-center gap-2">
									<input type="checkbox" />
									<span className="text-sm">Captions</span>
								</label>
								<label className="flex items-center gap-2">
									<input type="checkbox" />
									<span className="text-sm">HD Quality</span>
								</label>
							</div>
						</div>

						<div>
							<h3 className="font-semibold mb-3">Sort by</h3>
							<select className="w-full p-2 border rounded-md">
								<option>Relevance</option>
								<option>Upload date</option>
								<option>View count</option>
								<option>Rating</option>
							</select>
						</div>
					</aside>

					<main className="flex-1">
						<div className="mb-4">
							<p className="text-sm text-gray-600">
								{'About 1,240,000 results for "sign language tutorial"'}
							</p>
						</div>

						<div className="space-y-6">
							{searchResults.map((video) => (
								<Link
									key={video.id}
									href={`/watch/${video.id}`}
									className="block group"
								>
									<div className="flex gap-4">
										<div className="relative w-80 aspect-video rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
											<Image
												src={video.thumbnail || "/placeholder.svg"}
												alt={video.title}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-200"
											/>
											<div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
												{video.duration}
											</div>
											{video.hasSignLanguage && (
												<div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
													<div className="w-3 h-3 bg-white rounded-full"></div>
													Sign Language
												</div>
											)}
										</div>

										<div className="flex-1 space-y-2">
											<h3 className="text-lg font-medium line-clamp-2 group-hover:text-blue-600">
												{video.title}
											</h3>
											<div className="text-sm text-gray-600">
												{video.views} • {video.time}
											</div>
											<div className="flex items-center gap-2 text-sm text-gray-600">
												<div className="w-6 h-6 bg-gray-300 rounded-full"></div>
												{video.channel}
											</div>
											<p className="text-sm text-gray-700 line-clamp-2">
												{video.description}
											</p>
										</div>
									</div>
								</Link>
							))}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
