import { Monitor } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Monitor className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">PC Builder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Build your dream PC with our interactive component selector.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Components</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#cpu" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Processors
                </Link>
              </li>
              <li>
                <Link href="#gpu" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Graphics Cards
                </Link>
              </li>
              <li>
                <Link href="#ram" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Memory
                </Link>
              </li>
              <li>
                <Link href="#storage" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Storage
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <p className="text-sm text-muted-foreground">
              You can reach us at:
            </p>
            <p className="text-sm text-muted-foreground underline">
              <a href="mailto:asafbeshkin@gmail.com">asafbeshkin@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
