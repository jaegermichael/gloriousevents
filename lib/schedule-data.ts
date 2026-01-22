export type EventSession = {
  day: number
  dateShort: string
  dateFull: string
  title: string
  description: string
}

export const EVENT_SESSIONS: EventSession[] = [
  {
    day: 1,
    dateShort: "January 26",
    dateFull: "January 26, 2026",
    title: "Governance & Marketers Day",
    description:
      "Session 1 (8:30am–12:00pm): Official Opening with Government Officials & Policy Makers and AI Essentials – Understanding the Basics of Artificial Intelligence (FREE SESSION). Session 2 (1:00pm–4:30pm): AI and Marketing (digital, content creators, social media, product, brand, influencer marketing).",
  },
  {
    day: 2,
    dateShort: "January 27",
    dateFull: "January 27, 2026",
    title: "Values & Policy Day",
    description:
      "Session 1 (8:30am–12:00pm): Use of AI in faith-based organisations. Session 2 (1:00pm–4:30pm): NGOs, non-profit, quasi-government and other institutions.",
  },
  {
    day: 3,
    dateShort: "January 28",
    dateFull: "January 28, 2026",
    title: "Technology & Specialized Applications Day",
    description:
      "Session 1 (8:30am–12:00pm): ICT practitioners. Session 2 (1:00pm–4:30pm): Specialized sectors exploring real-world AI applications.",
  },
  {
    day: 4,
    dateShort: "January 29",
    dateFull: "January 29, 2026",
    title: "Business & Enterprise Innovation Day",
    description:
      "Session 1 (8:30am–12:00pm): CEOs and business leaders. Session 2 (1:00pm–4:30pm): Entrepreneurs and SMEs.",
  },
  {
    day: 5,
    dateShort: "January 30",
    dateFull: "January 30, 2026",
    title: "Education, Talent & the Future Workforce Day",
    description:
      "Session 1 (8:30am–12:00pm): Students (secondary, higher & tertiary). Session 2 (1:00pm–4:30pm): Educators (teachers, lecturers, instructors).",
  },
]
