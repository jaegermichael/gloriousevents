"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle2, Calendar, DollarSign, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EVENT_SESSIONS } from "@/lib/schedule-data"

const PHYSICAL_SESSION_PRICE = 50
const ONLINE_SESSION_PRICE = 35

const GOOGLE_SHEET_WEBHOOK_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL

const CASH_OFFICE_ADDRESS = "Your office address here"
const CASH_CONTACT_NUMBER = "+263 78 156 5612"
const CASH_PAYMENT_CLOSING_DATE = "Cash payments accepted until 20 January 2026"

function formatSelectedDays(days: number[]): string {
  const sorted = [...days].sort((a, b) => a - b)
  return sorted
    .map((day) => {
      const session = EVENT_SESSIONS.find((s) => s.day === day)
      return session
        ? `Day ${session.day} - ${session.dateFull} - ${session.title}`
        : `Day ${day}`
    })
    .join(", ")
}

export function SignUpSection() {
  const [formData, setFormData] = useState({
    title: "",
    customTitle: "",
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    companyEmail: "",
    companyPhone: "",
  })
  const [ticketType, setTicketType] = useState<"single" | "custom_days">("single")
  const [attendanceType, setAttendanceType] = useState<"physical" | "online">("physical")
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentLink, setPaymentLink] = useState<string>("")

  const perSessionPrice = attendanceType === "physical" ? PHYSICAL_SESSION_PRICE : ONLINE_SESSION_PRICE
  const ticketPrice = ticketType === "single" ? perSessionPrice : selectedDays.length * perSessionPrice

  const toggleDay = (day: number) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!paymentMethod) {
        throw new Error("Please select a payment method")
      }

      let assignedDayValue = 1
      let assignedDateValue = ""
      const attendanceLabel = attendanceType === "online" ? "Online" : "Physical"

      if (ticketType === "single") {
        assignedDayValue = 0
        assignedDateValue = `${attendanceLabel} - Single Day Pass`
      } else {
        if (selectedDays.length === 0) {
          throw new Error("Please select at least one session")
        }
        const summary = formatSelectedDays(selectedDays)
        assignedDayValue = 0
        assignedDateValue = `${attendanceLabel} - ${summary}`
      }

      const resolvedTitle =
        formData.title === "Other" ? (formData.customTitle ? formData.customTitle : "") : formData.title
      const displayName = resolvedTitle ? `${resolvedTitle} ${formData.fullName}` : formData.fullName
      let organizationCombined = formData.organization
      if (formData.companyEmail || formData.companyPhone) {
        const parts: string[] = []
        if (formData.organization) parts.push(formData.organization)
        if (formData.companyEmail) parts.push(`Email: ${formData.companyEmail}`)
        if (formData.companyPhone) parts.push(`Phone: ${formData.companyPhone}`)
        organizationCombined = parts.join(" | ")
      }

      // Optionally send basic registration details to Google Sheets via Apps Script webhook (fire-and-forget)
      if (GOOGLE_SHEET_WEBHOOK_URL) {
        fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: resolvedTitle,
            fullName: displayName,
            email: formData.email,
            phone: formData.phone,
            organization: organizationCombined,
            attendanceType,
            ticketType,
            selectedDays,
            assignedDate: assignedDateValue,
            ticketPrice,
            paymentMethod,
          }),
        }).catch((googleError) => {
          console.error("Failed to send data to Google Sheets", googleError)
        })
      }

      const sessionsSummary =
        ticketType === "single" ? `${attendanceLabel} - Single Day Pass` : formatSelectedDays(selectedDays)

      const whatsappMessage =
        `New AI Talkshow registration:\n\n` +
        `Name: ${displayName}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n` +
        `Organization: ${organizationCombined || "N/A"}\n` +
        `Attendance: ${attendanceLabel}\n` +
        `Ticket type: ${ticketType === "single" ? "Single Day Pass" : "Selected Sessions"}\n` +
        `Sessions: ${sessionsSummary}\n` +
        `Payment method: ${paymentMethod}\n` +
        `Total: $${ticketPrice}`

      const whatsappNumber = "263781565612"
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

      // Show success state locally, then redirect in the same tab so browsers don't block it as a popup
      setIsSubmitted(true)
      window.location.href = whatsappUrl

      return
    } catch (err: unknown) {
      let message = err instanceof Error ? err.message : "Registration failed. Please try again."

      if (typeof message === "string" && message.includes("@supabase/ssr")) {
        message = "Registration failed. Please try again or contact us on WhatsApp."
      }

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="signup" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
              Reserve Your <span className="text-primary">Spot</span> Today!
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Join hundreds of innovators at Harare's premier AI event
            </p>
          </div>

          <Card className="p-8 md:p-12 bg-card border-2 border-primary/10 shadow-2xl">
            {isSubmitted ? (
              <div className="text-center py-8 space-y-6">
                <CheckCircle2 className="w-16 h-16 text-accent mx-auto" />
                <h3 className="text-2xl font-bold text-foreground">Registration Successful!</h3>
                <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Your registration has been recorded. Use the payment details below to complete your booking.
                  </p>

                  {ticketType === "single" && (
                    <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                      <Calendar className="w-5 h-5" />
                      <span>
                        You're registered for: {attendanceType === "online" ? "Online - Single Day Pass" : "Physical - Single Day Pass"}
                      </span>
                    </div>
                  )}

                  {ticketType === "custom_days" && selectedDays.length > 0 && (
                    <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                      <Calendar className="w-5 h-5" />
                      <span>
                        You're registered for: {attendanceType === "online" ? "Online - " : "Physical - "}
                        {formatSelectedDays(selectedDays)}
                      </span>
                    </div>
                  )}

                  {paymentLink && (
                    <div className="space-y-2">
                      <p className="font-semibold">Complete Your Payment:</p>
                      <a href={paymentLink} target="_blank" rel="noopener noreferrer" className="inline-block">
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                          Proceed to Payment (${ticketPrice})
                        </Button>
                      </a>
                      {paymentMethod === "ecocash" && (
                        <p className="text-sm text-muted-foreground">Dial: {paymentLink}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-accent/10 p-6 rounded-lg border-2 border-accent/20">
                  <h3 className="text-xl font-bold mb-4">Select Your Ticket</h3>
                  <RadioGroup
                    value={ticketType}
                    onValueChange={(value) => {
                      const v = value as "single" | "custom_days"
                      setTicketType(v)
                      if (v !== "custom_days") {
                        setSelectedDays([])
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-accent transition-colors cursor-pointer">
                      <RadioGroupItem value="single" id="single" />
                      <Label htmlFor="single" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Single Day Pass</p>
                            <p className="text-sm text-muted-foreground">Access to one assigned day</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">${perSessionPrice}</p>
                            <p className="text-xs text-muted-foreground">per session</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-accent transition-colors cursor-pointer">
                      <RadioGroupItem value="custom_days" id="custom_days" />
                      <Label htmlFor="custom_days" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Select Sessions</p>
                            <p className="text-sm text-muted-foreground">Choose one or more sessions</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">${perSessionPrice}</p>
                            <p className="text-xs text-muted-foreground">per session</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-semibold">How will you attend?</p>
                    <RadioGroup
                      value={attendanceType}
                      onValueChange={(value) => setAttendanceType(value as "physical" | "online")}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      <div className="flex items-center space-x-3 p-3 border-2 rounded-lg hover:border-accent transition-colors cursor-pointer">
                        <RadioGroupItem value="physical" id="physical" />
                        <Label htmlFor="physical" className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">Physical (on-site)</p>
                              <p className="text-xs text-muted-foreground">${PHYSICAL_SESSION_PRICE} per session</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border-2 rounded-lg hover:border-accent transition-colors cursor-pointer">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online" className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">Online (virtual)</p>
                              <p className="text-xs text-muted-foreground">${ONLINE_SESSION_PRICE} per session</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground">
                      Physical attendance: ${PHYSICAL_SESSION_PRICE} per session. Online attendance: ${ONLINE_SESSION_PRICE} per
                      session.
                    </p>
                  </div>

                  {ticketType === "custom_days" && (
                    <div className="mt-4 space-y-3">
                      <p className="text-sm font-semibold">Select your sessions</p>
                      <div className="grid md:grid-cols-3 gap-3">
                        {EVENT_SESSIONS.map((session) => (
                          <label
                            key={session.day}
                            className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:border-accent transition-colors cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedDays.includes(session.day)}
                              onChange={() => toggleDay(session.day)}
                              className="h-4 w-4"
                            />
                            <span className="text-sm">
                              Day {session.day} - {session.dateFull} - {session.title}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>For physical attendees, teas and refreshments are supplied at all sessions.</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-semibold">
                    Title
                  </Label>
                  <Select
                    value={formData.title}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: value,
                      }))
                    }
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select your title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr.">Mr.</SelectItem>
                      <SelectItem value="Mrs.">Mrs.</SelectItem>
                      <SelectItem value="Miss">Miss</SelectItem>
                      <SelectItem value="Hon.">Hon.</SelectItem>
                      <SelectItem value="Dr">Dr</SelectItem>
                      <SelectItem value="Prof">Prof</SelectItem>
                      <SelectItem value="Eng">Eng</SelectItem>
                      <SelectItem value="Other">Other (please specify)</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.title === "Other" && (
                    <div className="mt-2">
                      <Input
                        id="customTitle"
                        name="customTitle"
                        placeholder="e.g. Pastor, Teacher, Head, Bishop"
                        value={formData.customTitle}
                        onChange={handleChange}
                        className="h-12 text-base"
                      />
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-base font-semibold">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-semibold">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-semibold">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+263 7XX XXX XXX"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization" className="text-base font-semibold">
                      Organization / Company (optional)
                    </Label>
                    <Input
                      id="organization"
                      name="organization"
                      placeholder="Company name"
                      value={formData.organization}
                      onChange={handleChange}
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail" className="text-base font-semibold">
                      Company Email (optional)
                    </Label>
                    <Input
                      id="companyEmail"
                      name="companyEmail"
                      type="email"
                      placeholder="company@example.com"
                      value={formData.companyEmail}
                      onChange={handleChange}
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyPhone" className="text-base font-semibold">
                      Company Phone (optional)
                    </Label>
                    <Input
                      id="companyPhone"
                      name="companyPhone"
                      type="tel"
                      placeholder="Company contact number"
                      value={formData.companyPhone}
                      onChange={handleChange}
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold">Payment Method *</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:border-primary transition-colors">
                        <RadioGroupItem value="zimswitch" id="zimswitch" />
                        <Label htmlFor="zimswitch" className="cursor-pointer font-medium">
                          Zimswitch
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:border-primary transition-colors">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="cursor-pointer font-medium">
                          PayPal
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:border-primary transition-colors">
                        <RadioGroupItem value="ecocash" id="ecocash" />
                        <Label htmlFor="ecocash" className="cursor-pointer font-medium">
                          EcoCash
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:border-primary transition-colors">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="cursor-pointer font-medium">
                          Cash
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === "cash" && (
                  <Alert className="bg-primary/5 border-primary/20">
                    <AlertDescription>
                      <p className="font-semibold">Cash Payment Details</p>
                      <p className="text-sm">Office address: {CASH_OFFICE_ADDRESS}</p>
                      <p className="text-sm">Contact number: {CASH_CONTACT_NUMBER}</p>
                      <p className="text-sm text-muted-foreground">
                        Cash payment closing date: {CASH_PAYMENT_CLOSING_DATE}
                      </p>
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full h-14 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? "Processing..." : `Complete Registration ($${ticketPrice})`}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  By registering, you agree to receive event updates and payment confirmation
                </p>
              </form>
            )}
          </Card>
        </div>
      </div>
    </section>
  )
}
