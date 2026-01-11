import { NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function POST(request: Request) {
  try {
    const { pagePath, userAgent, referrer } = await request.json()
    const supabase = await createClient()

    const { error } = await supabase.from("page_views").insert({
      page_path: pagePath,
      user_agent: userAgent,
      referrer: referrer,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error tracking page view:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
