import { createContext } from 'react'

const defaultContext = {
  isPageReady: true,
  isTransitioning: false,
  isInitialLoading: false,
  transitionKey: 0,
  setInitialLoading: () => {},
  startTransition: () => {},
  completeTransition: () => {},
}

const PageTransitionContext = createContext(defaultContext)

export default PageTransitionContext
