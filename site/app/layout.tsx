import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
			</head>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
