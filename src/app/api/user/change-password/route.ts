import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/utils/jwt';
import { comparePassword, hashPassword } from '@/lib/utils/password';
import { z } from 'zod';

// Password change validation schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = changePasswordSchema.parse(body);

    // Get current user's password hash
    const userResult = await query(
      'SELECT password FROM account WHERE id = $1 AND status = $2',
      [payload.userId, 'Active']
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];    // Verify current password
    const isCurrentPasswordValid = await comparePassword(validatedData.currentPassword, user.password);

    if (!isCurrentPasswordValid) {      // Log failed password change attempt with enhanced security details
      await query(
        `INSERT INTO activity_log (
          account_id, activity_type, activity_category, target_table, 
          target_id, action_details, ip_address, device_info, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          payload.userId,
          'login',         // Use valid activity type (failed login attempt)
          'session',       // Use valid activity category 
          'account',
          payload.userId,
          JSON.stringify({ 
            message: 'Failed password change attempt - invalid current password',
            reason: 'invalid_current_password',
            security_alert: true,
            timestamp: new Date().toISOString(),
            attempt_type: 'password_change',
            risk_level: 'medium',
            authentication_method: 'password_change_form'
          }),
          request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '::1',
          request.headers.get('user-agent') || 'Unknown',
          'failed'
        ]
      );

      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Get current account state before password update for audit trail
    const beforeStateResult = await query(
      `SELECT 
        id, username, email, status, last_login, created_at, updated_at,
        last_password_changed_at, failed_login_attempts, account_locked_until
      FROM account WHERE id = $1`,
      [payload.userId]
    );

    const beforeState = beforeStateResult.rows[0] || null;

    // Hash new password
    const hashedNewPassword = await hashPassword(validatedData.newPassword);

    // Update password with last_password_changed_at and return updated state
    const updateResult = await query(
      `UPDATE account SET 
        password = $1,
        last_password_changed_at = NOW(),
        updated_at = NOW()
      WHERE id = $2
      RETURNING id, username, email, status, last_login, created_at, updated_at,
                last_password_changed_at, failed_login_attempts, account_locked_until`,
      [hashedNewPassword, payload.userId]
    );    if (updateResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Password update failed' },
        { status: 500 }
      );
    }

    const afterState = updateResult.rows[0];

    // Prepare enhanced security details for audit log
    const securityDetails = {
      message: 'Password changed successfully',
      security_event: 'password_change',
      password_policy_compliant: true,
      timestamp: new Date().toISOString(),
      previous_password_changed: beforeState?.last_password_changed_at,
      security_context: {
        user_agent: request.headers.get('user-agent') || 'Unknown',
        accept_language: request.headers.get('accept-language') || 'Unknown',
        origin: request.headers.get('origin') || 'Unknown',
        referer: request.headers.get('referer') || 'Direct'
      },
      account_security: {
        failed_login_attempts: beforeState?.failed_login_attempts || 0,
        account_locked: beforeState?.account_locked_until ? new Date(beforeState.account_locked_until) > new Date() : false,
        last_login: beforeState?.last_login
      },
      audit_metadata: {
        changed_fields: ['password', 'last_password_changed_at', 'updated_at'],
        changes_count: 3,
        compliance_level: 'high'
      }
    };    // Log successful password change with complete audit trail
    await query(
      `INSERT INTO activity_log (
        account_id, activity_type, activity_category, target_table, 
        target_id, action_details, before_state, after_state,
        ip_address, device_info, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        payload.userId,
        'update',        // Use valid activity type
        'account',       // Use valid activity category
        'account',
        payload.userId,
        JSON.stringify(securityDetails),
        JSON.stringify({
          ...beforeState,
          password: '[REDACTED]' // Never log actual password hashes
        }),
        JSON.stringify({
          ...afterState,
          password: '[REDACTED]' // Never log actual password hashes
        }),
        request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '::1',
        request.headers.get('user-agent') || 'Unknown',
        'success'
      ]
    );

    return NextResponse.json(
      { message: 'Password changed successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Change password error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
