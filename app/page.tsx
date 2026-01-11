import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ScheduleSection } from "@/components/schedule-section"
import { SignUpSection } from "@/components/signup-section"
import { LocationSection } from "@/components/location-section"
import { FaqSection } from "@/components/faq-section"
import { FeedbackSection } from "@/components/feedback-section"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LiveChatButton } from "@/components/live-chat-button"
import { PageViewTracker } from "@/components/page-view-tracker"

export default function Home() {
  return (
    <main className="min-h-screen">
      <PageViewTracker />
      <Header />
      <HeroSection />
      <SignUpSection />
      <AboutSection />
      <ScheduleSection />
      <FaqSection />
      <LocationSection />
      <FeedbackSection />
      <Footer />
      <LiveChatButton />
    </main>
  )
}
