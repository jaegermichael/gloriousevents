"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"

const faqs = [
  {
    question: "What is included in the ticket price?",
    answer:
      "Your ticket includes access to all talks and workshops on your assigned day(s), networking opportunities, teas and refreshments, and all event materials. Full week pass holders get access to all 5 days plus exclusive networking sessions.",
  },
  {
    question: "How do I know which day I should attend?",
    answer:
      "When you register and select your role (CEO, Developer, Student, etc.), you'll automatically be assigned to the most relevant day. CEOs and Executives attend Day 1 (Leadership), Developers attend Day 2 (Technical), and so on. Full week pass holders can attend all days.",
  },
  {
    question: "Can I change my assigned day after registration?",
    answer:
      "Yes! Contact us at info@gloriousevents.com with your registration ID, and we can adjust your day assignment or upgrade you to a full week pass.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Zimswitch, PayPal, and EcoCash. After registration, you'll receive a payment link via email. Once payment is confirmed, you'll receive your official ticket and receipt.",
  },
  {
    question: "Will physical tickets be available?",
    answer:
      "Yes! While we send digital tickets via email, physical tickets can be collected at the venue registration desk on the day of your session. Bring your email confirmation or registration ID.",
  },
  {
    question: "Is parking available at the venue?",
    answer: "Yes, free parking is available at Hillside Park in Harare for all attendees.",
  },
  {
    question: "Can I get a refund if I can't attend?",
    answer:
      "Refund requests must be made at least 7 days before the event start date. Contact info@gloriousevents.com with your registration details.",
  },
  {
    question: "Will sessions be recorded?",
    answer:
      "Yes, all main talks will be recorded and made available to registered attendees within 48 hours after each session.",
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about the event</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-semibold text-lg pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                  />
                </button>
                {openIndex === index && <div className="px-6 pb-5 text-muted-foreground">{faq.answer}</div>}
              </Card>
            ))}
          </div>

          <p className="text-center mt-8 text-muted-foreground">
            Still have questions?{" "}
            <a href="#feedback" className="text-primary font-semibold hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
