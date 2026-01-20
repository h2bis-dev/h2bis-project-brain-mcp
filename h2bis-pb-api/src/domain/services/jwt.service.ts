import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;

// JWT Configuration from environment variables
const JWT_ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET || 'default-access-secret-change-in-production';
const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production';

const JWT_ACCESS_EXPIRATION = 3600; // 1 hour in seconds
const JWT_REFRESH_EXPIRATION = 604800; // 7 days in seconds

/**
 * JWT Token Payload Interface
 */
export interface JwtPayload {
    userId: string;
    email: string;
    roles: string[];
}

/**
 * Generate Access Token
 * Short-lived token for API authentication (default: 1 hour)
 */
export function generateAccessToken(userId: string, email: string, roles: string[]): string {
    const payload: JwtPayload = {
        userId,
        email,
        roles
    };

    return sign(payload, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRATION
    });
}

/**
 * Generate Refresh Token
 * Long-lived token for obtaining new access tokens (default: 7 days)
 */
export function generateRefreshToken(userId: string): string {
    const payload = { userId };

    return sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRATION
    });
}

/**
 * Verify Access Token
 * Throws error if token is invalid or expired
 */
export function verifyAccessToken(token: string): JwtPayload {
    const decoded = verify(token, JWT_ACCESS_SECRET) as JwtPayload;
    return decoded;
}

/**
 * Verify Refresh Token
 * Throws error if token is invalid or expired
 */
export function verifyRefreshToken(token: string): { userId: string } {
    const decoded = verify(token, JWT_REFRESH_SECRET) as { userId: string };
    return decoded;
}
