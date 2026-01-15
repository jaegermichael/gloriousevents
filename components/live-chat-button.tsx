"use client"

import { Facebook, Instagram, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LiveChatButton() {
  const handleChatClick = () => {
    // This opens WhatsApp chat - replace with your actual WhatsApp number
    window.open(
      "https://wa.me/263779467179?text=Hi,%20I%20have%20a%20question%20about%20Glorious%20Events%202026",
      "_blank",
    )
  }

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
      <div className="flex flex-col gap-2">
        <Button
          asChild
          size="icon"
          className="h-12 w-12 rounded-full shadow-2xl bg-[#25D366] text-white hover:bg-[#1DA955] hover:scale-110 transition-all"
          aria-label="WhatsApp"
        >
          <a
            href="https://wa.me/263779467179?text=Hi,%20I%20have%20a%20question%20about%20Glorious%20Events%202026"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
        </Button>

        <Button
          asChild
          size="icon"
          className="h-12 w-12 rounded-full shadow-2xl bg-[#1877F2] text-white hover:bg-[#145DB4] hover:scale-110 transition-all"
          aria-label="Facebook"
        >
          <a
            href="https://www.facebook.com/profile.php?id=61586289458424"
            target="_blank"
            rel="noreferrer"
          >
            <Facebook className="h-5 w-5" />
          </a>
        </Button>

        <Button
          asChild
          size="icon"
          className="h-12 w-12 rounded-full shadow-2xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:opacity-90 hover:scale-110 transition-all"
          aria-label="Instagram"
        >
          <a
            href="https://www.instagram.com/gloriousevents2026?igsh=Y2J6bDdwbTluMzdp"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram className="h-5 w-5" />
          </a>
        </Button>
      </div>

      <Button
        onClick={handleChatClick}
        size="lg"
        className="h-14 w-14 rounded-full shadow-2xl bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-110 transition-all md:h-auto md:w-auto md:rounded-lg md:px-6"
        aria-label="Live chat"
      >
        <MessageCircle className="h-6 w-6 md:mr-2" />
        <span className="hidden md:inline font-semibold">Live Chat</span>
      </Button>
    </div>
  )
}
