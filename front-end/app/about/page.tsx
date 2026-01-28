import { AboutContact } from "./info"

export const metadata = {
  title: "Contact - Voisilab",
  description: "Soumettez votre projet au Fablab Voisilab",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutContact />
    </main>
  )
}