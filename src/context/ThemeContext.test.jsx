import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeProvider } from './ThemeContext.jsx'
import { useTheme } from './useTheme.js'

function ThemeProbe() {
  const { theme, toggleTheme } = useTheme()
  return <button type="button" onClick={toggleTheme}>{theme}</button>
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('toggles and persists the selected theme', () => {
    render(<ThemeProvider><ThemeProbe /></ThemeProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'dark' }))
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(localStorage.getItem('bothra-theme')).toBe('light')
  })
})
