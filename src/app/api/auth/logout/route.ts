import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/utils/jwt';

// Helper function to log logout activity
async function logLogoutActivity(
  accountId: string | null,
  status: 'success' | 'failed',
  details: object,
  request: NextRequest
) {
  try {
    await query(
      `INSERT INTO activity_log (
        account_id, activity_type, activity_category, target_table, 
        target_id, action_details, ip_address, device_info, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        accountId,        'logout',
        'session',
        'account',
        accountId,
        JSON.stringify(details),
        request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '::1',
        request.headers.get('user-agent') || 'Unknown',
        status
      ]
    );
  } catch (error) {
    console.error('Error logging logout activity:', error);
    // Don't throw - activity logging shouldn't break logout process
  }
}

/**
 * POST /api/auth/logout
 * Logs out the current user by clearing the authentication cookie
 */
export async function POST(request: NextRequest) {
  let userId = null;
  let userInfo = null;

  try {    // Try to get user info from token before clearing it
    const token = request.cookies.get('auth-token')?.value;
    if (token) {
      try {
        const decoded = verifyToken(token);
        if (decoded && decoded.userId) {
          userId = decoded.userId;
          
          // Get user info for logging
          const userResult = await query(
            `SELECT a.email, a.username, p.firstname, p.lastname
             FROM account a
             LEFT JOIN profile p ON a."profileId" = p.id
             WHERE a.id = $1`,
            [userId]
          );
          
          if (userResult.rows.length > 0) {
            userInfo = userResult.rows[0];
          }
        }
      } catch (tokenError) {
        console.log('Invalid token during logout:', tokenError);
        // Continue with logout even if token is invalid
      }
    }

    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    // Clear the authentication cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Immediately expire the cookie
      path: '/' // Ensure it matches the original cookie path
    });

    // Log successful logout
    await logLogoutActivity(
      userId,
      'success',
      {
        message: 'User logged out successfully',
        email: userInfo?.email || 'Unknown',
        username: userInfo?.username || 'Unknown',
        logout_method: 'manual',
        session_ended_at: new Date().toISOString()
      },
      request
    );

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    
    // Log failed logout attempt
    await logLogoutActivity(
      userId,
      'failed',
      {
        message: 'Logout failed due to server error',
        error: error instanceof Error ? error.message : 'Unknown error',
        attempted_at: new Date().toISOString()
      },
      request
    );

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
