import { NextResponse } from "next/server"

// Mark this route as static so it doesn't block `output: 'export'`
export const dynamic = "force-static"

// Static placeholder analytics response for static deployments.
// In the Webzim static build, this endpoint is not actively used.
export async function GET() {
  return NextResponse.json({
    totalRegistrations: 0,
    paidRegistrations: 0,
    pendingPayments: 0,
    totalViews: 0,
    dayBreakdown: {},
    totalRevenue: 0,
  })
}
