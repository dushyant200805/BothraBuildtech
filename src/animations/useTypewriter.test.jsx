import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PageTransitionContext from '../context/pageTransitionContext.js'
import useTypewriter from './useTypewriter.js'

function TestComponent({ text, options }) {
  const { visibleText, isTyping } = useTypewriter(text, options)
  return (
    <div>
      <span data-testid="text">{visibleText}</span>
      <span data-testid="typing">{isTyping ? 'yes' : 'no'}</span>
    </div>
  )
}

describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('types character-by-character after the start delay', () => {
    render(<TestComponent text="BUILDING" options={{ speed: 40, startDelay: 100, endHold: 300 }} />)

    // Initially at t=0
    expect(screen.getByTestId('text')).toHaveTextContent('')

    // Before startDelay
    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(screen.getByTestId('text')).toHaveTextContent('')
    expect(screen.getByTestId('typing')).toHaveTextContent('yes')

    // At startDelay, first character typed
    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(screen.getByTestId('text')).toHaveTextContent('B')

    // Next character
    act(() => {
      vi.advanceTimersByTime(40)
    })
    expect(screen.getByTestId('text')).toHaveTextContent('BU')

    // Advance through the remaining characters (6 chars * 40ms = 240ms)
    act(() => {
      vi.advanceTimersByTime(240)
    })
    expect(screen.getByTestId('text')).toHaveTextContent('BUILDING')
    // Cursor should still be typing during endHold
    expect(screen.getByTestId('typing')).toHaveTextContent('yes')

    // After endHold (300ms)
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(screen.getByTestId('typing')).toHaveTextContent('no')
  })

  it('waits while page transition or load is in progress and triggers when ready', () => {
    let contextValue = {
      isPageReady: false,
      isTransitioning: true,
      isInitialLoading: false,
      transitionKey: 0,
      setInitialLoading: () => {},
      startTransition: () => {},
      completeTransition: () => {},
    }

    const { rerender } = render(
      <PageTransitionContext.Provider value={contextValue}>
        <TestComponent text="PROJECTS" options={{ speed: 30, startDelay: 50, endHold: 100 }} />
      </PageTransitionContext.Provider>
    )

    // While transitioning, text is empty and not typing
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(screen.getByTestId('text')).toHaveTextContent('')
    expect(screen.getByTestId('typing')).toHaveTextContent('no')

    // Page transition completes!
    contextValue = {
      ...contextValue,
      isPageReady: true,
      isTransitioning: false,
      transitionKey: 1,
    }

    rerender(
      <PageTransitionContext.Provider value={contextValue}>
        <TestComponent text="PROJECTS" options={{ speed: 30, startDelay: 50, endHold: 100 }} />
      </PageTransitionContext.Provider>
    )

    // After transition completes, waits startDelay then types
    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(screen.getByTestId('text')).toHaveTextContent('P')

    // Types out full word
    act(() => {
      vi.advanceTimersByTime(30 * 7)
    })
    expect(screen.getByTestId('text')).toHaveTextContent('PROJECTS')
  })

  it('re-triggers typing when route transition finishes even with the same text', () => {
    let contextValue = {
      isPageReady: true,
      isTransitioning: false,
      isInitialLoading: false,
      transitionKey: 1,
      setInitialLoading: () => {},
      startTransition: () => {},
      completeTransition: () => {},
    }

    const { rerender } = render(
      <PageTransitionContext.Provider value={contextValue}>
        <TestComponent text="HOME" options={{ speed: 20, startDelay: 50, endHold: 100 }} />
      </PageTransitionContext.Provider>
    )

    // Type completely
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(screen.getByTestId('text')).toHaveTextContent('HOME')

    // User navigates away and back, transition completes with key 2
    contextValue = {
      ...contextValue,
      transitionKey: 2,
    }

    rerender(
      <PageTransitionContext.Provider value={contextValue}>
        <TestComponent text="HOME" options={{ speed: 20, startDelay: 50, endHold: 100 }} />
      </PageTransitionContext.Provider>
    )

    // It resets and types again!
    expect(screen.getByTestId('text')).toHaveTextContent('')
    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(screen.getByTestId('text')).toHaveTextContent('H')
  })
})
