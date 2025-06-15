import { type NextRequest, NextResponse } from "next/server"
import { sendInviteEmail } from "@/lib/mailer"

interface InviteUserRequest {
  email: string
  firstName: string
  lastName: string
  role: "ADMIN" | "INSPECTOR" | "USER"
  organizationId: number
  departmentId?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: InviteUserRequest = await request.json()

    // Validate required fields
    if (!body.email || !body.firstName || !body.lastName || !body.role || !body.organizationId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate temporary password
    const tempPassword = generateTemporaryPassword()

    // Create user in database (mock implementation)
    const newUser = {
      id: Date.now(), // Mock ID
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      role: body.role,
      organizationId: body.organizationId,
      departmentId: body.departmentId,
      isActive: true,
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
    }

    // Send invitation email
    await sendInviteEmail({
      to: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      tempPassword,
      subject: "Welcome to Region Holbæk Inspection System",
    })

    return NextResponse.json({
      success: true,
      user: newUser,
      message: "User invited successfully. Invitation email sent.",
    })
  } catch (error) {
    console.error("Error inviting user:", error)
    return NextResponse.json({ error: "Failed to invite user" }, { status: 500 })
  }
}

function generateTemporaryPassword(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

