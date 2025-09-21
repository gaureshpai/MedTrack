"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Bell,
  Menu,
  Search,
  Mic,
  Video,
  ArrowLeft,
  Upload,
  Home,
  FileText,
  Library,
  Clock,
  Heart,
  User,
  Plus,
  ChevronRight,
} from "lucide-react"
import VoiceSearchDialog from "@/components/common/voice-search-dialog"
import SignLanguageDialog from "@/components/common/sign-language-dialog"

export default function Navbar() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSignedIn] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [isClient, setIsClient] = useState(false)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const desktopInputRef = useRef<HTMLInputElement | null>(null)
  const mobileInputRef = useRef<HTMLInputElement | null>(null)

  // Voice transcript handler
  const handleVoiceTranscriptChange = (text: string, isFinal: boolean) => {
    // Show interim results too for real-time feedback
    setSearchQuery((prev) => {
      if (isFinal) {
        const sep = prev && !prev.endsWith(" ") ? " " : ""
        return `${prev}${sep}${text.trim()}`
      } else {
        // For interim results, replace the last word being spoken
        const words = prev.split(' ')
        words[words.length - 1] = text.trim()
        return words.join(' ')
      }
    })

    const el = isMobileSearchOpen ? mobileInputRef.current : desktopInputRef.current
    if (el) {
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = el.value.length
      })
    }
  }

  // Since we're using modals now, we don't need direct hooks here
  // The hooks are used within the modal components

  const handleSidebarToggle = () => setIsSidebarOpen((v) => !v)
  const closeSidebar = () => setIsSidebarOpen(false)
  const handleMobileSearchToggle = () => setIsMobileSearchOpen((v) => !v)

  // Ensure client-side only rendering for dynamic states
  useEffect(() => {
    setIsClient(true)
  }, [])



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
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex-1 flex items-center">
              <div className="relative flex-1">
                  <Input
                    ref={mobileInputRef}
                    className="w-full h-9 px-4 border border-gray-300 rounded-l-full focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 outline-none"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search"
                    placeholder={isClient && isVoiceModalOpen ? 'Voice search active...' : isClient && isCameraModalOpen ? 'Sign language active...' : 'Search'}
                    suppressHydrationWarning
                  />
              </div>
              <Button
                size="icon"
                className="h-9 w-12 bg-gray-50 hover:bg-gray-100 border border-l-0 border-gray-300 rounded-r-full text-gray-600"
                variant="ghost"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative inline-block ml-2">
              <Button
                variant="ghost"
                size="icon"
                className={`h-10 w-10 transition-colors rounded-full ${
                  isClient && isVoiceModalOpen 
                    ? 'bg-red-100 hover:bg-red-200 text-red-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Voice Search - Click to start/stop voice input"
                aria-label="Voice Search - Click to start/stop voice input"
                onClick={() => {
                  setIsVoiceModalOpen(true)
                }}
              >
                <Mic className={`h-5 w-5 ${isClient && isVoiceModalOpen ? 'animate-pulse' : ''}`} />
              </Button>
              <span className={`absolute -top-1 -right-1 text-[10px] font-bold px-1 py-0.5 rounded shadow ${
                isClient && isVoiceModalOpen ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                {isClient && isVoiceModalOpen ? 'ON' : 'Voice'}
              </span>
            </div>

            <div className="relative inline-block ml-2">
              <Button
                variant="ghost"
                size="icon"
                className={`h-10 w-10 transition-colors rounded-full ${
                  isClient && isCameraModalOpen 
                    ? 'bg-green-100 hover:bg-green-200 text-green-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Sign Language Search - Click to start/stop sign language input"
                aria-label="Sign Language Search - Click to start/stop sign language input"
                onClick={() => {
                  setIsCameraModalOpen(true)
                }}
              >
                <Video className={`h-5 w-5 ${isClient && isCameraModalOpen ? 'animate-pulse' : ''}`} />
              </Button>
              <span className={`absolute -top-1 -right-1 text-[10px] font-bold px-1 py-0.5 rounded shadow bg-green-500 text-white`}>
                {isClient && isCameraModalOpen ? 'ON' : 'Sign'}
              </span>
            </div>
          </div>
        )}

        {!isMobileSearchOpen && (
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-4 min-w-0 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex hover:bg-gray-100 rounded-full p-2 h-10 w-10"
                onClick={handleSidebarToggle}
                aria-label="Toggle sidebar"
              >
                <Menu className="h-6 w-6" />
              </Button>

              <Link href={"/"} className="flex items-center gap-2 flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white font-bold text-sm">
                  S
                </div>
                <span className="text-xl font-medium text-black hidden md:block">MedTrack</span>
              </Link>
            </div>

            <div className="flex-1 max-w-xl xl:max-w-2xl mx-4 hidden md:block">
              <div className="flex items-center">
                <div className="relative flex-1">
                  <Input
                    ref={desktopInputRef}
                    className="w-full h-10 px-4 border border-gray-300 rounded-l-full focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search"
                    placeholder={isClient && isVoiceModalOpen ? 'Voice search active...' : isClient && isCameraModalOpen ? 'Sign language active...' : 'Search'}
                    suppressHydrationWarning
                  />
                </div>
                <Button
                  size="icon"
                  className="h-10 w-16 bg-gray-50 hover:bg-gray-100 border border-l-0 border-gray-300 rounded-r-full text-gray-600"
                  variant="ghost"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </Button>

                <div className="relative inline-block ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-10 w-10 transition-colors rounded-full ${
                      isClient && isVoiceModalOpen 
                        ? 'bg-red-100 hover:bg-red-200 text-red-600' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    title="Voice Search - Click to start/stop voice input"
                    aria-label="Voice Search - Click to start/stop voice input"
                    onClick={() => {
                      setIsVoiceModalOpen(true)
                    }}
                  >
                    <Mic className={`h-5 w-5 ${isClient && isVoiceModalOpen ? 'animate-pulse' : ''}`} />
                  </Button>
                  <span className={`absolute -top-1 -right-1 text-[10px] font-bold px-1 py-0.5 rounded shadow ${
                    isClient && isVoiceModalOpen ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {isClient && isVoiceModalOpen ? 'ON' : 'Voice'}
                  </span>
                </div>

                <div className="relative inline-block ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-10 w-10 transition-colors rounded-full ${
                      isClient && isCameraModalOpen 
                        ? 'bg-green-100 hover:bg-green-200 text-green-600' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    title="Sign Language Search - Click to start/stop sign language input"
                    aria-label="Sign Language Search - Click to start/stop sign language input"
                    onClick={() => {
                      setIsCameraModalOpen(true)
                    }}
                  >
                    <Video className={`h-5 w-5 ${isClient && isCameraModalOpen ? 'animate-pulse' : ''}`} />
                  </Button>
                  <span className={`absolute -top-1 -right-1 text-[10px] font-bold px-1 py-0.5 rounded shadow bg-green-500 text-white`}>
                    {isClient && isCameraModalOpen ? 'ON' : 'Sign'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-gray-100 rounded-full h-10 w-10"
                onClick={handleMobileSearchToggle}
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </Button>

              <Link href="/studios" target="_blank" className="hidden md:block">
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2 px-4 py-2 h-10 rounded-full text-white shadow-md hover:shadow-lg transition-all duration-200"
                  title="Create content"
                >
                  <Upload className="h-4 w-4" />
                  <span className="font-medium text-sm">Create</span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex hover:bg-gray-100 rounded-full h-10 w-10 relative"
                onClick={() => setIsNotificationOpen(true)}
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-600 rounded-full" />
              </Button>

              {isSignedIn ? (
                <Avatar className="hidden md:flex h-8 w-8 cursor-pointer">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback className="bg-purple-600 text-white text-sm">U</AvatarFallback>
                </Avatar>
              ) : (
                <Link className="hidden md:block" href="/signin" aria-label="Sign in">
                  <Button
                    variant="outline"
                    className="h-9 px-3 border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-sm bg-transparent"
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
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] bg-white transition-transform duration-300 ease-in-out z-40 border-r border-gray-200 hidden md:block ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-16 xl:w-20"
          } md:transition-[width] md:duration-200`}
        aria-label="Sidebar"
      >
        <nav className="flex flex-col h-full overflow-y-auto">
          <div className="px-2 py-3">
            <div className="space-y-1 mb-4">
              <Link
                href={"/"}
                className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100"
                onClick={closeSidebar}
              >
                <Home className="w-6 h-6 flex-shrink-0" />
                <span className={`${!isSidebarOpen ? "md:hidden xl:hidden" : ""}`}>Home</span>
              </Link>
              <Link
                href={"/subscriptions"}
                className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100"
                onClick={closeSidebar}
              >
                <FileText className="w-6 h-6 flex-shrink-0" />
                <span className={`${!isSidebarOpen ? "md:hidden xl:hidden" : ""}`}>Subscriptions</span>
              </Link>
            </div>

            <div className="space-y-1 mb-4">
              <hr className={`mb-3 border-gray-200 ${!isSidebarOpen ? "md:hidden xl:hidden" : ""}`} />
              <Link
                href={"/library"}
                className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100"
                onClick={closeSidebar}
              >
                <Library className="w-6 h-6 flex-shrink-0" />
                <span className={`${!isSidebarOpen ? "md:hidden xl:hidden" : ""}`}>Library</span>
              </Link>
              <Link
                href={"/history"}
                className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100"
                onClick={closeSidebar}
              >
                <Clock className="w-6 h-6 flex-shrink-0" />
                <span className={`${!isSidebarOpen ? "md:hidden xl:hidden" : ""}`}>History</span>
              </Link>
            </div>

            {isSidebarOpen && (
              <>
                <hr className="my-3 border-gray-200" />
                <div className="px-3 py-2">
                  <h3 className="text-sm font-medium mb-2 text-gray-900">Accessibility Features</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2 hover:text-gray-900">
                      <ChevronRight className="w-4 h-4" />
                      Sign Language Support
                    </div>
                    <div className="flex items-center gap-2 hover:text-gray-900">
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

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden"
        aria-label="Bottom navigation"
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={`flex flex-1 flex-col items-center justify-center py-2 ${activeTab === "home" ? "text-red-600" : "text-gray-600"
              }`}
            onClick={() => setActiveTab("home")}
          >
            <Home className="h-5 w-5 mb-0.5" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link
            href="/subscriptions"
            className={`flex flex-1 flex-col items-center justify-center py-2 ${activeTab === "subscriptions" ? "text-red-600" : "text-gray-600"
              }`}
            onClick={() => setActiveTab("subscriptions")}
          >
            <FileText className="h-5 w-5 mb-0.5" />
            <span className="text-xs font-medium leading-tight">Subs</span>
          </Link>
          <Link href="/create" className="flex flex-1 flex-col items-center justify-center py-2">
            <div className="bg-red-600 rounded-full p-2 mb-0.5">
              <Plus className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-600">Create</span>
          </Link>
          <Link
            href="/library"
            className={`flex flex-1 flex-col items-center justify-center py-2 ${activeTab === "library" ? "text-red-600" : "text-gray-600"
              }`}
            onClick={() => setActiveTab("library")}
          >
            <Heart className="h-5 w-5 mb-0.5" />
            <span className="text-xs font-medium">Library</span>
          </Link>
          {isSignedIn ? (
            <Link
              href="/profile"
              className={`flex flex-1 flex-col items-center justify-center py-2 ${activeTab === "profile" ? "text-red-600" : "text-gray-600"
                }`}
              onClick={() => setActiveTab("profile")}
            >
              <Avatar className="h-5 w-5 mb-0.5">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-purple-600 text-white text-[10px]">U</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">You</span>
            </Link>
          ) : (
            <Link
              href="/signin"
              className={`flex flex-1 flex-col items-center justify-center py-2 ${activeTab === "profile" ? "text-red-600" : "text-gray-600"
                }`}
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

      {/* Voice Search Modal */}
      <VoiceSearchDialog
        open={isVoiceModalOpen}
        onOpenChange={setIsVoiceModalOpen}
        onTranscriptChange={handleVoiceTranscriptChange}
      />

      {/* Sign Language Search Modal */}
      <SignLanguageDialog
        isCameraModalOpen={isCameraModalOpen}
        setIsCameraModalOpen={setIsCameraModalOpen}
        onResult={(word) => {
          // Add all recognized letters/words to search query
          setSearchQuery((prev) => prev + word)
          const el = isMobileSearchOpen ? mobileInputRef.current : desktopInputRef.current
          if (el) {
            requestAnimationFrame(() => {
              el.selectionStart = el.selectionEnd = el.value.length
            })
          }
        }}
      />


      <div className="h-14" />
    </>
  )
}