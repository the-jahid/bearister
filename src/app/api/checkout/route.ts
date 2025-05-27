import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
})

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json()

    // Create price mapping for your products
    const priceMapping: Record<string, { price: number; name: string }> = {
      price_starter: { price: 2000, name: "Starter Plan" }, // $20.00 in cents
      price_professional: { price: 4000, name: "Professional Plan" }, // $40.00 in cents
      price_enterprise: { price: 9900, name: "Enterprise Plan" }, // $99.00 in cents
    }

    const product = priceMapping[priceId]
    if (!product) {
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 })
    }

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
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
      metadata: {
        priceId,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Stripe error:", error)
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 })
  }
}
