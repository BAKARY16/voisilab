import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { LoadingProvider } from "@/contexts/loading-context"
import { AuthProvider } from "@/contexts/auth"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"
import { PageWrapper } from "@/components/page-wrapper"
import "./globals.css"

import { Geist, Geist_Mono } from "next/font/google"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Voisilab - Fablab Innovation & Fabrication Numérique",
  description:
    "Voisilab, un fablab innovant depuis 2019, démocratise la fabrication numérique pour tous. Accédez à des machines de pointe, participez à des ateliers et donnez vie à vos projets créatifs.",
  generator: "v0.app",
  keywords: [
    "fablab",
    "fabrication numérique",
    "impression 3D",
    "découpe laser",
    "CNC",
    "maker space",
    "innovation",
    "Voisilab",
  ],
  authors: [{ name: "Voisilab" }],
  openGraph: {
    title: "Voisilab - Fablab Innovation & Fabrication Numérique",
    description: "Démocratiser la fabrication numérique pour tous depuis 2019",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/logolab.png", sizes: "32x32", type: "image/png" },
      { url: "/logolab.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/logolab.png",
    shortcut: "/logolab.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <LoadingProvider>
              <Navigation />
              <PageTransition>
                <PageWrapper>
                  <main>{children}</main>
                </PageWrapper>
              </PageTransition>
              <Footer />
              <Analytics />
            </LoadingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
