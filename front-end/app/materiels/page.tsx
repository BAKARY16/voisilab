import { EquipmentSection } from "./material"
export const metadata = {
  title: "Équipements - Voisilab",
  description: "Découvrez nos équipements de fabrication numérique",
}

export default function EquipementsPage() {
  return (
    <main className="min-h-screen">
      <EquipmentSection />
    </main>
  )
}