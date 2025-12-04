import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  username: string;
}

export function generateToken(payload: TokenPayload): string {
  const jwtSecret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!jwtSecret) {
    throw new Error('JWT_SECRET não configurado');
  }

  return jwt.sign(payload, jwtSecret, { expiresIn });
}

export function verifyToken(token: string): TokenPayload {
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    throw new Error('JWT_SECRET não configurado');
  }

  return jwt.verify(token, jwtSecret) as TokenPayload;
}

