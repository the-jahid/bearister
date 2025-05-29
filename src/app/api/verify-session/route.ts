import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
})

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    let session
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items", "line_items.data.price"],
      })
    } catch (stripeError) {
      console.error("Stripe error:", stripeError)
      return NextResponse.json(
        {
          error: "Error retrieving session from Stripe",
          details: stripeError instanceof Error ? stripeError.message : "Unknown Stripe error",
        },
        { status: 500 },
      )
    }

    // Get the price ID from metadata first (most reliable)
    let priceId = session.metadata?.priceId || null
    const planType = session.metadata?.planType || null

    // If we couldn't get the price ID from metadata, try to get it from line items
    if (!priceId && session.line_items && session.line_items.data.length > 0) {
      const item = session.line_items.data[0]
      if (item.price && typeof item.price === "object" && item.price.id) {
        priceId = item.price.id
      }
    }

    console.log("Session verification:", {
      sessionId,
      priceId,
      planType,
      amount: session.amount_total,
      metadata: session.metadata,
    })

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      priceId: priceId,
      planType: planType,
    })
  } catch (error) {
    console.error("Error verifying session:", error)
    return NextResponse.json(
      {
        error: "Error verifying session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
