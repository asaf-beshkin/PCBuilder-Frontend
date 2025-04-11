"use client"

import { useState, useEffect } from "react"
import { fetchComponentData } from "@/lib/api"
import { ComponentCard } from "@/components/component-card"
import type { ComponentType, Component } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ChevronDown, ChevronUp, Cpu, CpuIcon as Gpu, MemoryStickIcon as Memory, HardDrive, CircuitBoard, Zap, Box, Fan } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useBuild } from "@/context/build-context"

interface ComponentSelectorProps {
  type: ComponentType
  title: string
  description: string
  icon: string
}

const INITIAL_VISIBLE_COUNT = 9

export function ComponentSelector({ type, title, description, icon }: ComponentSelectorProps) {
  const [components, setComponents] = useState<Component[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
  const [isMounted, setIsMounted] = useState(false)
  
  const { selectedComponents } = useBuild()
  const selectedComponent = selectedComponents[type]

  // Set isMounted to true only on the client after mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Get the correct icon component based on the icon string
  const IconComponent = () => {
    switch (icon) {
      case "Cpu":
        return <Cpu className="h-6 w-6" />
      case "Gpu":
        return <Gpu className="h-6 w-6" />
      case "Memory":
        return <Memory className="h-6 w-6" />
      case "HardDrive":
        return <HardDrive className="h-6 w-6" />
      case "CircuitBoard":
        return <CircuitBoard className="h-6 w-6" />
      case "Zap":
        return <Zap className="h-6 w-6" />
      case "Box":
        return <Box className="h-6 w-6" />
      case "Fan":
        return <Fan className="h-6 w-6" />
      default:
        return <Box className="h-6 w-6" />
    }
  }

  useEffect(() => {
    const loadComponents = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchComponentData(type)
        // Ensure that you extract the "models" array from the returned object.
        setComponents(data.models || [])
      } catch (err) {
        setError("Failed to load component data. Please try again later.")
        console.error(`Error fetching ${type} data:`, err)
      } finally {
        setIsLoading(false)
      }
    }

    loadComponents()
  }, [type])

  // Determine the list of components to display based on visibleCount
  const displayedComponents = components.slice(0, visibleCount)

  return (
    <section id={type} className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div
        className="p-6 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
            <IconComponent />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
            {isMounted && selectedComponent && (
              <div className="mt-1">
                <span className="inline-flex items-center bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                  Selected: {selectedComponent.name}
                </span>
              </div>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 pt-0 border-t">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-xl border bg-card overflow-hidden">
                      <div className="p-6 space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedComponents.map((component, index) => (
                      <motion.div
                        key={`${component.name}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ComponentCard 
                          component={component} 
                          type={type}
                        />
                      </motion.div>
                    ))}
                  </div>
                  {components.length > INITIAL_VISIBLE_COUNT && (
                    <div className="mt-6 text-center">
                      {visibleCount < components.length ? (
                        <Button onClick={() => setVisibleCount(components.length)}>
                          Show More
                        </Button>
                      ) : (
                        <Button onClick={() => setVisibleCount(INITIAL_VISIBLE_COUNT)}>
                          Show Less
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
