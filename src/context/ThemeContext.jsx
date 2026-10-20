import { useEffect, useMemo, useState } from 'react'
import ThemeContext from './themeContext.js'

function getInitialTheme() {
  const storedTheme = localStorage.getItem('bothra-theme')
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('bothra-theme', theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#071421' : '#ffffff')
    }
  }, [theme])

  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme((current) => current === 'light' ? 'dark' : 'light'),
  }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
