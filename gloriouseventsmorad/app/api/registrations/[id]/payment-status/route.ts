import { NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { data: registration, error } = await supabase
      .from("registrations")
      .select("payment_status, paynow_status")
      .eq("id", params.id)
      .single()

    if (error || !registration) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({
      payment_status: registration.payment_status,
      paynow_status: registration.paynow_status,
    })
  } catch (err) {
    console.error("Error fetching payment status:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
