"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Monitor, Menu, X } from "lucide-react"
import Link from "next/link"
import { useBuild } from "@/context/build-context"
import { BuildSummaryDialog } from "@/components/build-summary-dialog"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isBuildDialogOpen, setIsBuildDialogOpen] = useState(false)
  const { componentCount, totalPrice } = useBuild()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">PC Builder</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="#cpu" className="text-sm font-medium hover:text-primary transition-colors">
                Components
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <ModeToggle />

              <Button
                variant={componentCount > 0 ? "default" : "outline"}
                className="hidden md:flex gap-2"
                onClick={() => setIsBuildDialogOpen(true)}
              >
                My Build{" "}
                {componentCount > 0 && (
                  <span className="bg-primary-foreground text-primary rounded-full px-2 py-0.5 text-xs">
                    ${totalPrice.toFixed(2)}
                  </span>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4 bg-background">
              <Link
                href="/"
                className="px-4 py-2 rounded-md hover:bg-muted transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#cpu"
                className="px-4 py-2 rounded-md hover:bg-muted transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Components
              </Link>
              <Button
                className="w-full gap-2"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setIsBuildDialogOpen(true)
                }}
              >
                My Build{" "}
                {componentCount > 0 && (
                  <span className="bg-primary-foreground text-primary rounded-full px-2 py-0.5 text-xs">
                    ${totalPrice.toFixed(2)}
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}
      </header>

      <BuildSummaryDialog open={isBuildDialogOpen} onOpenChange={setIsBuildDialogOpen} />
    </>
  )
}
