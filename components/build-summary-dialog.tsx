"use client"

import { useBuild } from "@/context/build-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Cpu,
  CpuIcon as Gpu,
  MemoryStickIcon as Memory,
  HardDrive,
  CircuitBoard,
  Zap,
  Box,
  Fan,
  Trash2,
  AlertTriangle,
  ShoppingCart,
  ExternalLink,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import type { ComponentType } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BuildSummaryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BuildSummaryDialog({ open, onOpenChange }: BuildSummaryDialogProps) {
  const { selectedComponents, removeFromBuild, clearBuild, totalPrice, isComplete, componentCount } = useBuild()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getIconForType = (type: ComponentType) => {
    switch (type) {
      case "cpu":
        return <Cpu className="h-5 w-5" />
      case "gpu":
        return <Gpu className="h-5 w-5" />
      case "ram":
        return <Memory className="h-5 w-5" />
      case "storage":
        return <HardDrive className="h-5 w-5" />
      case "motherboard":
        return <CircuitBoard className="h-5 w-5" />
      case "psu":
        return <Zap className="h-5 w-5" />
      case "case":
        return <Box className="h-5 w-5" />
      case "cooling":
        return <Fan className="h-5 w-5" />
      default:
        return <Box className="h-5 w-5" />
    }
  }

  const getComponentTypeName = (type: ComponentType): string => {
    switch (type) {
      case "cpu":
        return "Processor"
      case "gpu":
        return "Graphics Card"
      case "ram":
        return "Memory"
      case "storage":
        return "Storage"
      case "motherboard":
        return "Motherboard"
      case "psu":
        return "Power Supply"
      case "case":
        return "Case"
      case "cooling":
        return "Cooling"
      default:
        return type
    }
  }

  const handleClearBuild = () => {
    clearBuild()
    toast({
      title: "Build Cleared",
      description: "Your PC build has been cleared.",
      duration: 3000,
    })
  }

  const handleRemoveComponent = (type: ComponentType) => {
    removeFromBuild(type)
    toast({
      title: "Component Removed",
      description: `${getComponentTypeName(type)} has been removed from your build.`,
      duration: 3000,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Your PC Build</DialogTitle>
          <DialogDescription>
            {componentCount === 0
              ? "Start by adding components to your build."
              : isComplete
              ? "Your build is complete! Review your selections below."
              : "Continue adding required components to complete your build."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow pr-4 -mr-4 overflow-y-auto">
          {componentCount === 0 ? (
            <div className="py-8 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Your build is empty</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding components from the main page.
              </p>
              <Button onClick={() => onOpenChange(false)}>Browse Components</Button>
            </div>
          ) : (
            mounted && (
              <div className="space-y-4 py-4">
                {!isComplete && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex gap-3 mb-6">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-500">Incomplete Build</h4>
                      <p className="text-sm text-muted-foreground">
                        Your build is missing required components. Add at least one CPU, Motherboard, Memory, Storage,
                        Power Supply, and Case.
                      </p>
                    </div>
                  </div>
                )}

                {Object.entries(selectedComponents).map(([type, component]) => {
                  const componentType = type as ComponentType
                  const isRequired = ["cpu", "motherboard", "ram", "storage", "psu", "case"].includes(type)

                  return (
                    <div
                      key={type}
                      className={`border rounded-lg p-4 ${
                        isRequired && !component ? "border-amber-500/50 bg-amber-500/5" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              component ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {getIconForType(componentType)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{getComponentTypeName(componentType)}</h3>
                              {isRequired && (
                                <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full">
                                  Required
                                </span>
                              )}
                            </div>
                            {component ? (
                              <>
                                <p className="text-sm font-medium mt-1">{component.name}</p>
                                <p className="text-sm text-primary font-bold mt-1">
                                  ${component.price.toFixed(2)}
                                </p>
                                <a
                                  href={component.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-sm text-primary hover:underline mt-2"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  View Product
                                </a>
                              </>
                            ) : (
                              <p className="text-sm text-muted-foreground mt-1">
                                {isRequired
                                  ? "Required - Please select a component"
                                  : "Optional - No component selected"}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center">
                          {component && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive"
                                    onClick={() => handleRemoveComponent(componentType)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Remove component</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}

                          {!component && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                onOpenChange(false)
                                setTimeout(() => {
                                  document.getElementById(componentType)?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  })
                                }, 100)
                              }}
                            >
                              Select
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}

                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Total Price</h3>
                      <p className="text-sm text-muted-foreground">
                        {componentCount} component{componentCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</div>
                  </div>
                </div>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Please verify that all selected components are compatible with each other before proceeding.
                </p>
              </div>
            )
          )}
        </ScrollArea>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          {componentCount > 0 ? (
            <Button variant="outline" className="sm:mr-auto" onClick={handleClearBuild}>
              Clear Build
            </Button>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
