import { WorkshopsSection } from "./ateliers"
export const metadata = {
  title: "Ateliers & Événements - Voisilab",
  description: "Participez à nos ateliers et événements",
}

export default function AteliersPage() {
  return (
    <main className="min-h-screen">
      <WorkshopsSection />
    </main>
  )
}