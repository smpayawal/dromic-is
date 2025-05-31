import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword } from '@/lib/utils/password';
import { generateToken } from '@/lib/utils/jwt';
import { loginSchema } from '@/lib/utils/validation';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = loginSchema.parse(body);    // Find user by email or username
    const userResult = await query(
      `SELECT 
        a.id, a.username, a.email, a.password, a.status, a.failed_login_attempts, 
        a.account_locked_until, a."user_levelId",
        p.firstname, p.lastname, p.image_url,
        ul.position, ul.abbreviation
      FROM account a
      LEFT JOIN profile p ON a."profileId" = p.id
      LEFT JOIN user_level ul ON a."user_levelId" = ul.id
      WHERE a.email = $1 OR a.username = $1`,
      [validatedData.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email/username or password' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // Check if account is locked
    if (user.account_locked_until && new Date() < new Date(user.account_locked_until)) {
      return NextResponse.json(
        { error: 'Account is temporarily locked. Please try again later.' },
        { status: 423 }
      );
    }

    // Check if account is active
    if (user.status !== 'Active') {
      return NextResponse.json(
        { error: 'Account is not active. Please contact administrator.' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(validatedData.password, user.password);

    if (!isPasswordValid) {
      // Increment failed login attempts
      const newFailedAttempts = (user.failed_login_attempts || 0) + 1;
      let lockUntil = null;

      // Lock account after 5 failed attempts for 15 minutes
      if (newFailedAttempts >= 5) {
        lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
      }

      await query(
        `UPDATE account 
         SET failed_login_attempts = $1, account_locked_until = $2, updated_at = $3
         WHERE id = $4`,
        [newFailedAttempts, lockUntil, new Date().toISOString(), user.id]
      );

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Reset failed login attempts and update last login
    await query(
      `UPDATE account 
       SET failed_login_attempts = 0, account_locked_until = NULL, 
           last_login = $1, updated_at = $2
       WHERE id = $3`,
      [new Date().toISOString(), new Date().toISOString(), user.id]
    );

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      userLevelId: user.user_levelId,
      position: user.position
    });

    // Set HTTP-only cookie
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstname,
          lastName: user.lastname,
          imageUrl: user.image_url,
          position: user.position,
          abbreviation: user.abbreviation
        }
      },
      { status: 200 }
    );

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    
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
  }
}
