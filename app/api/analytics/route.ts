import { NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get total registrations
    const { count: totalRegistrations } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })

    // Get paid registrations
    const { count: paidRegistrations } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "completed")

    // Get pending payments
    const { count: pendingPayments } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "pending")

    // Get total page views
    const { count: totalViews } = await supabase.from("page_views").select("*", { count: "exact", head: true })

    // Get registrations by day
    const { data: registrationsByDay } = await supabase.from("registrations").select("assigned_day")

    const dayBreakdown = registrationsByDay?.reduce((acc: Record<number, number>, reg) => {
      acc[reg.assigned_day] = (acc[reg.assigned_day] || 0) + 1
      return acc
    }, {})

    // Get total revenue
    const { data: revenueData } = await supabase
      .from("registrations")
      .select("ticket_price")
      .eq("payment_status", "completed")

    const totalRevenue = revenueData?.reduce((sum, reg) => sum + Number(reg.ticket_price), 0) || 0

    return NextResponse.json({
      totalRegistrations: totalRegistrations || 0,
      paidRegistrations: paidRegistrations || 0,
      pendingPayments: pendingPayments || 0,
      totalViews: totalViews || 0,
      dayBreakdown: dayBreakdown || {},
      totalRevenue,
    })
  } catch (error) {
    console.error("[v0] Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
