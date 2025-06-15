import { type NextRequest, NextResponse } from "next/server"

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
    await sendInvitationEmail({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      tempPassword,
      role: body.role,
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

async function sendInvitationEmail({
  email,
  firstName,
  lastName,
  tempPassword,
  role,
}: {
  email: string
  firstName: string
  lastName: string
  tempPassword: string
  role: string
}) {
  // Mock email sending - in real implementation, use a service like SendGrid, AWS SES, etc.
  console.log("Sending invitation email to:", email)
  console.log("Email content:", {
    to: email,
    subject: "Welcome to Region Holbæk Inspection System",
    body: `
      Dear ${firstName} ${lastName},

      You have been invited to join the Region Holbæk Inspection System as a ${role}.

      Your login credentials:
      Email: ${email}
      Temporary Password: ${tempPassword}

      Please log in at: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login

      You will be required to change your password on first login.

      Best regards,
      Region Holbæk IT Team
    `,
  })

  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return true
}
