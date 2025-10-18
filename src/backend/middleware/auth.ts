import { Context, Next } from 'hono';
import type { AppEnv } from '@/backend/hono/context';
import { verifyToken } from '@/backend/auth/jwt';

/**
 * 인증 미들웨어
 * 요청 헤더에서 JWT 토큰을 확인하고 사용자 정보를 컨텍스트에 추가
 */
export async function authMiddleware(c: Context<AppEnv>, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '인증이 필요합니다.',
        },
      },
      401
    );
  }

  const token = authHeader.substring(7); // 'Bearer ' 제거

  try {
    const payload = verifyToken(token);

    // 사용자 정보를 컨텍스트에 저장
    c.set('userId', payload.userId);
    c.set('userEmail', payload.email);

    await next();
  } catch (error) {
    return c.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '유효하지 않은 인증 토큰입니다.',
        },
      },
      401
    );
  }
}
