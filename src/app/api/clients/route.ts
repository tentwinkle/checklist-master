
import { NextResponse } from 'next/server';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import type { Client } from '@/types';

export const dynamic = 'force-dynamic';

async function getDbClient(): Promise<NeonQueryFunction<false, false>> {
  if (!process.env.DATABASE_URL) {
    console.error('[API /api/clients] DATABASE_URL environment variable is not set.');
    throw new Error('Server configuration error: DATABASE_URL not set.');
  }
  return neon(process.env.DATABASE_URL);
}

// GET /api/clients - Fetch all clients
export async function GET() {
  try {
    const sql = await getDbClient();
    const dbClients = await sql`
      SELECT
        "id",
        "client_name",
        "email",
        "company_name",
        "phone",
        "created_at",
        "firebase_uid"
      FROM "clients"
      ORDER BY "client_name"
    `;

    const clients: Client[] = dbClients.map((client: any) => ({
      id: client.id,
      clientName: client.client_name,
      email: client.email,
      companyName: client.company_name,
      phone: client.phone,
      createdAt: new Date(client.created_at).toISOString(),
      firebaseUid: client.firebase_uid,
    }));

    return NextResponse.json(clients);

  } catch (error: any) {
    console.error('[API /api/clients GET] Error fetching clients:', error);
    let errorMessage = 'Failed to fetch clients.';
    let errorDetails = error.message || 'An unknown error occurred.';

     if (error.message?.toLowerCase().includes("fetch failed")) {
      errorMessage = 'Database Connection Error';
      errorDetails = 'Error connecting to database: fetch failed. Check DATABASE_URL, NeonDB status, and IP allow-lists.';
    } else if (error.message?.toLowerCase().includes('relation "clients" does not exist')) {
        errorMessage = 'Database Table Missing';
        errorDetails = "The required 'clients' table was not found. Ensure migrations have run. Original error: " + error.message;
    } else if (error.message?.match(/column ".*" does not exist/i)) {
        errorMessage = 'Database Column Missing';
        errorDetails = `A required column was not found in the 'clients' table. Original error: ${error.message}. Ensure schema matches.`;
    }
    return NextResponse.json({ error: errorMessage, details: errorDetails }, { status: 500 });
  }
}

// POST /api/clients - Create a new client
export async function POST(request: Request) {
  try {
    const sql = await getDbClient();
    const { 
        clientName, 
        email, 
        companyName, 
        phone,
        firebaseUid,
    } : Omit<Client, 'id' | 'createdAt'> & { firebaseUid: string } = await request.json();

    if (!clientName || !email || !companyName || !firebaseUid) {
      return NextResponse.json({ error: "Missing required fields: clientName, email, companyName, or firebaseUid." }, { status: 400 });
    }
    
    const result = await sql`
      INSERT INTO "clients" (
        "client_name", 
        "email", 
        "company_name", 
        "phone",
        "firebase_uid"
      )
      VALUES (
        ${clientName}, 
        ${email}, 
        ${companyName}, 
        ${phone || null},
        ${firebaseUid}
      )
      RETURNING "id", "client_name", "email", "company_name", "phone", "created_at", "firebase_uid"
    `;

    if (result.length === 0 || !result[0].id) {
      throw new Error('Client creation failed, no ID returned from database.');
    }

    const newDbClient = result[0];
    const newClient: Client = {
      id: newDbClient.id,
      clientName: newDbClient.client_name,
      email: newDbClient.email,
      companyName: newDbClient.company_name,
      phone: newDbClient.phone,
      createdAt: new Date(newDbClient.created_at).toISOString(),
      firebaseUid: newDbClient.firebase_uid,
    };

    return NextResponse.json(newClient, { status: 201 });

  } catch (error: any) {
    console.error('[API /api/clients POST] Error creating client:', error);
    let errorMessage = 'Failed to create client in database.';
    let errorDetails = error.message || 'An unknown error occurred.';

    if (error.message?.toLowerCase().includes("fetch failed")) {
      errorMessage = 'Database Connection Error';
      errorDetails = 'Error connecting to database during client creation. Check DATABASE_URL and NeonDB status.';
    } else if (error.message?.toLowerCase().includes('relation "clients" does not exist')) {
        errorMessage = 'Database Table Missing';
        errorDetails = "The required 'clients' table was not found. Ensure migrations have run. Original error: " + error.message;
    } else if (error.message?.toLowerCase().includes('unique constraint') && (error.message?.toLowerCase().includes('email') || error.message?.toLowerCase().includes('clients_email_key'))) {
        errorMessage = `Duplicate email`;
        errorDetails = `A client with this email already exists. Original error: ${error.message}`;
    } else if (error.message?.toLowerCase().includes('unique constraint') && (error.message?.toLowerCase().includes('firebase_uid') || error.message?.toLowerCase().includes('clients_firebase_uid_key'))) {
        errorMessage = `Duplicate Firebase UID`;
        errorDetails = `A client with this Firebase UID already exists. This should not happen if Firebase UIDs are unique. Original error: ${error.message}`;
    } else if (error.message?.match(/column ".*" does not exist/i)) {
        errorMessage = 'Database Column Missing';
        errorDetails = `A required column was not found in the 'clients' table during insert. Original error: ${error.message}. Ensure your database schema matches.`;
    } else if (error.message?.includes('violates not-null constraint') && error.message?.includes('company_name')) {
        errorMessage = 'Missing Company Name';
        errorDetails = `Company Name is a required field. Original error: ${error.message}`;
    }
    
    return NextResponse.json({ error: errorMessage, details: errorDetails }, { status: 500 });
  }
}
