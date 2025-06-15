
import { NextResponse } from 'next/server';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import type { Client } from '@/types';

export const dynamic = 'force-dynamic';

async function getDbClient(): Promise<NeonQueryFunction<false, false>> {
  if (!process.env.DATABASE_URL) {
    console.error('[API /api/clients/[clientId]] DATABASE_URL environment variable is not set.');
    throw new Error('Server configuration error: DATABASE_URL not set.');
  }
  return neon(process.env.DATABASE_URL);
}

// GET /api/clients/[clientId] - Fetch a single client by ID
export async function GET(
  request: Request,
  { params }: { params: { clientId: string } }
) {
  const { clientId } = params;

  if (!clientId || isNaN(parseInt(clientId, 10))) {
    return NextResponse.json({ error: 'Invalid client ID provided.' }, { status: 400 });
  }

  const id = parseInt(clientId, 10);

  try {
    const sql = await getDbClient();
    const result = await sql`
      SELECT
        "id",
        "client_name",
        "email",
        "company_name",
        "phone",
        "created_at",
        "firebase_uid"
      FROM "clients"
      WHERE "id" = ${id}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
    }

    const dbClient = result[0];
    const client: Client = {
      id: dbClient.id,
      clientName: dbClient.client_name,
      email: dbClient.email,
      companyName: dbClient.company_name,
      phone: dbClient.phone,
      createdAt: new Date(dbClient.created_at).toISOString(),
      firebaseUid: dbClient.firebase_uid,
    };

    return NextResponse.json(client);

  } catch (error: any) {
    console.error(`[API /api/clients/${clientId} GET] Error fetching client:`, error);
    let errorMessage = 'Failed to fetch client.';
    let errorDetails = error.message || 'An unknown error occurred.';

    if (error.message?.toLowerCase().includes("fetch failed")) {
      errorMessage = 'Database Connection Error';
      errorDetails = 'Error connecting to database. Check DATABASE_URL and NeonDB status.';
    } else if (error.message?.toLowerCase().includes('relation "clients" does not exist')) {
        errorMessage = 'Database Table Missing';
        errorDetails = "The 'clients' table was not found. Ensure migrations have run.";
    } else if (error.message?.match(/column ".*" does not exist/i)) {
        errorMessage = 'Database Column Missing';
        errorDetails = `A required column was not found in the 'clients' table. Original error: ${error.message}. Ensure schema matches.`;
    }
    
    return NextResponse.json({ error: errorMessage, details: errorDetails }, { status: 500 });
  }
}
