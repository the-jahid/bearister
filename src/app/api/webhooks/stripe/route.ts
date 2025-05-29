import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("Received Stripe webhook:", event.type)

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      console.log("Checkout session completed:", session.id)

      // Get the customer's user ID from the session metadata or customer details
      const userId = session.client_reference_id || session.metadata?.userId

      if (!userId) {
        console.error("No user ID found in session")
        return NextResponse.json({ error: "No user ID found" }, { status: 400 })
      }

      // Determine plan type from the session
      const planType = await getPlanTypeFromStripeSession(session)

      if (!planType) {
        console.error("Could not determine plan type from session")
        return NextResponse.json({ error: "Could not determine plan type" }, { status: 400 })
      }

      // Update user's plan in your backend
      try {
        const response = await fetch(`https://bearister-server.onrender.com/api/v1/users/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            planType: planType,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("Failed to update user plan via webhook:", response.status, errorData)
        } else {
          const data = await response.json()
          console.log("Successfully updated user plan via webhook:", data)
        }
      } catch (error) {
        console.error("Error updating user plan via webhook:", error)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}

async function getPlanTypeFromStripeSession(session: Stripe.Checkout.Session): Promise<string | null> {
  try {
    // Get line items to determine the plan
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price"],
    })

    if (lineItems.data.length === 0) {
      return null
    }

    const price = lineItems.data[0].price
    if (!price || typeof price === "string") {
      return null
    }

    // Map price amounts to plan types
    const amount = price.unit_amount || 0

    if (amount >= 9900) return "PRO" // $99.00
    if (amount >= 4000) return "ADVANCED" // $40.00
    if (amount >= 2000) return "CORE" // $20.00

    return null
  } catch (error) {
    console.error("Error getting plan type from session:", error)
    return null
  }
}
