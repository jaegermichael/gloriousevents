import { Card } from "@/components/ui/card"
import { Lightbulb, Users, Workflow, TrendingUp } from "lucide-react"

export function AboutSection() {
  const highlights = [
    {
      icon: Lightbulb,
      title: "Daily Talkshows",
      description: "Led by Alexander Morad, featuring cutting-edge AI insights and industry trends",
    },
    {
      icon: Workflow,
      title: "Hands-on Workshops",
      description: "Explore AI tools and applications with practical, interactive sessions",
    },
    {
      icon: Users,
      title: "Networking Opportunities",
      description: "Connect with industry leaders, peers, and like-minded innovators",
    },
    {
      icon: TrendingUp,
      title: "Future Insights",
      description: "Discover how AI is shaping industries and transforming the world",
    },
  ]

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
              About the <span className="text-primary">Event</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
              Step into the world of Artificial Intelligence with Alexander Morad, a globally recognized thought leader
              and innovator. Over five days, you'll experience interactive workshops, inspiring talks, and practical
              sessions designed to help you harness the power of AI in business, technology, and everyday life.
            </p>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Event <span className="text-accent">Highlights</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {highlights.map((highlight, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-primary/10">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <highlight.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">{highlight.title}</h4>
                      <p className="text-muted-foreground">{highlight.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
                  AM
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Alexander Morad</h3>
                <p className="text-primary font-semibold mb-3">AI Thought Leader & Innovation Expert</p>
                <p className="text-muted-foreground leading-relaxed">
                  Alexander Morad is a globally recognized authority in artificial intelligence and digital
                  transformation. With over 15 years of experience spanning tech startups, Fortune 500 companies, and
                  international organizations, he has helped countless businesses harness the power of AI. His unique
                  approach combines technical expertise with real-world business applications, making AI accessible to
                  professionals at all levels.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
