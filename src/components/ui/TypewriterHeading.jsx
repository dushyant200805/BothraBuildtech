import { isValidElement } from 'react'
import useTypewriter from '../../animations/useTypewriter.js'

function getTextContent(content) {
  if (typeof content === 'string' || typeof content === 'number') return String(content)
  if (Array.isArray(content)) return content.map(getTextContent).join('')
  if (!isValidElement(content)) return ''
  if (content.type === 'br') return '\n'
  return getTextContent(content.props.children)
}

export default function TypewriterHeading({ title, className = '' }) {
  const text = getTextContent(title)
  const { visibleText, isTyping } = useTypewriter(text)

  return <h1 className={`typewriter-heading ${className}`.trim()} aria-label={text.replaceAll('\n', ' ')}>
    <span className="typewriter-heading__reserve" aria-hidden="true">{title}</span>
    <span className="typewriter-heading__output" aria-hidden="true">{visibleText}{isTyping && <span className="typewriter-cursor" />}</span>
  </h1>
}
