import { type NextRequest, NextResponse } from "next/server"

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || "http://localhost:8000/api"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const response = await fetch(`${LARAVEL_API_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
