"use client"

import { useEffect } from "react"

export function PageViewTracker() {
  useEffect(() => {
    // Track page view on mount
    const trackView = async () => {
      try {
        await fetch("/api/track-view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pagePath: window.location.pathname,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
          }),
        })
      } catch (error) {
        console.error("[v0] Error tracking page view:", error)
      }
    }

    trackView()
  }, [])

  return null
}
