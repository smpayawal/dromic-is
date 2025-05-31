import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/utils/jwt';

export async function GET(request: NextRequest) {
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
    }    // Get URL parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;
    
    const activityType = searchParams.get('activity_type');
    const activityCategory = searchParams.get('activity_category');
    const days = parseInt(searchParams.get('days') || '30', 10);    // Build query conditions
    let whereClause = 'WHERE account_id = $1';
    let queryParams: any[] = [payload.userId];
    let paramIndex = 2;

    // Add time filter
    if (days && days > 0) {
      whereClause += ` AND timestamp >= NOW() - INTERVAL '${days} days'`;
    }

    if (activityType) {
      whereClause += ` AND activity_type = $${paramIndex}`;
      queryParams.push(activityType);
      paramIndex++;
    }

    if (activityCategory) {
      whereClause += ` AND activity_category = $${paramIndex}`;
      queryParams.push(activityCategory);
      paramIndex++;
    }// Get user's activity logs
    const activityResult = await query(
      `SELECT 
        log_id,
        activity_type,
        activity_category,
        target_table,
        target_name,
        action_details,
        before_state,
        after_state,
        timestamp,
        ip_address,
        device_info,
        status,
        notes
      FROM activity_log 
      ${whereClause}
      ORDER BY timestamp DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, limit, offset]
    );

    // Get total count for pagination
    const countResult = await query(
      `SELECT COUNT(*) as total FROM activity_log ${whereClause}`,
      queryParams
    );

    const activities = activityResult.rows.map(row => ({
      log_id: row.log_id,
      activity_type: row.activity_type,
      activity_category: row.activity_category,
      target_table: row.target_table,
      target_name: row.target_name,
      action_details: row.action_details,
      before_state: row.before_state,
      after_state: row.after_state,
      timestamp: row.timestamp,
      ip_address: row.ip_address,
      device_info: row.device_info,
      status: row.status,
      notes: row.notes
    }));

    const total = parseInt(countResult.rows[0].total, 10);
    const hasMore = offset + limit < total;

    return NextResponse.json(
      {
        activities,
        hasMore,
        total,
        page,
        limit
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get activity logs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
