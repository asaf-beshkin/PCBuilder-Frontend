"use client"

import type { Component } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Plus, X } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useBuild } from "@/context/build-context"
import { useToast } from "@/components/ui/use-toast"
import type { ComponentType } from "@/lib/types"

interface ComponentCardProps {
  component: Component
  type: ComponentType
}

export function ComponentCard({ component, type }: ComponentCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { selectedComponents, addToBuild, removeFromBuild } = useBuild()
  const { toast } = useToast()

  // Only one selection per category: update selection by replacing any previous selection
  const isSelected = selectedComponents[type]?.name === component.name

  const handleAddToBuild = () => {
    addToBuild(type, component)
    toast({
      title: "Component Added",
      description: `${component.name} has been added to your build.`,
      duration: 3000,
    })
  }

  const handleRemoveFromBuild = () => {
    removeFromBuild(type)
    toast({
      title: "Component Removed",
      description: `${component.name} has been removed from your build.`,
      duration: 3000,
    })
  }

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card
        className={`h-full flex flex-col overflow-hidden border-2 transition-all duration-300 ${
          isSelected ? "border-primary bg-primary/5" : ""
        }`}
        style={{
          borderColor: isSelected
            ? "hsl(var(--primary))"
            : isHovered
            ? "hsl(var(--primary))"
            : "hsl(var(--border))",
          boxShadow:
            isHovered || isSelected
              ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
              : "none",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-6 flex-grow">
          <div className="h-40 mb-4 rounded-lg flex items-center justify-center overflow-hidden bg-muted/30">
            {component.image_url ? (
              <img
                src={component.image_url}
                alt={component.name}
                className="object-contain h-full w-full"
              />
            ) : (
              <div className="text-muted-foreground text-sm">Component Image</div>
            )}
          </div>
          <h3 className="font-semibold text-lg line-clamp-2 h-14">{component.name}</h3>
          <div className="mt-2">
            <span className="text-2xl font-bold text-primary">${component.price.toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex gap-2">
          {isSelected ? (
            <Button variant="destructive" className="w-full gap-2" onClick={handleRemoveFromBuild}>
              <X className="h-4 w-4" />
              Remove
            </Button>
          ) : (
            <Button
              className="w-full gap-2 bg-primary hover:bg-primary/90"
              onClick={handleAddToBuild}
            >
              <Plus className="h-4 w-4" />
              Add to Build
            </Button>
          )}
          <Button variant="outline" size="icon" asChild>
            <a
              href={component.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View details"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
