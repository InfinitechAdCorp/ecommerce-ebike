import { type NextRequest, NextResponse } from "next/server"

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || "http://localhost:8000/api"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(`${LARAVEL_API_URL}/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
