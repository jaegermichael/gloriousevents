import { NextResponse } from "next/server"

// For the static Webzim deployment we no longer support dynamic
// payment status polling via this API route. Mark it as static and
// return a simple placeholder response.
export const dynamic = "force-static"
export const dynamicParams = false

// No dynamic params are pre-generated for this route in the static export.
export function generateStaticParams() {
  return []
}

export async function GET() {
  return NextResponse.json({
    payment_status: "unknown",
    paynow_status: "unsupported_in_static_export",
  })
}
