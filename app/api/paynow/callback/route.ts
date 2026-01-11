import { NextResponse } from "next/server"
import { createClient } from "@/lib/server"
import { parsePaynowResponse, generateHash, pollPaynowStatus } from "@/lib/paynow"

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const data = parsePaynowResponse(rawBody)

    if (!data.Hash) {
      return new NextResponse("Missing hash", { status: 400 })
    }

    const inboundFields: Record<string, string> = {}
    for (const [key, value] of Object.entries(data)) {
      if (key.toLowerCase() !== "hash") {
        inboundFields[key] = value
      }
    }

    const inboundOrder = Object.keys(inboundFields)
    const expectedHash = generateHash(inboundFields, inboundOrder)

    if (data.Hash.toUpperCase() !== expectedHash) {
      console.warn("Invalid PayNow callback hash")
      return new NextResponse("Invalid hash", { status: 400 })
    }

    const reference = data.reference || data.Reference
    if (!reference) {
      return new NextResponse("Missing reference", { status: 400 })
    }

    const supabase = await createClient()

    const { data: registration, error } = await supabase
      .from("registrations")
      .select("id, paynow_poll_url, payment_status")
      .eq("id", reference)
      .single()

    if (error || !registration) {
      console.warn("Unknown registration reference from PayNow:", reference)
      return new NextResponse("OK", { status: 200 })
    }

    if (!registration.paynow_poll_url) {
      console.warn("Missing paynow_poll_url for registration:", reference)
      return new NextResponse("OK", { status: 200 })
    }

    const { rawStatus } = await pollPaynowStatus(registration.paynow_poll_url)

    let paymentStatus = registration.payment_status || "pending"
    if (["Paid", "Delivered", "AwaitingDelivery"].includes(rawStatus)) {
      paymentStatus = "completed"
    } else if (["Cancelled", "Failed"].includes(rawStatus)) {
      paymentStatus = "failed"
    }

    const { error: updateError } = await supabase
      .from("registrations")
      .update({
        payment_status: paymentStatus,
        paynow_status: rawStatus,
      })
      .eq("id", registration.id)

    if (updateError) {
      console.error("Error updating registration payment status:", updateError)
    }

    return new NextResponse("OK", { status: 200 })
  } catch (err) {
    console.error("PayNow callback error:", err)
    return new NextResponse("Error", { status: 500 })
  }
}
