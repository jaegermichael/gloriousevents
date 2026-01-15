import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { ExhibitorSponsorButtons } from "@/components/exhibitor-sponsor-buttons"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <span className="text-sm font-semibold text-primary">Glorious Events 2026</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            Unlock the Future of <span className="text-primary">AI</span> in{" "}
            <span className="text-accent">Harare!</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Join us for the ARTIFICIAL INTELLIGENCE (AI) TALKSHOW WEEK WITH ALEXANDER MORAD. Theme: Shaping the
            Future Through Responsible & Inclusive Artificial Intelligence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 text-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-semibold">26–30 January 2026</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2 text-foreground">
              <MapPin className="w-5 h-5 text-accent" />
              <span className="font-semibold">Hillside Park, Harare</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base group"
            >
              <Link href="#signup">
                Sign Up Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base border-primary/20 hover:bg-primary/5 bg-transparent"
            >
              <Link href="#about">Learn More</Link>
            </Button>
          </div>
          <ExhibitorSponsorButtons />
        </div>
      </div>
    </section>
  )
}
