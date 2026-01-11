import { Card } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export function ScheduleSection() {
  const schedule = [
    {
      day: "Day 1",
      date: "January 26",
      title: "Opening keynote + AI fundamentals",
      description: "Kick off with Alexander Morad's opening keynote and dive into AI basics",
    },
    {
      day: "Day 2",
      date: "January 27",
      title: "AI in business & entrepreneurship",
      description: "Explore how AI is revolutionizing business strategies and startup ecosystems",
    },
    {
      day: "Day 3",
      date: "January 28",
      title: "Creative applications of AI",
      description: "Discover AI in art, design, content creation, and creative industries",
    },
    {
      day: "Day 4",
      date: "January 29",
      title: "Interactive workshops & case studies",
      description: "Get hands-on experience with real-world AI applications and tools",
    },
    {
      day: "Day 5",
      date: "January 30",
      title: "Closing panel + networking session",
      description: "Wrap up with expert discussions and connect with fellow attendees",
    },
  ]

  return (
    <section id="schedule" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
              Schedule <span className="text-primary">Overview</span>
            </h2>
            <p className="text-lg text-muted-foreground">26–30 January 2026</p>
          </div>

          <div className="space-y-4">
            {schedule.map((item, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all hover:border-primary/30 cursor-pointer">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-shrink-0 md:w-32">
                    <div className="flex items-center gap-2 text-primary">
                      <Calendar className="w-5 h-5" />
                      <div>
                        <div className="font-bold text-sm">{item.day}</div>
                        <div className="text-xs text-muted-foreground">{item.date}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
