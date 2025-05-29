/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"

interface SessionData {
  status: string
  customer_email: string
  amount_total: number
  priceId?: string
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [session, setSession] = useState<SessionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [updateDetails, setUpdateDetails] = useState<string>("")
  const { userId, isSignedIn, isLoaded } = useAuth()

  useEffect(() => {
    // Wait for auth to load before proceeding
    if (!isLoaded) return

    // If user is not signed in, redirect to sign in
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=" + encodeURIComponent(`/success?session_id=${sessionId}`))
      return
    }

    // Only proceed if we have both sessionId and userId
    if (sessionId && userId && isSignedIn) {
      verifyAndUpdatePlan()
    } else if (!sessionId) {
      setError("No payment session found")
      setLoading(false)
    } else if (isLoaded && !userId) {
      setError("User not authenticated")
      setLoading(false)
    }
  }, [sessionId, userId, isLoaded, isSignedIn, router])

  const verifyAndUpdatePlan = async () => {
    try {
      setLoading(true)

      // First verify the Stripe session
      console.log("Verifying Stripe session:", sessionId)
      const sessionResponse = await fetch(`/api/verify-session?session_id=${sessionId}`)

      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json()
        throw new Error(`Failed to verify session: ${errorData.error || sessionResponse.status}`)
      }

      const sessionData = await sessionResponse.json()
      console.log("Session data:", sessionData)
      setSession(sessionData)
      setLoading(false)

      // Then update the user's plan
      if (sessionData && userId) {
        await updateUserPlan(sessionData)
      }
    } catch (error) {
      console.error("Error in verification flow:", error)
      setError(`Failed to verify payment: ${error instanceof Error ? error.message : "Unknown error"}`)
      setLoading(false)
    }
  }

  const updateUserPlan = async (sessionData: SessionData) => {
    try {
      setUpdating(true)
      setUpdateDetails("Determining plan type...")

      // Get the plan type based on the price ID or amount
      const planType = getPlanTypeFromSession(sessionData)
      console.log("Determined plan type:", planType)
      setUpdateDetails(`Updating to ${planType} plan...`)

      // Call your API to update the user's plan
      const response = await fetch(`/api/update-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          planType,
          sessionId,
        }),
      })

      const responseData = await response.json()
      console.log("Update plan response:", responseData)

      if (!response.ok) {
        throw new Error(responseData.details || responseData.error || "Failed to update plan")
      }

      setSuccess(true)
      setUpdateDetails("Plan updated successfully!")
    } catch (error) {
      console.error("Error updating user plan:", error)
      setError(`Failed to update subscription: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setUpdating(false)
    }
  }

  const getPlanTypeFromSession = (sessionData: SessionData): string => {
    console.log("Getting plan type from session:", sessionData)

    // Map price IDs to plan types
    if (sessionData.priceId) {
      const priceMapping: Record<string, string> = {
        price_core: "CORE",
        price_advanced: "ADVANCED",
        price_pro: "PRO",
      }
      const planType = priceMapping[sessionData.priceId]
      if (planType) {
        console.log("Plan type from price ID:", planType)
        return planType
      }
    }

    // Fallback to amount-based mapping
    const amount = sessionData.amount_total || 0
    console.log("Using amount-based mapping for:", amount)

    if (amount >= 9900) return "PRO" // $99.00
    if (amount >= 4000) return "ADVANCED" // $40.00
    if (amount >= 2000) return "CORE" // $20.00
    return "BASIC"
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0C0C1C] to-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Loading...</h2>
          <p className="text-gray-400 mt-2">Please wait</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0C0C1C] to-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Verifying your payment...</h2>
          <p className="text-gray-400 mt-2">Please wait while we confirm your transaction</p>
        </div>
      </div>
    )
  }

  if (updating) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0C0C1C] to-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Updating your subscription...</h2>
          <p className="text-gray-400 mt-2">{updateDetails}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0C0C1C] to-black text-white flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="text-center">
            <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-500/30">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>

            <h1 className="text-4xl font-bold mb-4 text-red-400">Something went wrong</h1>

            <p className="text-gray-300 mb-8">{error}</p>

            <div className="space-y-4">
              <Link href="/dashboard">
                <Button className="w-full bg-gradient-to-r from-violet-500 to-orange-500 hover:from-violet-600 hover:to-orange-600 text-white">
                  Go to Dashboard
                </Button>
              </Link>

              <Link href="/pricing">
                <Button variant="outline" className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20">
                  Return to Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C0C1C] to-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-orange-400 bg-clip-text text-transparent">
            Payment Successful!
          </h1>

          <p className="text-gray-300 mb-4">
            Thank you for subscribing to BearisterAI. Your payment has been processed successfully.
          </p>

          {success && (
            <div className="mb-8 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
              <p className="text-green-400 font-medium">✓ Your subscription has been activated</p>
              <p className="text-green-300 text-sm mt-1">You can now access all features of your plan</p>
            </div>
          )}

          <div className="space-y-4">
            <Link href="/dashboard">
              <Button className="w-full bg-gradient-to-r from-violet-500 to-orange-500 hover:from-violet-600 hover:to-orange-600 text-white">
                Go to Dashboard
              </Button>
            </Link>

            <Link href="/pricing">
              <Button variant="outline" className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20">
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
