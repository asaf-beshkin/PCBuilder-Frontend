"use client"

import { useState, useEffect } from "react"
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

// --- Embedded product data ---
const cpus = {
  type: "cpu",
  title: "Processors",
  models: [
    { name: "Intel Core i9-14900K", price: 449.99, url: "https://amzn.to/4ju2v9X", image_url: "https://m.media-amazon.com/images/I/61a+cNGLTvL._AC_SX679_.jpg" },
    { name: "AMD Ryzen 9 7950X3D", price: 740.00, url: "https://amzn.to/3E4CG1k", image_url: "https://m.media-amazon.com/images/I/51jNS8epPeL._AC_SX679_.jpg" },
    { name: "Intel Core i7-14700K", price: 325.48, url: "https://amzn.to/4cmrMQY", image_url: "https://m.media-amazon.com/images/I/51seOKbqbcL._AC_SX679_.jpg" },
    { name: "AMD Ryzen 7 7800X3D", price: 409.00, url: "https://amzn.to/4cBut1h", image_url: "https://m.media-amazon.com/images/I/51HqC0rU9HL._AC_SX679_.jpg" },
    { name: "Intel Core i7-12700KF", price: 189.99, url: "https://amzn.to/4jw9qzz", image_url: "https://m.media-amazon.com/images/I/51AqEkc2BuL._AC_SX679_.jpg" },
    { name: "AMD Ryzen 9 7900X", price: 429, url: "https://amzn.to/3EnNx6o", image_url: "https://m.media-amazon.com/images/I/51OEiWrUtqL._AC_SX679_.jpg" },
    { name: "Intel Core i9-12900K", price: 315.73, url: "https://amzn.to/42lFtLu", image_url: "https://m.media-amazon.com/images/I/51klBAsxGHL._AC_SX679_.jpg" },
    { name: "AMD Ryzen 7 7700X", price: 314.99, url: "https://amzn.to/43Mk2FV", image_url: "https://m.media-amazon.com/images/I/51hfER1cZVL._AC_SX679_.jpg" },
    { name: "Intel Core i5-13600K", price: 235.26, url: "https://amzn.to/4j73OvR", image_url: "https://m.media-amazon.com/images/I/61lNEpDfdcL._AC_SX679_.jpg" }
  ]
}

const gpus = {
  type: "gpu",
  title: "Graphics Cards",
  models: [
    { name: "GIGABYTE NVIDIA GeForce RTX 3060", price: 328.78, url: "https://amzn.to/4ct7PYI", image_url: "https://m.media-amazon.com/images/I/61jN35sc4jS._AC_SX679_.jpg" }
  ]
}

const memory = {
  type: "memory",
  title: "Memory",
  models: [
    { name: "TEAMGROUP T-Force Delta RGB DDR5 Ram 32GB (2x16GB)", price: 87.99, url: "https://amzn.to/3E4LZyj", image_url: "https://m.media-amazon.com/images/I/81JEfdUVCTL._AC_SX679_PIbundle-2,TopRight,0,0_SH20_.jpg" },
    { name: "CORSAIR VENGEANCE LPX DDR4 RAM 32GB (2x16GB)", price: 51.99, url: "https://amzn.to/3RLPVHc", image_url: "https://m.media-amazon.com/images/I/61wCOVcyvFL._AC_SX679_.jpg" },
    { name: "TEAMGROUP T-Force Vulcan Z DDR4 DRAM 16GB Kit (2x8GB)", price: 28.99, url: "https://amzn.to/3XRjdYz", image_url: "https://m.media-amazon.com/images/I/71QYVWwXVlL._AC_SX679_PIbundle-2,TopRight,0,0_SH20_.jpg" },
    { name: "TEAMGROUP T-Force Delta RGB DDR5 Ram 64GB (2x32GB)", price: 176.99, url: "https://amzn.to/44kuiFq", image_url: "https://m.media-amazon.com/images/I/81ov4cFmdaL._AC_SX679_PIbundle-2,TopRight,0,0_SH20_.jpg" },
    { name: "G.SKILL Ripjaws V Series (XMP) DDR4 RAM 32GB (2x16GB)", price: 51.99, url: "https://amzn.to/3RQI23b", image_url: "https://m.media-amazon.com/images/I/618SEnJR1nL._AC_SX679_.jpg" },
    { name: "TEAMGROUP T-Force Delta RGB DDR5 Ram 32GB (2x16GB)", price: 102.99, url: "https://amzn.to/4jlekPy", image_url: "https://m.media-amazon.com/images/I/81JEfdUVCTL._AC_SX679_PIbundle-2,TopRight,0,0_SH20_.jpg" },
    { name: "CORSAIR VENGEANCE RGB DDR5 RAM 96GB (2x48GB)", price: 359.99, url: "https://amzn.to/3Gh1549", image_url: "https://m.media-amazon.com/images/I/51wIFRMiMYL._AC_SX679_.jpg" },
    { name: "CORSAIR VENGEANCE RGB PRO DDR4 RAM 16GB (2x8GB)", price: 52.99, url: "https://amzn.to/3R9JnC6", image_url: "https://m.media-amazon.com/images/I/71e6YWJio-L._AC_SX679_PIbundle-2,TopRight,0,0_SH20_.jpg" }
  ]
}

const storage = {
  type: "storage",
  title: "Storage",
  models: [
    { name: "Samsung 990 Pro 2TB NVMe", price: 169.99, url: "https://amzn.to/4llCU4Z", image_url: "https://m.media-amazon.com/images/I/71OWtcxKgvL._AC_SX679_.jpg" },
    { name: "WD Black SN850X 2TB NVMe", price: 154.99, url: "https://amzn.to/42uYPOx", image_url: "https://m.media-amazon.com/images/I/61KeSQhDm4L._AC_SL1500_.jpg" },
    { name: "Crucial T700 2TB Gen5 NVMe", price: 245.50, url: "https://amzn.to/4lEzn1M", image_url: "https://m.media-amazon.com/images/I/41UOk+pwd3L._AC_SX679_.jpg" },
    { name: "Crucial P3 Plus 2TB", price: 116.95, url: "https://amzn.to/3Gf2yrH", image_url: "https://m.media-amazon.com/images/I/51xZaoS+Q1L._AC_SX679_.jpg" },
    { name: "Corsair MP600 Pro XT 2TB", price: 174.99, url: "https://amzn.to/3XSj3QC", image_url: "https://m.media-amazon.com/images/I/71ADysGKWdL._AC_SX679_.jpg" },
    { name: "Sabrent Rocket 5 Plus 2TB NVMe", price: 339.99, url: "https://amzn.to/42lOX9y", image_url: "https://m.media-amazon.com/images/I/61-6r807Q4L._AC_SX679_.jpg" },
    { name: "ADATA 1TB SSD Legend 800", price: 66.99, url: "https://amzn.to/42rhE54", image_url: "https://m.media-amazon.com/images/I/51nYrnv09aL._AC_SX679_.jpg" },
    { name: "TEAMGROUP T-Force Z540 2TB", price: 230.99, url: "https://amzn.to/4jvGO9I", image_url: "https://m.media-amazon.com/images/I/61ivV2tDJ2L._AC_SX679_.jpg" },
    { name: "Lexar NM790 2TB NVMe", price: 124.99, url: "https://amzn.to/3EaFs57", image_url: "https://m.media-amazon.com/images/I/61kxW2eY5qL._AC_SX679_.jpg" }
  ]
}

const motherboard = {
  type: "motherboard",
  title: "Motherboards",
  models: [
    { name: "ASUS TUF Gaming Z790-Plus WiFi", price: 199.99, url: "https://amzn.to/4cpJd3c", image_url: "https://m.media-amazon.com/images/I/81MpNuUuPHL._AC_SX679_.jpg" },
    { name: "MSI PRO Z790-A MAX WiFi", price: 248.87, url: "https://amzn.to/4loimZk", image_url: "https://m.media-amazon.com/images/I/81kOcjOhk9L._AC_SX679_.jpg" },
    { name: "GIGABYTE Z790 AORUS Elite X", price: 229.99, url: "https://amzn.to/4i9oFNP", image_url: "https://m.media-amazon.com/images/I/71ybJIispVL._AC_SX679_.jpg" },
    { name: "ASUS ROG Strix B650-A Gaming WiFi", price: 219.99, url: "https://amzn.to/4jNJgIP", image_url: "https://m.media-amazon.com/images/I/81MH+nx+shL._AC_SX679_.jpg" },
    { name: "MSI PRO B650-S WiFi", price: 149.95, url: "https://amzn.to/4jdRjPe", image_url: "https://m.media-amazon.com/images/I/81Bdd9YzhwL._AC_SX679_.jpg" },
    { name: "GIGABYTE X870E AORUS Elite WIFI7", price: 318.26, url: "https://amzn.to/3GisAKH", image_url: "https://m.media-amazon.com/images/I/71-zivi9pEL._AC_SX679_.jpg" },
    { name: "Gigabyte B650 AORUS Elite AX", price: 221.91, url: "https://amzn.to/43LikEJ", image_url: "https://m.media-amazon.com/images/I/712JD6BVtxL._AC_SX679_.jpg" },
    { name: "MSI B550-A PRO ProSeries Motherboard", price: 119.98, url: "https://amzn.to/3EjIwvM", image_url: "https://m.media-amazon.com/images/I/91nx+MhjjwL._AC_SX679_.jpg" },
    { name: "MSI MAG B650M Mortar WiFi", price: 197.15, url: "https://amzn.to/4lJgAT5", image_url: "https://m.media-amazon.com/images/I/71rOp2OUdzL._AC_SX679_.jpg" }
  ]
}

const psu = {
  type: "psu",
  title: "Power Supplies",
  models: [
    { name: "Corsair RM850x (2021) 850W 80+ Gold", price: 139.95, url: "https://amzn.to/3RaAsQM", image_url: "https://m.media-amazon.com/images/I/71r0WAKCUyL._AC_SX679_.jpg" },
    { name: "Seasonic Focus GX-850 850W 80+ Gold", price: 152.68, url: "https://amzn.to/43JB2MZ", image_url: "https://m.media-amazon.com/images/I/7157nzPaKQL._AC_SX679_.jpg" },
    { name: "MSI MAG A850GL", price: 119.99, url: "https://amzn.to/4cu15Kf", image_url: "https://m.media-amazon.com/images/I/71b3DFHWd7L._AC_SX679_.jpg" },
    { name: "be quiet! Pure Power 12 M 650W", price: 109.69, url: "https://amzn.to/42qjGCe", image_url: "https://m.media-amazon.com/images/I/71iuliYl7uL._AC_SX679_.jpg" },
    { name: "Cooler Master V850 Gold V2", price: 99.99, url: "https://amzn.to/4i7C4G9", image_url: "https://m.media-amazon.com/images/I/81X1hRKY6ML._AC_SX679_.jpg" },
    { name: "Corsair RM1000x Shift 1000W 80+ Gold", price: 209.99, url: "https://amzn.to/4i6WWNt", image_url: "https://m.media-amazon.com/images/I/81dwGXVwpgL._AC_SX679_.jpg" },
    { name: "ASUS ROG Thor 1000W Platinum II", price: 359.99, url: "https://amzn.to/3Eg7EDA", image_url: "https://m.media-amazon.com/images/I/81g2lMkfDnL._AC_SX679_.jpg" },
    { name: "Redragon RGPS-850W 80+ Gold 850 Watt", price: 114.99, url: "https://amzn.to/4javpfI", image_url: "https://m.media-amazon.com/images/I/81h3JvaVxeL._AC_SX679_.jpg" },
    { name: "Thermaltake Toughpower GF3 1000W", price: 169.99, url: "https://amzn.to/42597G2", image_url: "https://m.media-amazon.com/images/I/81cWMYTIhdL._AC_SX679_.jpg" }
  ]
}

const caseData = {
  type: "case",
  title: "Cases",
  models: [
    { name: "Lian Li PC-O11 Dynamic EVO", price: 249.90, url: "https://amzn.to/4jqdKQy", image_url: "https://m.media-amazon.com/images/I/617EO7rVz9L._AC_SX679_.jpg" },
    { name: "Fractal Design Meshify 2 Compact", price: 114.96, url: "https://amzn.to/4jdLQIc", image_url: "https://m.media-amazon.com/images/I/81kYKjaT4LL._AC_SX679_.jpg" },
    { name: "NZXT H7 Flow", price: 143.99, url: "https://amzn.to/42sXlUS", image_url: "https://m.media-amazon.com/images/I/81Gg4s1YBEL.__AC_SX300_SY300_QL70_FMwebp_.jpg" },
    { name: "Corsair 4000D Airflow", price: 98.99, url: "https://amzn.to/4lvUNhy", image_url: "https://m.media-amazon.com/images/I/71J4iohAlaL._AC_SX679_.jpg" },
    { name: "DARKROCK EC2 Black ATX Mid Tower PC", price: 59.99, url: "https://amzn.to/4lGhAr0", image_url: "https://m.media-amazon.com/images/I/813M1+AB6kL._AC_SX679_.jpg" },
    { name: "Cooler Master HAF 700", price: 499.99, url: "https://amzn.to/42EmL2V", image_url: "https://m.media-amazon.com/images/I/61hC6R08S+L._AC_SX679_.jpg" },
    { name: "Thermaltake Core P3 TG Pro", price: 258.32, url: "https://amzn.to/42bjybb", image_url: "https://m.media-amazon.com/images/I/514h+fhSncL._AC_SX679_.jpg" },
    { name: "be quiet! Pure Base 500 FX", price: 149.90, url: "https://amzn.to/3RaobvP", image_url: "https://m.media-amazon.com/images/I/71dMpet0AOL._AC_SX679_.jpg" },
    { name: "HYTE Y60", price: 162.99, url: "https://amzn.to/4jayDja", image_url: "https://m.media-amazon.com/images/I/71eWq2GbhhL._AC_SX679_.jpg" }
  ]
}

const cooling = {
  type: "cooling",
  title: "Cooling",
  models: [
    { name: "Noctua NH-D15", price: 139.95, url: "https://amzn.to/4loeSWK", image_url: "https://m.media-amazon.com/images/I/91VK6w0FmWL._SX522_.jpg" },
    { name: "Corsair iCUE H150i Elite Capellix XT", price: 163.37, url: "https://amzn.to/3EicUqs", image_url: "https://m.media-amazon.com/images/I/7107JaxG7XL._SX522_.jpg" },
    { name: "ARCTIC Liquid Freezer III 360 A-RGB ", price: 139.99, url: "https://amzn.to/4ls30TC", image_url: "https://m.media-amazon.com/images/I/71ebWdG-GbL._SL1500_.jpg" },
    { name: "Thermalright Peerless Assassin 120 SE", price: 34.90, url: "https://amzn.to/4i9l7uZ", image_url: "https://m.media-amazon.com/images/I/71j6VKsz-fL._SX522_.jpg" },
    { name: "Lian Li Galahad II Trinity 360", price: 189.99, url: "https://amzn.to/3G5SOAg", image_url: "https://m.media-amazon.com/images/I/717-NilSKVL._AC_SX679_.jpg" },
    { name: "NZXT Kraken Elite 360 RGB 2024", price: 319.99, url: "https://amzn.to/4ig0T2L", image_url: "https://m.media-amazon.com/images/I/41bszvNaXPL._SX522_.jpg" }
  ]
}

// Mapping product data by type for easy access in the component
const productData: Record<string, any> = {
  cpu: cpus,
  gpu: gpus,
  memory: memory,
  storage: storage,
  motherboard: motherboard,
  psu: psu,
  case: caseData,
  cooling: cooling
}

// --- End Embedded Data ---

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

  // Instead of fetching from a backend, load the data from the embedded productData
  useEffect(() => {
    setIsLoading(true)
    setError(null)
    try {
      const data = productData[type]
      if (data && data.models) {
        setComponents(data.models)
      } else {
        setError("No data found for component type: " + type)
      }
    } catch (err) {
      setError("Failed to load component data. Please try again later.")
      console.error(`Error loading ${type} data:`, err)
    } finally {
      setIsLoading(false)
    }
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
