"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useBuild } from "@/context/build-context"
import { BuildSummaryDialog } from "@/components/build-summary-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export function BuildSummaryFloatingButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { componentCount, totalPrice } = useBuild()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Don't show on desktop as it's in the navbar
  if (isDesktop) return null

  // Don't show if no components selected
  if (componentCount === 0) return null

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full"
        size="lg"
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        View Build{" "}
        <span className="bg-primary-foreground text-primary rounded-full px-2 py-0.5 text-xs ml-2">
          ${totalPrice.toFixed(2)}
        </span>
      </Button>

      <BuildSummaryDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  )
}

