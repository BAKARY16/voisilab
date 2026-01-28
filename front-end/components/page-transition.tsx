"use client"

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Zap } from "lucide-react"
import { useLoading } from "@/contexts/loading-context"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isLoading } = useLoading()

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-xl"
          >
            <div className="relative">
              {/* Fond dégradé animé */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 w-40 h-40 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-3xl -z-10"
              />

              {/* Logo central avec rotation */}
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="relative z-10 w-24 h-24 rounded-4xl flex items-center justify-center shadow-2xl overflow-hidden"
              >
                <img
                  src="/uvci.jpg"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Spinner orbital rapide */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-32 h-32 border-4 border-transparent border-t-[#a306a1] border-r-green-600 rounded-full" />
              </motion.div>

              {/* Points orbitaux pulsants */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-36 h-36">
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute top-0 left-1/2 w-2 h-2 bg-[#a306a1] rounded-full -translate-x-1/2 shadow-lg shadow-[#a306a1]/50"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                    className="absolute bottom-0 left-1/2 w-2 h-2 bg-green-600 rounded-full -translate-x-1/2 shadow-lg shadow-green-600/50"
                  />
                </div>
              </motion.div>

              {/* Texte de chargement */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-base font-bold">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="text-[#a306a1]" size={20} />
                    </motion.div>
                    <span className="bg-gradient-to-r from-[#a306a1] to-green-600 bg-clip-text text-transparent">
                      Voisilab
                    </span>
                  </div>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xs text-muted-foreground"
                  >
                    Chargement de la page...
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transition de la page */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </>
  )
}