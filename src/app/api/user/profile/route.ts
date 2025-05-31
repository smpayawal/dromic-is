import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/utils/jwt';
import { z } from 'zod';

// Profile update validation schema
const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  division: z.string().optional(),
  region: z.string().min(1, 'Region is required'),
  province: z.string().min(1, 'Province is required'),
  city: z.string().min(1, 'City is required'),
  barangay: z.string().optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
});

// Username/email update schema (separate for security)
const updateAccountSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
});

export async function PATCH(request: NextRequest) {
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
    const { updateType, ...data } = body;

    if (updateType === 'profile') {
      // Update profile information
      const validatedData = updateProfileSchema.parse(data);      // Log the activity first
      await query(
        `INSERT INTO activity_log (
          account_id, activity_type, activity_category, target_table, 
          target_id, action_details, ip_address, device_info, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          payload.userId,
          'update',
          'user',
          'profile',
          payload.userId,
          JSON.stringify({ message: 'Profile information updated' }),
          request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '::1',
          request.headers.get('user-agent') || 'Unknown',
          'success'
        ]
      );

      // Update profile
      const updateResult = await query(
        `UPDATE profile SET 
          firstname = $1, lastname = $2, middlename = $3, phone_number = $4,
          address = $5, job_title = $6, division = $7, region = $8,
          province = $9, city = $10, barangay = $11, date_of_birth = $12,
          updated_at = CURRENT_TIMESTAMP
        FROM account 
        WHERE profile.id = account."profileId" AND account.id = $13
        RETURNING profile.id`,
        [
          validatedData.firstName,
          validatedData.lastName,
          validatedData.middleName || null,
          validatedData.phoneNumber,
          validatedData.address,
          validatedData.jobTitle,
          validatedData.division || null,
          validatedData.region,
          validatedData.province,
          validatedData.city,
          validatedData.barangay || null,
          validatedData.dateOfBirth,
          payload.userId
        ]
      );

      if (updateResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'Profile not found or update failed' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: 'Profile updated successfully' },
        { status: 200 }
      );

    } else if (updateType === 'account') {
      // Update account information (username/email)
      const validatedData = updateAccountSchema.parse(data);

      // Check if username or email already exists for other users
      const existingUser = await query(
        'SELECT id FROM account WHERE (email = $1 OR username = $2) AND id != $3',
        [validatedData.email, validatedData.username, payload.userId]
      );

      if (existingUser.rows.length > 0) {
        return NextResponse.json(
          { error: 'Username or email already exists' },
          { status: 409 }
        );
      }      // Log the activity
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
          JSON.stringify({ message: 'Account information updated' }),
          request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '::1',
          request.headers.get('user-agent') || 'Unknown',
          'success'
        ]
      );

      // Update account
      const updateResult = await query(
        `UPDATE account SET 
          username = $1, email = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING id`,
        [validatedData.username, validatedData.email, payload.userId]
      );

      if (updateResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'Account not found or update failed' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: 'Account updated successfully' },
        { status: 200 }
      );

    } else {
      return NextResponse.json(
        { error: 'Invalid update type' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Profile update error:', error);

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
