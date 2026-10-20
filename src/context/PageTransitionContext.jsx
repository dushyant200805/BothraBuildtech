import { useCallback, useMemo, useState } from 'react'
import PageTransitionContext from './pageTransitionContext.js'

export function PageTransitionProvider({ children }) {
  const [isInitialLoading, setIsInitialLoading] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionKey, setTransitionKey] = useState(0)

  const setInitialLoading = useCallback((loading) => {
    setIsInitialLoading(loading)
    if (!loading) {
      setTransitionKey((prev) => prev + 1)
    }
  }, [])

  const startTransition = useCallback(() => {
    setIsTransitioning(true)
  }, [])

  const completeTransition = useCallback(() => {
    setIsTransitioning(false)
    setTransitionKey((prev) => prev + 1)
  }, [])

  const isPageReady = !isInitialLoading && !isTransitioning

  const value = useMemo(() => ({
    isPageReady,
    isTransitioning,
    isInitialLoading,
    transitionKey,
    setInitialLoading,
    startTransition,
    completeTransition,
  }), [isPageReady, isTransitioning, isInitialLoading, transitionKey, setInitialLoading, startTransition, completeTransition])

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
    </PageTransitionContext.Provider>
  )
}

export default PageTransitionProvider
