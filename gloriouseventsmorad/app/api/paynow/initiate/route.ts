import { NextResponse } from "next/server"
import { createClient } from "@/lib/server"
import { initiatePaynowPayment } from "@/lib/paynow"

export async function POST(request: Request) {
  try {
    const { registrationId } = (await request.json()) as { registrationId?: string | number }

    if (!registrationId) {
      return NextResponse.json({ error: "registrationId is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: registration, error } = await supabase
      .from("registrations")
      .select("id, email, ticket_price, payment_status")
      .eq("id", registrationId)
      .single()

    if (error || !registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    if (registration.payment_status === "completed") {
      return NextResponse.json({ error: "Registration already paid" }, { status: 400 })
    }

    const amount = Number(registration.ticket_price)
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid ticket amount" }, { status: 400 })
    }

    const { browserUrl, pollUrl } = await initiatePaynowPayment({
      reference: String(registration.id),
      amount,
      email: registration.email ?? undefined,
      additionalInfo: `Glorious Events registration #${registration.id}`,
    })

    const { error: updateError } = await supabase
      .from("registrations")
      .update({
        paynow_poll_url: pollUrl,
        paynow_status: "awaiting_payment",
      })
      .eq("id", registration.id)

    if (updateError) {
      console.error("Error saving PayNow pollUrl:", updateError)
    }

    return NextResponse.json({ browserUrl })
  } catch (err: unknown) {
    console.error("PayNow initiate error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
