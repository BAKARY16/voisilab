import { ActualitesContent } from "./actualites-content"

export const metadata = {
  title: "Actualités - Voisilab UVCI",
  description: "Restez informé des dernières nouveautés, événements et partenariats de l'UVCI",
}

export default function ActualitesPage() {
  return (
    <main className="min-h-screen">
      <ActualitesContent />
    </main>
  )
}
