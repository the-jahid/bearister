"use client"

import { useEffect, useState } from "react"

interface TypingIndicatorProps {
  isVisible: boolean
}

export function TypingIndicator({ isVisible }: TypingIndicatorProps) {
  const [dots, setDots] = useState(".")

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "."
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="max-w-[90%] md:max-w-[80%] ml-auto">
      <div className="bg-orange-500 text-white rounded-2xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-base">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          </div>
          <span>BearisterAI is typing{dots}</span>
        </div>
      </div>
    </div>
  )
}
