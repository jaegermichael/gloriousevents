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
import { createClient } from "@/lib/client"
import { getAssignedDay, roleOptions } from "@/lib/role-day-mapping"
import { Alert, AlertDescription } from "@/components/ui/alert"

const EVENT_DAYS = [
  { day: 1, date: "January 26, 2026" },
  { day: 2, date: "January 27, 2026" },
  { day: 3, date: "January 28, 2026" },
  { day: 4, date: "January 29, 2026" },
  { day: 5, date: "January 30, 2026" },
]

const SINGLE_DAY_PRICE = 50
const FULL_WEEK_PRICE = 300
const PER_DAY_PRICE = 50

const CASH_OFFICE_ADDRESS = "Your office address here"
const CASH_CONTACT_NUMBER = "Your office contact number here"
const CASH_PAYMENT_CLOSING_DATE = "Cash payments accepted until 20 January 2026"

function formatSelectedDays(days: number[]): string {
  const sorted = [...days].sort((a, b) => a - b)
  return sorted
    .map((day) => {
      const dayInfo = EVENT_DAYS.find((d) => d.day === day)
      return dayInfo ? `Day ${day} - ${dayInfo.date}` : `Day ${day}`
    })
    .join(", ")
}

export function SignUpSection() {
  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    companyEmail: "",
    companyPhone: "",
    role: "",
    roleOther: "",
  })
  const [ticketType, setTicketType] = useState<"single" | "full_week" | "custom_days">("single")
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [assignedDay, setAssignedDay] = useState<{ day: number; date: string; description: string } | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentLink, setPaymentLink] = useState<string>("")

  const ticketPrice =
    ticketType === "single"
      ? SINGLE_DAY_PRICE
      : ticketType === "full_week"
        ? FULL_WEEK_PRICE
        : selectedDays.length * PER_DAY_PRICE

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
      roleOther: value === "Other" ? prev.roleOther : "",
    }))
    const dayInfo = getAssignedDay(value)
    setAssignedDay(dayInfo)
  }

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

      const trimmedOtherRole = formData.roleOther?.trim() ?? ""
      const finalRole = formData.role === "Other" && trimmedOtherRole ? trimmedOtherRole : formData.role

      if (!finalRole) {
        throw new Error("Please select your role")
      }

      let assignedDayValue = 1
      let assignedDateValue = ""

      if (ticketType === "single") {
        const dayInfo = getAssignedDay(finalRole)
        setAssignedDay(dayInfo)
        assignedDayValue = dayInfo.day
        assignedDateValue = dayInfo.date
      } else if (ticketType === "full_week") {
        assignedDayValue = 0
        assignedDateValue = "Full week (Days 1–5)"
      } else {
        if (selectedDays.length === 0) {
          throw new Error("Please select at least one day")
        }
        const summary = formatSelectedDays(selectedDays)
        assignedDayValue = 0
        assignedDateValue = summary
      }

      const displayName = formData.title ? `${formData.title} ${formData.fullName}` : formData.fullName

      const supabase = createClient()

      let organizationCombined = formData.organization
      if (formData.companyEmail || formData.companyPhone) {
        const parts: string[] = []
        if (formData.organization) parts.push(formData.organization)
        if (formData.companyEmail) parts.push(`Email: ${formData.companyEmail}`)
        if (formData.companyPhone) parts.push(`Phone: ${formData.companyPhone}`)
        organizationCombined = parts.join(" | ")
      }

      const registrationData = {
        full_name: displayName,
        email: formData.email,
        phone: formData.phone,
        organization: organizationCombined,
        role: finalRole,
        assigned_day: assignedDayValue,
        assigned_date: assignedDateValue,
        ticket_type: ticketType,
        ticket_price: ticketPrice,
        payment_status: "pending",
        payment_method: paymentMethod,
      }

      const { data, error: insertError } = await supabase
        .from("registrations")
        .insert(registrationData)
        .select()
        .single()

      if (insertError) throw insertError

      if (paymentMethod === "cash") {
        setIsSubmitted(true)
        return
      }

      const response = await fetch("/api/paynow/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: data.id }),
      })

      const paynowData = await response.json()

      if (!response.ok) {
        throw new Error(paynowData.error || "Failed to start PayNow payment")
      }

      window.location.href = paynowData.browserUrl
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
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

                  {ticketType === "single" && assignedDay && (
                    <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                      <Calendar className="w-5 h-5" />
                      <span>You're registered for: {assignedDay.date}</span>
                    </div>
                  )}

                  {ticketType === "full_week" && (
                    <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                      <Calendar className="w-5 h-5" />
                      <span>You're registered for all 5 days (26–30 January 2026).</span>
                    </div>
                  )}

                  {ticketType === "custom_days" && selectedDays.length > 0 && (
                    <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                      <Calendar className="w-5 h-5" />
                      <span>You're registered for: {formatSelectedDays(selectedDays)}</span>
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
                      const v = value as "single" | "full_week" | "custom_days"
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
                            <p className="text-2xl font-bold text-primary">$50</p>
                            <p className="text-xs text-muted-foreground">per session</p>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-accent transition-colors cursor-pointer">
                      <RadioGroupItem value="full_week" id="full_week" />
                      <Label htmlFor="full_week" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Full Week Pass</p>
                            <p className="text-sm text-muted-foreground">Access to all 5 days + networking</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-accent">${FULL_WEEK_PRICE}</p>
                            <p className="text-xs text-muted-foreground">full week</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-accent transition-colors cursor-pointer">
                      <RadioGroupItem value="custom_days" id="custom_days" />
                      <Label htmlFor="custom_days" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Custom Days</p>
                            <p className="text-sm text-muted-foreground">Choose one or more days</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">${PER_DAY_PRICE}</p>
                            <p className="text-xs text-muted-foreground">per day</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {ticketType === "custom_days" && (
                    <div className="mt-4 space-y-3">
                      <p className="text-sm font-semibold">Select your days</p>
                      <div className="grid md:grid-cols-3 gap-3">
                        {EVENT_DAYS.map((day) => (
                          <label
                            key={day.day}
                            className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:border-accent transition-colors cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedDays.includes(day.day)}
                              onChange={() => toggleDay(day.day)}
                              className="h-4 w-4"
                            />
                            <span className="text-sm">
                              Day {day.day} - {day.date}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Teas and refreshments supplied at all sessions</span>
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
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="role" className="text-base font-semibold">
                    Your Role *
                  </Label>
                  <Select value={formData.role} onValueChange={handleRoleChange} required>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.role === "Other" && (
                  <div className="space-y-2">
                    <Label htmlFor="roleOther" className="text-base font-semibold">
                      Please specify your role
                    </Label>
                    <Input
                      id="roleOther"
                      name="roleOther"
                      placeholder="Enter your role"
                      value={formData.roleOther}
                      onChange={handleChange}
                      className="h-12 text-base"
                    />
                  </div>
                )}

                {assignedDay && ticketType === "single" && (
                  <Alert className="bg-primary/5 border-primary/20">
                    <Calendar className="h-4 w-4" />
                    <AlertDescription>
                      <span className="font-semibold">Based on your role, you'll attend:</span>
                      <br />
                      Day {assignedDay.day} - {assignedDay.date}
                      <br />
                      <span className="text-sm text-muted-foreground">{assignedDay.description}</span>
                    </AlertDescription>
                  </Alert>
                )}

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
