import { SignJWT, jwtVerify } from 'jose';

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? 'dev-secret-change-me',
);

export const SESSION_COOKIE = 'session';

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export async function signSessionToken(
  payload: SessionPayload,
): Promise<string> {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secret);
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);

    if (!payload.sub) return null;

    return {
      sub: String(payload.sub),
      email: String(payload.email ?? ''),
      name: String(payload.name ?? ''),
      role: String(payload.role ?? 'AGENT'),
    };
  } catch {
    return null;
  }
}
