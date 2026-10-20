import { useContext } from 'react'
import PageTransitionContext from './pageTransitionContext.js'

export function usePageTransition() {
  return useContext(PageTransitionContext)
}

export default usePageTransition
