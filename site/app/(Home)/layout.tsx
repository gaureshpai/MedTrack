import type { Metadata } from "next";
import Navbar from "@/components/common/Navbar";

export const metadata: Metadata = {
	title: "SignFlix - Video Streaming with Sign Language",
	description:
		"An accessible video streaming platform with integrated sign language interpretation for the deaf and hard-of-hearing community.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-background md:pl-16 xl:pl-20">
			<Navbar />
			{children}
		</div>
	);
}
