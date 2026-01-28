"use client"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps, useTheme as useNextTheme } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme()

  const toggleTheme = () => {
    const currentTheme = theme === "system" ? systemTheme : theme
    setTheme(currentTheme === "dark" ? "light" : "dark")
  }

  return {
    theme: theme === "system" ? systemTheme : theme,
    setTheme,
    toggleTheme,
  }
}
