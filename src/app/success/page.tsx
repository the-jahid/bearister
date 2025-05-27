"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    if (sessionId) {
      // Verify the session with your backend
      fetch(`/api/verify-session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setSession(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error verifying session:", error)
          setLoading(false)
        })
    }
  }, [sessionId])

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

          <p className="text-gray-300 mb-8">
            Thank you for subscribing to BearisterAI. Your account has been activated and you can now access all the
            features of your plan.
          </p>

          <div className="space-y-4">
            <Link href="/dashboard">
              <Button className="w-full bg-gradient-to-r from-violet-500 to-orange-500 hover:from-violet-600 hover:to-orange-600 text-white">
                Go to Dashboard
              </Button>
            </Link>

            <Link href="/">
              <Button variant="outline" className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
