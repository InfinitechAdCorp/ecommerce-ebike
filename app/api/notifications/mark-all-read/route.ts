import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "No authorization header" }, { status: 401 })
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

    const response = await fetch(`${apiUrl}/notifications/mark-all-read`, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Mark all as read API error:", error)
    return NextResponse.json({ success: false, message: "Failed to mark all as read" }, { status: 500 })
  }
}
