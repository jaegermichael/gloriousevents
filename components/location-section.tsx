import { Card } from "@/components/ui/card"
import { MapPin, Navigation, Accessibility } from "lucide-react"
import { Button } from "@/components/ui/button"

const GOOGLE_MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps?q=No.+1+Hillside+Park,+Corner+Chiremba+Road+%26+Brooke%27s+Drive,+Hillside,+Harare,+Zimbabwe"
const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps?q=No.+1+Hillside+Park,+Corner+Chiremba+Road+%26+Brooke%27s+Drive,+Hillside,+Harare,+Zimbabwe&output=embed"

export function LocationSection() {
  return (
    <section id="location" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
              Event <span className="text-primary">Location</span>
            </h2>
          </div>

          <Card className="overflow-hidden border-primary/10">
            <div className="grid md:grid-cols-2">
              <div className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-start gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Venue</h3>
                    <p className="text-foreground font-semibold">No. 1 Hillside Park</p>
                    <p className="text-muted-foreground">Corner Chiremba Road & Brooke's Drive</p>
                    <p className="text-muted-foreground">Hillside, Harare, Zimbabwe</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Navigation className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Getting There</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Ample parking available on-site</li>
                        <li>• Accessible by public transport</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Accessibility className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Accessibility</p>
                      <p className="text-sm text-muted-foreground">Wheelchair accessible venue</p>
                    </div>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <a
                    href={GOOGLE_MAPS_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
                </Button>
              </div>

              <div className="h-64 md:h-auto bg-muted relative">
                <iframe
                  src={GOOGLE_MAPS_EMBED_URL}
                  title="Map to No. 1 Hillside Park, Hillside, Harare"
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
