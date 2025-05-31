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
    }

    // Fetch user details from database
    const userResult = await query(
      `SELECT 
        a.id, a.username, a.email, a.status, a.last_login, a.created_at,
        p.firstname, p.lastname, p.middlename, p.name_ext, p.image_url, 
        p.region, p.province, p.city, p.barangay, p.date_of_birth, 
        p.phone_number, p.address, p.job_title, p.division,
        ul.position, ul.abbreviation, ul."userLevel"
      FROM account a
      LEFT JOIN profile p ON a."profileId" = p.id
      LEFT JOIN user_level ul ON a."user_levelId" = ul.id
      WHERE a.id = $1 AND a.status = $2`,
      [payload.userId, 'Active']
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Return user data (excluding sensitive information)
    return NextResponse.json(
      {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          status: user.status,
          lastLogin: user.last_login,
          createdAt: user.created_at,
          profile: {
            firstName: user.firstname,
            lastName: user.lastname,
            middleName: user.middlename,
            nameExtension: user.name_ext,
            imageUrl: user.image_url,
            region: user.region,
            province: user.province,
            city: user.city,
            barangay: user.barangay,
            dateOfBirth: user.date_of_birth,
            phoneNumber: user.phone_number,
            address: user.address,
            jobTitle: user.job_title,
            division: user.division
          },
          userLevel: {
            position: user.position,
            abbreviation: user.abbreviation,
            level: user.userLevel
          }
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
