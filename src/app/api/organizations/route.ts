import { NextResponse } from 'next/server';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import type { Organization } from '@/types';
import { getFirebaseAdminAuth } from '@/lib/firebase-admin';
import { sendInviteEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

async function getDbClient(): Promise<NeonQueryFunction<false, false>> {
  if (!process.env.DATABASE_URL) {
    console.error('[API /api/organizations] DATABASE_URL environment variable is not set.');
    throw new Error('Server configuration error: DATABASE_URL not set.');
  }
  return neon(process.env.DATABASE_URL);
}

// GET /api/organizations - fetch all organizations
export async function GET() {
  try {
    const sql = await getDbClient();
    const dbOrgs = await sql`
      SELECT id, name, is_active, created_at, updated_at
      FROM organizations
      ORDER BY name
    `;
    const orgs: Organization[] = dbOrgs.map((org: any) => ({
      id: org.id,
      name: org.name,
      isActive: org.is_active,
      createdAt: new Date(org.created_at).toISOString(),
      updatedAt: new Date(org.updated_at).toISOString(),
    }));
    return NextResponse.json(orgs);
  } catch (error: any) {
    console.error('[API /api/organizations GET] Error fetching organizations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organizations.', details: error.message },
      { status: 500 }
    );
  }
}

interface CreateOrgRequest {
  name: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
}

function generatePassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

// POST /api/organizations - create organization and first admin
export async function POST(request: Request) {
  try {
    const sql = await getDbClient();
    const body: CreateOrgRequest = await request.json();

    if (!body.name || !body.adminFirstName || !body.adminLastName || !body.adminEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orgResult = await sql`
      INSERT INTO organizations (name, is_active)
      VALUES (${body.name}, true)
      RETURNING id, name, is_active, created_at, updated_at
    `;
    if (orgResult.length === 0) {
      throw new Error('Organization creation failed');
    }
    const org = orgResult[0];

    const tempPassword = generatePassword();
    const adminAuth = getFirebaseAdminAuth();
    const userRecord = await adminAuth.createUser({
      email: body.adminEmail,
      password: tempPassword,
      displayName: `${body.adminFirstName} ${body.adminLastName}`,
    });

    const userResult = await sql`
      INSERT INTO users (firebase_uid, username, email, first_name, last_name, role, is_active, organization_id)
      VALUES (
        ${userRecord.uid},
        ${body.adminEmail.split('@')[0]},
        ${body.adminEmail},
        ${body.adminFirstName},
        ${body.adminLastName},
        'ADMIN',
        true,
        ${org.id}
      )
      RETURNING id
    `;

    await sendInviteEmail({
      to: body.adminEmail,
      firstName: body.adminFirstName,
      lastName: body.adminLastName,
      tempPassword,
    });

    const newOrg: Organization = {
      id: org.id,
      name: org.name,
      isActive: org.is_active,
      createdAt: new Date(org.created_at).toISOString(),
      updatedAt: new Date(org.updated_at).toISOString(),
    };

    return NextResponse.json({ organization: newOrg, adminUserId: userResult[0].id }, { status: 201 });
  } catch (error: any) {
    console.error('[API /api/organizations POST] Error creating organization:', error);
    return NextResponse.json(
      { error: 'Failed to create organization.', details: error.message },
      { status: 500 }
    );
  }
}
