export type ComponentType = "cpu" | "gpu" | "ram" | "storage" | "motherboard" | "psu" | "case" | "cooling"

export interface Component {
  name: string
  price: number
  url: string
  // Additional fields that could be added:
  // image?: string
  // specs?: Record<string, string>
  // rating?: number
  // stock?: 'in-stock' | 'limited' | 'out-of-stock'
}

export interface ComponentResponse {
  [key: string]: Component[]
}

