import { Card } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { EVENT_SESSIONS } from "@/lib/schedule-data"

export function ScheduleSection() {
  return (
    <section id="schedule" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
              Schedule <span className="text-primary">Overview</span>
            </h2>
            <p className="text-lg text-muted-foreground">26–30 January 2026</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="rounded-lg border bg-background/60 px-4 py-3">
                <div className="font-semibold text-foreground">Session 1</div>
                <div>8:30am – 12:00pm</div>
              </div>
              <div className="rounded-lg border bg-background/60 px-4 py-3">
                <div className="font-semibold text-foreground">Session 2</div>
                <div>1:00pm – 4:30pm</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {EVENT_SESSIONS.map((item) => {
              const [session1Raw, session2Raw] = item.description.split("Session 2")
              const session1Text = session1Raw.trim()
              const session2Text = session2Raw ? `Session 2${session2Raw}`.trim() : ""

              return (
                <Card
                  key={item.day}
                  className="p-6 hover:shadow-lg transition-all hover:border-primary/30 cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0 md:w-32">
                      <div className="flex items-center gap-2 text-primary">
                        <Calendar className="w-5 h-5" />
                        <div>
                          <div className="font-bold text-sm">Day {item.day}</div>
                          <div className="text-xs text-muted-foreground">{item.dateShort}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                      <div className="space-y-3">
                        <p className="text-muted-foreground">{session1Text}</p>
                        {session2Text && (
                          <div className="border-t border-border/40 pt-3 mt-1">
                            <p className="text-muted-foreground">{session2Text}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
