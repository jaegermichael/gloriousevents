"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LiveChatButton() {
  const handleChatClick = () => {
    // This opens WhatsApp chat - replace with your actual WhatsApp number
    window.open("https://wa.me/263772849505?text=Hi, I have a question about Glorious Events 2026", "_blank")
  }

  return (
    <Button
      onClick={handleChatClick}
      size="lg"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-110 transition-all z-50 md:h-auto md:w-auto md:rounded-lg md:px-6"
      aria-label="Live chat"
    >
      <MessageCircle className="h-6 w-6 md:mr-2" />
      <span className="hidden md:inline font-semibold">Live Chat</span>
    </Button>
  )
}
