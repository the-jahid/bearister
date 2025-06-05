import { type NextRequest, NextResponse } from "next/server"

interface UpdatePlanRequest {
  userId: string
  planType: string
  sessionId: string
}

export async function POST(req: NextRequest) {
  try {
    const { userId, planType, sessionId } = (await req.json()) as UpdatePlanRequest

    console.log("Update plan request:", { userId, planType, sessionId })

    if (!userId || !planType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate plan type
    const validPlanTypes = ["CORE", "ADVANCED", "PRO"]
    if (!validPlanTypes.includes(planType)) {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 })
    }

    console.log(`Updating user ${userId} to plan ${planType}`)

    // Update the user's plan using PATCH method to your backend
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
      let errorMessage = "Failed to update user plan"
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || errorMessage
        console.error("Backend API Error Response:", errorData)
      } catch (e) {
        errorMessage = `${errorMessage}: ${response.statusText}`
      }

      console.error("Error updating user plan:", response.status, errorMessage)
      return NextResponse.json(
        {
          error: errorMessage,
          details: `Backend server responded with ${response.status}`,
        },
        { status: 500 },
      )
    }

    let data
    try {
      data = await response.json()
      console.log("Backend response:", data)
    } catch (e) {
      // If we can't parse JSON but the request was successful
      data = { success: true, message: "Plan updated successfully" }
    }

    console.log("Successfully updated user plan:", data)

    return NextResponse.json({
      success: true,
      data,
      message: "Plan updated successfully",
    })
  } catch (error) {
    console.error("Error in update-plan route:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
