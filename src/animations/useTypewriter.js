import { useEffect, useState } from 'react'
import { usePageTransition } from '../context/usePageTransition.js'

export default function useTypewriter(text, options = {}) {
  const { speed = 40, startDelay = 180, endHold = 700 } = options
  const { isPageReady, transitionKey } = usePageTransition()
  const prefersReducedMotion = typeof window !== 'undefined'
    && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)

  const isReady = isPageReady || prefersReducedMotion

  const [progress, setProgress] = useState(() => ({
    key: transitionKey,
    text,
    characters: prefersReducedMotion ? (text ? text.length : 0) : 0,
    isTyping: false,
  }))

  const visibleCharacters = (prefersReducedMotion || !text)
    ? (text ? text.length : 0)
    : (!isReady)
      ? 0
      : (progress.text === text && progress.key === transitionKey)
        ? progress.characters
        : 0

  const isTyping = (!prefersReducedMotion && Boolean(text) && isReady)
    ? (progress.text === text && progress.key === transitionKey && progress.isTyping)
    : false

  useEffect(() => {
    if (prefersReducedMotion || !text || !isPageReady) return undefined

    let characters = 0
    let stepTimer
    let endTimer

    const initTimer = window.setTimeout(() => {
      setProgress({
        key: transitionKey,
        text,
        characters: 0,
        isTyping: true,
      })
    }, 0)

    const typeNextCharacter = () => {
      characters += 1
      const done = characters >= text.length
      setProgress({
        key: transitionKey,
        text,
        characters,
        isTyping: true,
      })

      if (!done) {
        stepTimer = window.setTimeout(typeNextCharacter, speed)
      } else {
        endTimer = window.setTimeout(() => {
          setProgress((prev) => ({
            ...prev,
            isTyping: false,
          }))
        }, endHold)
      }
    }

    stepTimer = window.setTimeout(typeNextCharacter, startDelay)

    return () => {
      window.clearTimeout(initTimer)
      window.clearTimeout(stepTimer)
      window.clearTimeout(endTimer)
    }
  }, [text, isPageReady, transitionKey, prefersReducedMotion, speed, startDelay, endHold])

  return {
    visibleText: text ? text.slice(0, visibleCharacters) : '',
    isTyping,
  }
}
