import { NextRequest } from 'next/server';
import { verifyToken, JWTPayload } from './jwt';

export function getAuthUser(request: NextRequest): JWTPayload | null {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export function requireAuth(request: NextRequest): JWTPayload {
  const user = getAuthUser(request);
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

export function requireAdmin(request: NextRequest): JWTPayload {
  const user = requireAuth(request);
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }

  return user;
}
