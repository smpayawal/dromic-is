import { NextRequest, NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';
import { hashPassword } from '@/lib/utils/password';
import { generateToken } from '@/lib/utils/jwt';
import { registerSchema } from '@/lib/utils/validation';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  const client = await getClient();
  
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM account WHERE email = $1 OR username = $2',
      [validatedData.email, validatedData.username]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      );
    }

    // Get user level ID from position
    const userLevelResult = await query(
      'SELECT id FROM user_level WHERE position = $1 AND status = $2',
      [validatedData.position, 'Active']
    );

    if (userLevelResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid position selected' },
        { status: 400 }
      );
    }

    const userLevelId = userLevelResult.rows[0].id;

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Start transaction
    await client.query('BEGIN');

    try {
      // Create profile
      const profileId = uuidv4();
      await client.query(
        `INSERT INTO profile (
          id, firstname, middlename, lastname, date_of_birth, phone_number, 
          address, job_title, division, region, province, city, barangay, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          profileId,
          validatedData.firstName,
          validatedData.middleInitial || null,
          validatedData.lastName,
          validatedData.dateOfBirth,
          validatedData.phoneNumber,
          validatedData.address,
          validatedData.jobTitle,
          validatedData.division || null,
          validatedData.region || null,
          validatedData.province || null,
          validatedData.city || null,
          validatedData.barangay || null,
          'Active'
        ]
      );

      // Create account
      const accountId = uuidv4();
      const now = new Date().toISOString();
      
      await client.query(
        `INSERT INTO account (
          id, username, email, password, status, "profileId", "user_levelId",
          created_at, updated_at, terms_accepted, failed_login_attempts
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          accountId,
          validatedData.username,
          validatedData.email,
          hashedPassword,
          'Active',
          profileId,
          userLevelId,
          now,
          now,
          validatedData.termsAccepted,
          0
        ]
      );

      // Commit transaction
      await client.query('COMMIT');

      // Generate JWT token
      const token = generateToken({
        userId: accountId,
        email: validatedData.email,
        userLevelId: userLevelId,
        position: validatedData.position
      });

      // Set HTTP-only cookie
      const response = NextResponse.json(
        { 
          message: 'Registration successful',
          user: {
            id: accountId,
            email: validatedData.email,
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            position: validatedData.position
          }
        },
        { status: 201 }
      );

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      return response;

    } catch (error) {
      // Rollback transaction
      await client.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
