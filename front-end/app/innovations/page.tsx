import { InnovationsSection } from "./innovation"
export const metadata = {
  title: "Innovations - Voisilab",
  description: "Découvrez nos projets innovants",
}

export default function InnovationsPage() {
  return (
    <main className="min-h-screen">
      <InnovationsSection />
    </main>
  )
}