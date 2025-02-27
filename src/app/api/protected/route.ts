import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession()
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Access token is available in session.accessToken
  return NextResponse.json({ message: "Success" })
} 