"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Component, ComponentType } from "@/lib/types"

interface BuildContextType {
  selectedComponents: Record<ComponentType, Component | null>
  addToBuild: (type: ComponentType, component: Component) => void
  removeFromBuild: (type: ComponentType) => void
  clearBuild: () => void
  totalPrice: number
  isComplete: boolean
  componentCount: number
}

const BuildContext = createContext<BuildContextType | undefined>(undefined)

const componentTypes: ComponentType[] = ["cpu", "gpu", "ram", "storage", "motherboard", "psu", "case", "cooling"]

const initialSelectedComponents: Record<ComponentType, Component | null> = {
  cpu: null,
  gpu: null,
  ram: null,
  storage: null,
  motherboard: null,
  psu: null,
  case: null,
  cooling: null,
}

export function BuildProvider({ children }: { children: ReactNode }) {
  const [selectedComponents, setSelectedComponents] = useState<Record<ComponentType, Component | null>>(() => {
    // Try to load from localStorage on client side
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pcBuild")
      return saved ? JSON.parse(saved) : initialSelectedComponents
    }
    return initialSelectedComponents
  })

  const [totalPrice, setTotalPrice] = useState(0)
  const [componentCount, setComponentCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // Update derived state when selected components change
  useEffect(() => {
    // Calculate total price
    const total = Object.values(selectedComponents).reduce((sum, component) => sum + (component?.price || 0), 0)
    setTotalPrice(total)

    // Count components
    const count = Object.values(selectedComponents).filter(Boolean).length
    setComponentCount(count)

    // Check if build is complete (has at least one component of each required type)
    const requiredTypes: ComponentType[] = ["cpu", "motherboard", "ram", "storage", "psu", "case"]
    const hasAllRequired = requiredTypes.every((type) => selectedComponents[type] !== null)
    setIsComplete(hasAllRequired)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("pcBuild", JSON.stringify(selectedComponents))
    }
  }, [selectedComponents])

  const addToBuild = (type: ComponentType, component: Component) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [type]: component,
    }))
  }

  const removeFromBuild = (type: ComponentType) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [type]: null,
    }))
  }

  const clearBuild = () => {
    setSelectedComponents(initialSelectedComponents)
  }

  return (
    <BuildContext.Provider
      value={{
        selectedComponents,
        addToBuild,
        removeFromBuild,
        clearBuild,
        totalPrice,
        isComplete,
        componentCount,
      }}
    >
      {children}
    </BuildContext.Provider>
  )
}

export function useBuild() {
  const context = useContext(BuildContext)
  if (context === undefined) {
    throw new Error("useBuild must be used within a BuildProvider")
  }
  return context
}

