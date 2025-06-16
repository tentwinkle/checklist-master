
import { NextResponse } from 'next/server';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import type { User as AppUser, UserRole } from '@/types';

export const dynamic = 'force-dynamic';

async function getDbClient(): Promise<NeonQueryFunction<false, false>> {
  if (!process.env.DATABASE_URL) {
    console.error('[API /api/users/[userId]] DATABASE_URL environment variable is not set.');
    throw new Error('Server configuration error: DATABASE_URL not set.');
  }
  return neon(process.env.DATABASE_URL);
}

// GET /api/users/[userId] - Fetch a single user by Firebase UID
export async function GET(
  request: Request,
  { params }: { params: { userId: string } } // userId here is firebaseUid
) {
  const { userId: firebaseUid } = await params;

  if (!firebaseUid) {
    return NextResponse.json({ error: 'Invalid Firebase User ID provided.' }, { status: 400 });
  }

  try {
    const sql = await getDbClient();
    const result = await sql`
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
      WHERE "firebase_uid" = ${firebaseUid}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const dbUser = result[0];
    const user: AppUser = {
      id: dbUser.id,
      firebaseUid: dbUser.firebase_uid,
      username: dbUser.username,
      email: dbUser.email,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      phone: dbUser.phone,
      role: dbUser.role as UserRole,
      isActive: dbUser.is_active,
    };

    return NextResponse.json(user);

  } catch (error: any) {
    console.error(`[API /api/users/${firebaseUid} GET] Error fetching user:`, error);
    let errorMessage = 'Failed to fetch user.';
    let errorDetails = error.message || 'An unknown error occurred.';

    if (error.message?.toLowerCase().includes("fetch failed")) {
      errorMessage = 'Database Connection Error';
      errorDetails = 'Error connecting to database. Check DATABASE_URL and NeonDB status.';
    } else if (error.message?.toLowerCase().includes('relation "users" does not exist')) {
        errorMessage = 'Database Table Missing';
        errorDetails = "The 'users' table was not found. Ensure migrations have run.";
    } else if (error.message?.match(/column ".*" does not exist/i)) {
        errorMessage = 'Database Column Missing';
        errorDetails = `A required column was not found in the 'users' table. Original error: ${error.message}. Ensure schema matches.`;
    }
    
    return NextResponse.json({ error: errorMessage, details: errorDetails }, { status: 500 });
  }
}
