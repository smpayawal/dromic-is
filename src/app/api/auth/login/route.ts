import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword } from '@/lib/utils/password';
import { generateToken } from '@/lib/utils/jwt';
import { loginSchema } from '@/lib/utils/validation';

// Helper function to log activity
async function logActivity(
  accountId: string | null,
  activityType: 'login' | 'failed_login',
  status: 'success' | 'failed',
  details: object,
  request: NextRequest
) {
  try {
    // Extract additional security information
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const acceptLanguage = request.headers.get('accept-language') || 'Unknown';
    const referer = request.headers.get('referer') || 'Direct';
    
    // Enhanced security details
    const securityDetails = {
      ...details,
      browser_info: {
        user_agent: userAgent,
        accept_language: acceptLanguage,
        referer: referer
      },
      security_context: {
        timestamp: new Date().toISOString(),
        request_method: request.method,
        origin: request.headers.get('origin') || 'Unknown'
      }
    };

    await query(
      `INSERT INTO activity_log (
        account_id, activity_type, activity_category, target_table, 
        target_id, action_details, ip_address, device_info, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        accountId,        activityType,
        'session',
        'account',
        accountId,
        JSON.stringify(securityDetails),
        request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '::1',
        userAgent,
        status
      ]
    );
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - activity logging shouldn't break login process
  }
}

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
    );    if (userResult.rows.length === 0) {      // Log failed login attempt for unknown user
      await logActivity(
        null,
        'failed_login',
        'failed',
        { 
          message: 'Login attempt with invalid email/username',
          email_or_username: validatedData.email,
          reason: 'user_not_found',
          security_concern: 'potential_brute_force',
          attempted_credential: validatedData.email.includes('@') ? 'email' : 'username'
        },
        request
      );

      return NextResponse.json(
        { error: 'Invalid email/username or password' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];    // Check if account is locked
    if (user.account_locked_until && new Date() < new Date(user.account_locked_until)) {
      // Log failed login attempt for locked account
      await logActivity(
        user.id,
        'failed_login',
        'failed',
        { 
          message: 'Login attempt on locked account',
          email: user.email,
          username: user.username,
          reason: 'account_locked',
          locked_until: user.account_locked_until
        },
        request
      );

      return NextResponse.json(
        { error: 'Account is temporarily locked. Please try again later.' },
        { status: 423 }
      );
    }    // Check if account is active
    if (user.status !== 'Active') {
      // Log failed login attempt for inactive account
      await logActivity(
        user.id,
        'failed_login',
        'failed',
        { 
          message: 'Login attempt on inactive account',
          email: user.email,
          username: user.username,
          reason: 'account_inactive',
          account_status: user.status
        },
        request
      );

      return NextResponse.json(
        { error: 'Account is not active. Please contact administrator.' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(validatedData.password, user.password);    if (!isPasswordValid) {
      // Increment failed login attempts
      const newFailedAttempts = (user.failed_login_attempts || 0) + 1;
      let lockUntil = null;

      // Lock account after 5 failed attempts for 15 minutes
      if (newFailedAttempts >= 5) {
        lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
      }      await query(
        `UPDATE account 
         SET failed_login_attempts = $1, account_locked_until = $2
         WHERE id = $3`,
        [newFailedAttempts, lockUntil, user.id]
      );// Log failed login attempt for invalid password
      await logActivity(
        user.id,
        'failed_login',
        'failed',
        { 
          message: 'Login attempt with invalid password',
          email: user.email,
          username: user.username,
          reason: 'invalid_password',
          failed_attempts: newFailedAttempts,
          account_locked: lockUntil !== null,
          locked_until: lockUntil,
          security_alert: newFailedAttempts >= 3,
          lockout_threshold: 5,
          previous_failed_attempts: user.failed_login_attempts || 0
        },
        request
      );

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }    // Reset failed login attempts and update last login
    await query(
      `UPDATE account 
       SET failed_login_attempts = 0, account_locked_until = NULL, 
           last_login = $1
       WHERE id = $2`,
      [new Date().toISOString(), user.id]
    );// Generate JWT token first to get session info
    const sessionId = require('crypto').randomUUID();
    const token = generateToken({
      userId: user.id,
      email: user.email,
      userLevelId: user.user_levelId,
      position: user.position,
      sessionId: sessionId
    });

    // Log successful login with enhanced session tracking
    await logActivity(
      user.id,
      'login',
      'success',
      { 
        message: 'Successful login',
        email: user.email,
        username: user.username,
        login_method: 'password',
        session_duration: '7_days',
        session_id: sessionId,
        user_level: user.position,
        last_login: user.last_login,
        failed_attempts_reset: true,
        authentication_flow: 'standard_login'
      },
      request
    );

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
