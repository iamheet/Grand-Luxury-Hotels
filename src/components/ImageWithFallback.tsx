import { useState } from 'react'

type Props = {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
}

export default function ImageWithFallback({ src, alt, className, fallbackSrc }: Props) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const fallbacks = [
    fallbackSrc,
    'https://placehold.co/1600x900/png?text=Image+Unavailable',
    'https://placehold.co/1200x800/png?text=Image+Unavailable',
  ].filter(Boolean) as string[]
  let fallbackIndex = 0

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      onError={() => {
        const next = fallbacks[fallbackIndex] || fallbacks[fallbacks.length - 1]
        if (currentSrc !== next) setCurrentSrc(next)
        fallbackIndex = Math.min(fallbackIndex + 1, fallbacks.length - 1)
      }}
    />
  )
}


