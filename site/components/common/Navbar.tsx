"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Search, Upload, Mic, Video, Home, Library, Heart, ChevronRight, Clock, ArrowLeft, User, Plus, FileText } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

const Navbar = () => {
	const [isNotificationOpen, setIsNotificationOpen] = useState(false);
	const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
	const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("home");

	const handleSidebarToggle = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const closeSidebar = () => {
		setIsSidebarOpen(false);
	};

	const handleMobileSearchToggle = () => {
		setIsMobileSearchOpen(!isMobileSearchOpen);
	};

	void isSignedIn;
	void setIsSignedIn;

	return (
		<>
			<header className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-gray-200">
				{isMobileSearchOpen && (
					<div className="flex h-14 items-center px-4 md:hidden">
						<Button
							variant="ghost"
							size="icon"
							className="mr-2 hover:bg-gray-100 rounded-full"
							onClick={handleMobileSearchToggle}
						>
							<ArrowLeft className="h-5 w-5" />
						</Button>
						<div className="flex-1 flex items-center">
							<div className="relative flex-1">
								<Input
									placeholder="Search"
									className="w-full h-9 px-4 border border-gray-300 rounded-l-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
									autoFocus
								/>
							</div>
							<Button
								size="icon"
								className="h-9 w-12 bg-gray-50 hover:bg-gray-100 border border-l-0 border-gray-300 rounded-r-full text-gray-600"
								variant="ghost"
							>
								<Search className="h-4 w-4" />
							</Button>
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="ml-2 hover:bg-gray-100 rounded-full"
							title="Search with voice"
							onClick={() => setIsVoiceModalOpen(true)}
						>
							<Mic className="h-4 w-4" />
						</Button>
					</div>
				)}

				{!isMobileSearchOpen && (
					<div className="flex h-14 items-center justify-between px-4">
						<div className="flex items-center gap-4 min-w-0 flex-shrink-0">
							<Button
								variant="ghost"
								size="icon"
								className="hidden md:flex hover:bg-gray-100 cursor-pointer rounded-full p-2 h-10 w-10"
								onClick={handleSidebarToggle}
							>
								<Menu className="h-6 w-6" />
							</Button>
							<Link href={"/"} className="flex items-center gap-2 flex-shrink-0">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white font-bold text-sm">
									S
								</div>
								<span className="text-xl font-medium text-black hidden md:block">
									SignFlix
								</span>
							</Link>
						</div>

						<div className="flex-1 max-w-xl xl:max-w-2xl mx-4 hidden md:block">
							<div className="flex items-center">
								<div className="relative flex-1">
									<Input
										placeholder="Search"
										className="w-full h-10 px-4 border border-gray-300 rounded-l-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
									/>
								</div>
								<Button
									size="icon"
									className="h-10 w-12 md:w-16 cursor-pointer bg-gray-50 hover:bg-gray-100 border border-l-0 border-gray-300 rounded-r-full text-gray-600"
									variant="ghost"
								>
									<Search className="h-5 w-5" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="ml-2 h-10 w-10 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-full"
									title="Search with voice"
									onClick={() => setIsVoiceModalOpen(true)}
								>
									<Mic className="h-5 w-5" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="ml-2 h-10 w-10 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-full"
									title="Search with sign language"
									onClick={() => setIsCameraModalOpen(true)}
								>
									<Video className="h-5 w-5" />
								</Button>
							</div>
						</div>

						<div className="flex items-center gap-2 flex-shrink-0">
							<Button
								variant="ghost"
								size="icon"
								className="md:hidden hover:bg-gray-100 rounded-full h-10 w-10"
								onClick={handleMobileSearchToggle}
							>
								<Search className="h-5 w-5" />
							</Button>

							<Link href="/studios" target="_blank" className="hidden md:block">
								<Button
									variant="default"
									size="sm"
									className="flex items-center cursor-pointer gap-2 px-4 py-2 h-10 rounded-full text-white shadow-md hover:shadow-lg transition-all duration-200"
									title="Create content"
								>
									<Upload className="h-4 w-4" />
									<span className="font-medium text-sm">Create</span>
								</Button>
							</Link>

							<Button
								variant="ghost"
								size="icon"
								className="hidden md:flex hover:bg-gray-100 cursor-pointer rounded-full h-10 w-10 relative"
								onClick={() => setIsNotificationOpen(true)}
								title="Notifications"
							>
								<Bell className="h-5 w-5" />
								<span className="absolute top-1 right-1 h-2 w-2 bg-red-600 rounded-full"></span>
							</Button>

							{isSignedIn ? (
								<Avatar className="hidden md:flex h-8 w-8 cursor-pointer">
									<AvatarImage src="/placeholder-user.jpg" />
									<AvatarFallback className="bg-purple-600 text-white text-sm">
										U
									</AvatarFallback>
								</Avatar>
							) : (
								<Link className="hidden md:block cursor-pointer" href="/signin">
									<Button
										variant="outline"
										className="h-9 px-3 cursor-pointer border-blue-300 text-blue-600 hover:bg-blue-50 text-sm whitespace-nowrap"
									>
										Sign in
									</Button>
								</Link>
							)}
						</div>
					</div>
				)}
			</header>

			{isSidebarOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
					onClick={closeSidebar}
				/>
			)}

			<aside
				className={`
					fixed top-14 left-0 h-[calc(100vh-3.5rem)] bg-white
					transition-transform duration-300 ease-in-out
					z-40
					border-r border-gray-200
					hidden md:block
					${isSidebarOpen
						? "translate-x-0 w-64"
						: "-translate-x-full md:translate-x-0 md:w-16 xl:w-20"
					}
					md:transition-[width] md:duration-200
				`}
			>
				<nav className="flex flex-col h-full overflow-y-auto">
					<div className="px-2 py-3">
						<div className="space-y-1 mb-4">
							<Link
								href={"/"}
								className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
								onClick={closeSidebar}
							>
								<Home className="w-6 h-6 flex-shrink-0" />
								<span className={`${!isSidebarOpen ? "md:hidden xl:hidden" : ""}`}>
									Home
								</span>
							</Link>
							<Link
								href={"/subscriptions"}
								className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
								onClick={closeSidebar}
							>
								<FileText className="w-6 h-6 flex-shrink-0" />
								<span className={`${!isSidebarOpen ? "md:hidden xl:hidden" : ""}`}>
									Subscriptions
								</span>
							</Link>
						</div>

						<div className="space-y-1 mb-4">
							<hr
								className={`mb-3 border-gray-200 ${!isSidebarOpen ? "md:hidden xl:hidden" : ""}`}
							/>
							<Link
								href={"/library"}
								className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
								onClick={closeSidebar}
							>
								<Library className="w-6 h-6 flex-shrink-0" />
								<span className={`${!isSidebarOpen ? "md:hidden xl:hidden" : ""}`}>
									Library
								</span>
							</Link>
							<Link
								href={"/history"}
								className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
								onClick={closeSidebar}
							>
								<Clock className="w-6 h-6 flex-shrink-0" />
								<span className={`${!isSidebarOpen ? "md:hidden xl:hidden" : ""}`}>
									History
								</span>
							</Link>
							<Link
								href={"/liked"}
								className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
								onClick={closeSidebar}
							>
								<Heart className="w-6 h-6 flex-shrink-0" />
								<span className={`${!isSidebarOpen ? "md:hidden xl:hidden" : ""}`}>
									Liked videos
								</span>
							</Link>
						</div>

						{isSidebarOpen && (
							<>
								<hr className="my-3 border-gray-200" />
								<div className="px-3 py-2">
									<h3 className="text-sm font-medium mb-2 text-gray-900">
										Accessibility Features
									</h3>
									<div className="space-y-2 text-sm text-gray-600">
										<div className="flex items-center gap-2 cursor-pointer hover:text-gray-900 transition-colors">
											<ChevronRight className="w-4 h-4" />
											Sign Language Support
										</div>
										<div className="flex items-center gap-2 cursor-pointer hover:text-gray-900 transition-colors">
											<ChevronRight className="w-4 h-4" />
											Synchronized Captions
										</div>
									</div>
								</div>
							</>
						)}
					</div>
				</nav>
			</aside>

			<nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
				<div className="flex items-center justify-between">
					<Link
						href="/"
						className={`flex flex-1 flex-col items-center justify-center py-2 ${activeTab === "home" ? "text-red-600" : "text-gray-600"}`}
						onClick={() => setActiveTab("home")}
					>
						<Home className="h-5 w-5 mb-0.5" />
						<span className="text-xs font-medium">Home</span>
					</Link>

					<Link
						href="/subscriptions"
						className={`flex flex-1 flex-col items-center justify-center py-2 ${activeTab === "subscriptions" ? "text-red-600" : "text-gray-600"}`}
						onClick={() => setActiveTab("subscriptions")}
					>
						<FileText className="h-5 w-5 mb-0.5" />
						<span className="text-xs font-medium text-center leading-tight">Subs</span>
					</Link>

					<Link
						href="/create"
						className="flex flex-1 flex-col items-center justify-center py-2"
					>
						<div className="bg-red-600 rounded-full p-2 mb-0.5">
							<Plus className="h-4 w-4 text-white" />
						</div>
						<span className="text-xs font-medium text-gray-600">Create</span>
					</Link>

					<Link
						href="/library"
						className={`flex flex-1 flex-col items-center justify-center py-2 ${activeTab === "library" ? "text-red-600" : "text-gray-600"}`}
						onClick={() => setActiveTab("library")}
					>
						<Heart className="h-5 w-5 mb-0.5" />
						<span className="text-xs font-medium">Library</span>
					</Link>

					{isSignedIn ? (
						<Link
							href="/profile"
							className={`flex flex-1 flex-col items-center justify-center py-2 ${activeTab === "profile" ? "text-red-600" : "text-gray-600"}`}
							onClick={() => setActiveTab("profile")}
						>
							<Avatar className="h-5 w-5 mb-0.5">
								<AvatarImage src="/placeholder-user.jpg" />
								<AvatarFallback className="bg-purple-600 text-white text-[10px]">U</AvatarFallback>
							</Avatar>
							<span className="text-xs font-medium">You</span>
						</Link>
					) : (
						<Link
							href="/signin"
							className={`flex flex-1 flex-col items-center justify-center py-2 ${activeTab === "profile" ? "text-red-600" : "text-gray-600"}`}
							onClick={() => setActiveTab("profile")}
						>
							<User className="h-5 w-5 mb-0.5" />
							<span className="text-xs font-medium">You</span>
						</Link>
					)}
				</div>
			</nav>

			<Dialog open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
				<DialogContent className="w-full max-w-sm mx-auto px-4">
					<DialogHeader>
						<DialogTitle>Notifications</DialogTitle>
					</DialogHeader>
					<div className="py-6 text-center text-gray-500">
						<Bell className="mx-auto h-12 w-12 text-gray-300 mb-3" />
						<p>No new notifications</p>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog open={isVoiceModalOpen} onOpenChange={setIsVoiceModalOpen}>
				<DialogContent className="w-full max-w-sm mx-auto px-4">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Mic className="h-5 w-5" />
							Voice Search
						</DialogTitle>
					</DialogHeader>
					<div className="py-6 text-center">
						<div className="mx-auto h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
							<Mic className="h-10 w-10 text-red-600 animate-pulse" />
						</div>
						<p className="text-lg font-medium mb-2">Listening...</p>
						<p className="text-sm text-gray-500 mb-4">Say something to search</p>
						<Button
							variant="outline"
							className="mx-auto"
							onClick={() => setIsVoiceModalOpen(false)}
						>
							Cancel
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog open={isCameraModalOpen} onOpenChange={setIsCameraModalOpen}>
				<DialogContent className="w-full max-w-sm mx-auto px-4">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Video className="h-5 w-5" />
							Sign Language Search
						</DialogTitle>
					</DialogHeader>
					<div className="py-6 text-center">
						<div className="mx-auto h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
							<div className="text-center">
								<Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
								<p className="text-gray-500 text-sm">
									Camera view will appear here
								</p>
							</div>
						</div>
						<p className="text-lg font-medium mb-2">Sign Language Recognition</p>
						<p className="text-sm text-gray-500 mb-4">
							Use sign language gestures to search
						</p>
						<div className="flex gap-2 justify-center flex-wrap">
							<Button variant="default" className="text-sm">
								Start Camera
							</Button>
							<Button
								variant="outline"
								className="text-sm"
								onClick={() => setIsCameraModalOpen(false)}
							>
								Cancel
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			<div className="h-14"></div>
			<div className="h-16 md:hidden"></div>
		</>
	);
};

export default Navbar;