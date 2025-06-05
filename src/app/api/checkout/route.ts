import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
})

export async function POST(req: NextRequest) {
  try {
    console.log("Checkout API called")

    const body = await req.json()
    const { priceId } = body

    console.log("Received priceId:", priceId)

    // Create price mapping for your products
    const priceMapping: Record<string, { price: number; name: string; planType: string }> = {
      price_core: { price: 2000, name: "Core Plan", planType: "CORE" }, // $20.00 in cents
      price_advanced: { price: 4000, name: "Advanced Plan", planType: "ADVANCED" }, // $40.00 in cents
      price_pro: { price: 9900, name: "Pro Plan", planType: "PRO" }, // $99.00 in cents
    }

    const product = priceMapping[priceId]
    if (!product) {
      console.error("Invalid price ID:", priceId)
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 })
    }

    console.log("Creating Stripe session for product:", product)

    // Get the origin from headers with fallback
    const origin =
      req.headers.get("origin") ||
      req.headers.get("referer")?.split("/").slice(0, 3).join("/") ||
      "https://your-domain.com"

    console.log("Using origin:", origin)

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: `Monthly subscription to ${product.name}`,
            },
            unit_amount: product.price,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        priceId,
        planType: product.planType,
      },
      // Add mobile-friendly settings
      billing_address_collection: "auto",
      phone_number_collection: {
        enabled: false,
      },
    })

    console.log("Stripe session created:", session.id)

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Stripe error:", error)
    return NextResponse.json(
      {
        error: "Error creating checkout session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
