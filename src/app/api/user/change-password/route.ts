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

    const user = userResult.rows[0];

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(validatedData.currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      // Log failed password change attempt
      await query(
        `INSERT INTO activity_log (
          account_id, activity_type, activity_category, target_table, 
          target_id, action_details, ip_address, device_info, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          payload.userId,
          'update',
          'account',
          'account',
          payload.userId,
          JSON.stringify({ message: 'Failed password change attempt - invalid current password' }),
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

    // Hash new password
    const hashedNewPassword = await hashPassword(validatedData.newPassword);

    // Update password
    const updateResult = await query(
      `UPDATE account SET 
        password = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id`,
      [hashedNewPassword, payload.userId]
    );

    if (updateResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Password update failed' },
        { status: 500 }
      );
    }

    // Log successful password change
    await query(
      `INSERT INTO activity_log (
        account_id, activity_type, activity_category, target_table, 
        target_id, action_details, ip_address, device_info, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        payload.userId,
        'update',
        'account',
        'account',
        payload.userId,
        JSON.stringify({ message: 'Password changed successfully' }),
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
