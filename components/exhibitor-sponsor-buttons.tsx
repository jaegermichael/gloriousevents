"use client"

import { useState, type MouseEvent } from "react"
import { Button } from "@/components/ui/button"
import { Handshake, MessageCircle, Store, X } from "lucide-react"

type Mode = "exhibitor" | "sponsor" | null

export function ExhibitorSponsorButtons() {
  const [mode, setMode] = useState<Mode>(null)

  const isOpen = mode !== null

  const handleOpen = (newMode: Mode) => {
    setMode(newMode)
  }

  const handleClose = () => {
    setMode(null)
  }

  const handleContentClick = (event: MouseEvent<HTMLDivElement>) => {
    // Prevent clicks inside the modal from closing it
    event.stopPropagation()
  }

  const handleWhatsApp = () => {
    const base = "https://wa.me/263779467179"
    const text =
      mode === "sponsor"
        ? "Hi, I\'m interested in sponsorship opportunities for the AI Talkshow Week."
        : "Hi, I\'m interested in exhibition opportunities for the AI Talkshow Week."
    const url = `${base}?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
        <Button
          variant="outline"
          className="border-accent/60 text-accent hover:bg-accent/10"
          onClick={() => handleOpen("exhibitor")}
        >
          <Store className="w-4 h-4 mr-2" />
          Exhibitors
        </Button>
        <Button
          variant="outline"
          className="border-primary/60 text-primary hover:bg-primary/10"
          onClick={() => handleOpen("sponsor")}
        >
          <Handshake className="w-4 h-4 mr-2" />
          Sponsors
        </Button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="relative mx-4 max-w-2xl w-full rounded-3xl border border-white/10 bg-gradient-to-br from-primary/80 via-accent/70 to-background text-background shadow-2xl p-[1px] max-h-[90vh] overflow-y-auto"
            onClick={handleContentClick}
          >
            <div className="rounded-3xl bg-gradient-to-br from-background via-background/95 to-background p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary/70 mb-1">Partners & Visibility</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {mode === "sponsor" ? "Sponsorship Opportunities" : "Exhibition Packages"}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                    Showcase your brand at the Artificial Intelligence (AI) Talkshow Week with Alexander Morad through
                    tailored exhibition or sponsorship packages that match your visibility goals.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="rounded-full bg-background/60 hover:bg-background/90 border border-border/50"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="mb-6">
                {mode === "exhibitor" && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-primary">Exhibition Packages</h3>
                    <div className="rounded-2xl bg-gradient-to-br from-primary to-purple-700 text-white border border-primary/40 shadow-lg p-4 space-y-3">
                      <div>
                        <p className="font-semibold">Bronze Package</p>
                        <p className="text-sm text-white/90">
                          One (1) exhibition table, two (2) chairs, and basic branding.
                        </p>
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                      <div>
                        <p className="font-semibold">Silver Package</p>
                        <p className="text-sm text-white/90">
                          Two (2) exhibition tables, four (4) chairs, premium branding, plus one (1) speaking slot.
                        </p>
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                      <div>
                        <p className="font-semibold">Gold Package</p>
                        <p className="text-sm text-white/90">
                          Four (4) exhibition tables, six (6) chairs, top-tier branding, plus two (2) speaking slots.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {mode === "sponsor" && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-accent">Sponsorship Opportunities</h3>
                    <div className="rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-300 to-yellow-500 text-slate-900 border border-amber-400 shadow-lg p-4 space-y-3">
                      <div>
                        <p className="font-semibold">Title Sponsor</p>
                        <p className="text-sm text-slate-900/80">
                          Exclusive event branding, two (2) speaking slots, and VIP access.
                        </p>
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                      <div>
                        <p className="font-semibold">Platinum Sponsor</p>
                        <p className="text-sm text-slate-900/80">
                          Prominent branding, one (1) speaking slot, and VIP access.
                        </p>
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                      <div>
                        <p className="font-semibold">Session Sponsor</p>
                        <p className="text-sm text-slate-900/80">
                          Branding and visibility within a dedicated session.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-xs md:text-sm text-muted-foreground max-w-md">
                  Packages can be tailored to your organisation\'s visibility goals. Share your objectives with us and we\'ll
                  recommend the best fit.
                </p>
                <Button
                  onClick={handleWhatsApp}
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white hover:bg-[#1DA955] shadow-lg px-6"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-semibold">Chat with us on WhatsApp</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
