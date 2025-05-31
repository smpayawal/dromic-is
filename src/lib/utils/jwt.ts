import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';

export interface TokenPayload {
  userId: string;
  email: string;
  userLevelId: string;
  position: string;
  sessionId?: string; // Optional session ID for tracking
}

/**
 * Generate a JWT token
 * @param payload Token payload containing user information
 * @param expiresIn Token expiration time (default: 7 days)
 * @returns string JWT token
 */
export const generateToken = (payload: TokenPayload, expiresIn: string = '7d'): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
};

/**
 * Verify and decode a JWT token
 * @param token JWT token to verify
 * @returns TokenPayload | null Decoded payload or null if invalid
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};

/**
 * Generate a refresh token (longer expiration)
 * @param payload Token payload
 * @returns string Refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' } as jwt.SignOptions);
};
