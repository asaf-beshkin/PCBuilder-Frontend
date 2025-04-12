"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function HeroSection() {
  const scrollToComponents = () => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Main content */}
      <div className="text-center px-4 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Build Your Dream PC
        </h1>
        <p className="text-xl md:text-2xl text-white/80 mb-8">
          Select high-quality components for your custom build with our interactive part picker
        </p>
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          onClick={scrollToComponents}
        >
          Start Building
        </Button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10"
          onClick={scrollToComponents}
        >
          <ChevronDown className="h-8 w-8" />
        </Button>
      </div>
    </div>
  )
}
