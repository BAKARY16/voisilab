import { TeamSection } from "./equipe"

export const metadata = {
  title: "Notre Équipe - Voisilab",
  description: "Rencontrez l'équipe Voisilab",
}

export default function EquipePage() {
  return (
    <main className="min-h-screen">
      <TeamSection />
    </main>
  )
}