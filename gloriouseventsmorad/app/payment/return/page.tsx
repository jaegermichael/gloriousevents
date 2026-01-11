"use client"

import { useEffect, useState } from "react"

export default function PaymentReturnPage() {
  const [status, setStatus] = useState<"pending" | "completed" | "failed" | "unknown">("pending")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const reference = params.get("reference")

    if (!reference) {
      setStatus("unknown")
      return
    }

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/registrations/${reference}/payment-status`)
        if (!res.ok) return
        const data = await res.json()
        if (data.payment_status === "completed") {
          setStatus("completed")
        } else if (data.payment_status === "failed") {
          setStatus("failed")
        } else {
          setStatus("pending")
        }
      } catch (err) {
        console.error("Error checking payment status", err)
      }
    }

    checkStatus()
    const id = setInterval(checkStatus, 5000)
    return () => clearInterval(id)
  }, [])

  if (status === "unknown") {
    return <p className="container mx-auto px-4 py-16">Missing payment reference.</p>
  }

  if (status === "pending") {
    return <p className="container mx-auto px-4 py-16">Your payment is being confirmed. Please wait...</p>
  }

  if (status === "completed") {
    return <p className="container mx-auto px-4 py-16">Payment successful! Thank you for registering.</p>
  }

  return <p className="container mx-auto px-4 py-16">Payment failed or was cancelled. Please try again.</p>
}
