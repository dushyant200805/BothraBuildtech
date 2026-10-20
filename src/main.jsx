import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import 'aos/dist/aos.css'
import 'lenis/dist/lenis.css'
import './styles/variables.css'
import './styles/global.css'
import './styles/custom.css'
import './styles/animations.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
