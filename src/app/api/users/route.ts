// src/app/api/users/route.ts
import { NextResponse } from "next/server"
import { neon, type NeonQueryFunction } from "@neondatabase/serverless"
import type { User as AppUser, UserRole } from "@/types"

export const dynamic = "force-dynamic"

async function getDbClient(): Promise<NeonQueryFunction<false, false>> {
  if (!process.env.DATABASE_URL) {
    console.error("[API /api/users] DATABASE_URL environment variable is not set.")
    throw new Error("Server configuration error: DATABASE_URL not set.")
  }
  try {
    const sql = neon(process.env.DATABASE_URL)
    return sql
  } catch (error: any) {
    console.error("[API /api/users] Failed to connect to NeonDB:", error)
    let errorMessage = `Failed to connect to the database. Ensure your DATABASE_URL is correctly set and NeonDB is accessible. Original error: ${error.message}`
    if (error.message && error.message.toLowerCase().includes("fetch failed")) {
      errorMessage = `Failed to connect to the database. This could be due to an incorrect DATABASE_URL, NeonDB instance being paused, or IP allow-list restrictions. Please verify these settings. Original error: ${error.message}`
    }
    throw new Error(errorMessage)
  }
}

export async function GET() {
  try {
    const sql = await getDbClient()

    // Query users table - handle both old and new schema
    const dbUsers = await sql`
     SELECT
       "id",
       "firebase_uid",
       "username",
       "email",
       "first_name",
       "last_name",
       "phone",
       "role",
       "is_active"
     FROM "users"
     ORDER BY "first_name", "last_name"
   `

    const appUsers: AppUser[] = dbUsers.map((user: any) => ({
      id: user.id,
      firebaseUid: user.firebase_uid,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role as UserRole,
      isActive: user.is_active,
    }))

    return NextResponse.json(appUsers)
  } catch (error: any) {
    console.error("[API /api/users GET] Error fetching users:", error)
    let errorMessage = "Failed to fetch users."
    let errorDetails = error.message || "An unknown error occurred."

    if (error.message?.toLowerCase().includes("fetch failed")) {
      errorMessage = "Database Connection Error"
      errorDetails =
        "Error connecting to database: fetch failed. Check DATABASE_URL, NeonDB status (is it paused?), and IP allow-lists in Neon project settings."
    } else if (error.message?.toLowerCase().includes('relation "users" does not exist')) {
      errorMessage = "Database Table Missing"
      errorDetails =
        "The required 'users' table was not found in the database. Ensure migrations (npx prisma migrate dev) have run. Original error: " +
        error.message
    } else if (error.message?.match(/column ".*" does not exist/i)) {
      errorMessage = "Database Column Missing"
      errorDetails = `A required column was not found in the 'users' table. Original error: ${error.message}. Ensure your database schema matches the application's expectations. Run migrations if needed.`
    }

    return NextResponse.json({ error: errorMessage, details: errorDetails }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sql = await getDbClient()
    const userData: Omit<AppUser, "id"> & { firebaseUid: string } = await request.json()

    if (
      !userData.firebaseUid ||
      !userData.email ||
      !userData.role ||
      !userData.username ||
      !userData.firstName ||
      !userData.lastName
    ) {
      return NextResponse.json(
        { error: "Missing required user data: firebaseUid, username, email, firstName, lastName, or role." },
        { status: 400 },
      )
    }

    const result = await sql`
     INSERT INTO "users" (
       "firebase_uid",
       "username",
       "email",
       "first_name",
       "last_name",
       "phone",
       "role",
       "is_active"
     ) VALUES (
       ${userData.firebaseUid},
       ${userData.username},
       ${userData.email},
       ${userData.firstName},
       ${userData.lastName},
       ${userData.phone || null},
       ${userData.role},
       ${userData.isActive !== undefined ? userData.isActive : true}
     )
     RETURNING "id", "firebase_uid"
   `

    if (result.length === 0 || !result[0].id) {
      throw new Error("User creation failed, no ID returned from database.")
    }

    return NextResponse.json(
      { message: "User profile stored successfully", userId: result[0].id, firebaseUid: result[0].firebase_uid },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[API /api/users POST] Error creating user:", error)
    let errorMessage = "Failed to create user in database."
    let errorDetails = error.message || "An unknown error occurred."

    if (error.message?.toLowerCase().includes("fetch failed")) {
      errorMessage = "Database Connection Error"
      errorDetails =
        "Error connecting to database during user creation: fetch failed. Check DATABASE_URL and NeonDB status."
    } else if (error.message?.toLowerCase().includes('relation "users" does not exist')) {
      errorMessage = "Database Table Missing"
      errorDetails =
        "The required 'users' table was not found in the database. Ensure migrations (npx prisma migrate dev) have run. Original error: " +
        error.message
    } else if (error.message?.match(/column ".*" does not exist/i)) {
      errorMessage = "Database Column Missing"
      errorDetails = `A required column was not found in the 'users' table during insert. Original error: ${error.message}. Ensure your database schema matches the application's expectations. Run migrations if needed.`
    } else if (
      error.message?.toLowerCase().includes("unique constraint") ||
      error.message?.toLowerCase().includes("duplicate key")
    ) {
      errorMessage = "Duplicate Entry"
      let field = "identifier"
      if (error.message?.includes("users_username_key") || error.message?.includes("users_username_unique"))
        field = "username"
      if (error.message?.includes("users_email_key") || error.message?.includes("users_email_unique")) field = "email"
      if (error.message?.includes("users_firebase_uid_key") || error.message?.includes("users_firebase_uid_unique"))
        field = "Firebase UID"
      errorDetails = `Failed to create user: a user with the same ${field} might already exist. Original error: ${error.message}`
    }

    return NextResponse.json({ error: errorMessage, details: errorDetails }, { status: 500 })
  }
}
