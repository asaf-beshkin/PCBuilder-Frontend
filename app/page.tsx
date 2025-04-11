import { ComponentSelector } from "@/components/component-selector"
import { HeroSection } from "@/components/hero-section"
import { ScrollToTopButton } from "@/components/scroll-to-top"
import { BuildSummaryFloatingButton } from "@/components/build-summary-floating-button"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <HeroSection />

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-12">
          <ComponentSelector type="cpu" title="Processors" description="Central Processing Units" icon="Cpu" />
          <ComponentSelector type="gpu" title="Graphics Cards" description="Graphics Processing Units" icon="Gpu" />
          <ComponentSelector type="ram" title="Memory" description="Random Access Memory" icon="Memory" />
          <ComponentSelector type="storage" title="Storage" description="SSDs and Hard Drives" icon="HardDrive" />
          <ComponentSelector
            type="motherboard"
            title="Motherboards"
            description="Main Circuit Boards"
            icon="CircuitBoard"
          />
          <ComponentSelector type="psu" title="Power Supplies" description="Power Supply Units" icon="Zap" />
          <ComponentSelector type="case" title="Cases" description="Computer Chassis" icon="Box" />
          <ComponentSelector type="cooling" title="Cooling" description="CPU and Case Cooling Solutions" icon="Fan" />
        </div>
      </div>

      <ScrollToTopButton />
      <BuildSummaryFloatingButton />
    </main>
  )
}

