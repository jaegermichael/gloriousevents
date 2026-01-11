import crypto from "crypto"
import querystring from "querystring"

const INTEGRATION_ID = process.env.PAYNOW_INTEGRATION_ID!
const INTEGRATION_KEY = process.env.PAYNOW_INTEGRATION_KEY!
const INIT_URL = process.env.PAYNOW_INIT_URL || "https://www.paynow.co.zw/interface/initiatetransaction"
const RETURN_URL_BASE = process.env.PAYNOW_RETURN_URL_BASE!
const RESULT_URL = process.env.PAYNOW_RESULT_URL!

export type PaynowInitParams = {
  reference: string
  amount: number
  email?: string
  additionalInfo?: string
}

export type PaynowInitResult = {
  browserUrl: string
  pollUrl: string
}

export function generateHash(fields: Record<string, string>, fieldOrder: string[]): string {
  const concatenated = fieldOrder.map((k) => fields[k] ?? "").join("") + INTEGRATION_KEY

  return crypto.createHash("sha512").update(concatenated, "utf8").digest("hex").toUpperCase()
}

export function parsePaynowResponse(body: string): Record<string, string> {
  const parsed = querystring.parse(body)
  const result: Record<string, string> = {}
  for (const [k, v] of Object.entries(parsed)) {
    result[k] = Array.isArray(v) ? (v[0] ?? "") : (v ?? "")
  }
  return result
}

export async function initiatePaynowPayment(params: PaynowInitParams): Promise<PaynowInitResult> {
  const { reference, amount, email, additionalInfo } = params

  const outboundFields: Record<string, string> = {
    id: INTEGRATION_ID,
    reference,
    amount: amount.toFixed(2),
    additionalinfo: additionalInfo || "",
    returnurl: `${RETURN_URL_BASE}?reference=${encodeURIComponent(reference)}`,
    resulturl: RESULT_URL,
    authemail: email || "",
    status: "Message",
  }

  const outboundOrder = [
    "id",
    "reference",
    "amount",
    "additionalinfo",
    "returnurl",
    "resulturl",
    "authemail",
    "status",
  ]

  const hash = generateHash(outboundFields, outboundOrder)

  const payload = { ...outboundFields, hash }

  const res = await fetch(INIT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: querystring.stringify(payload),
  })

  const text = await res.text()
  const data = parsePaynowResponse(text)

  if (data.Status !== "Ok") {
    throw new Error(data.Error || "PayNow initiate error")
  }

  const inboundFields: Record<string, string> = {
    Status: data.Status,
    BrowserUrl: data.BrowserUrl,
    PollUrl: data.PollUrl,
  }
  const inboundOrder = ["Status", "BrowserUrl", "PollUrl"]
  const expectedHash = generateHash(inboundFields, inboundOrder)

  if (!data.Hash || data.Hash.toUpperCase() !== expectedHash) {
    throw new Error("Invalid PayNow hash on initiate")
  }

  return {
    browserUrl: data.BrowserUrl,
    pollUrl: data.PollUrl,
  }
}

export async function pollPaynowStatus(pollUrl: string): Promise<{ rawStatus: string }> {
  const res = await fetch(pollUrl)
  const text = await res.text()
  const data = parsePaynowResponse(text)

  if (!data.Status) {
    throw new Error("Invalid PayNow poll response")
  }

  const inboundFields: Record<string, string> = { Status: data.Status }
  const inboundOrder = ["Status"]
  const expectedHash = generateHash(inboundFields, inboundOrder)

  if (!data.Hash || data.Hash.toUpperCase() !== expectedHash) {
    throw new Error("Invalid PayNow hash on poll")
  }

  return { rawStatus: data.Status }
}
