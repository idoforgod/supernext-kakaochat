import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { AppEnv } from '@/backend/hono/context';
import { respond } from '@/backend/http/response';
import { authMiddleware } from '@/backend/middleware/auth';
import { UpdateNicknameBodySchema } from './schema';
import { updateNicknameService } from './service';

export const profileRoute = new Hono<AppEnv>()
  .patch(
    '/api/profile/nickname',
    authMiddleware,
    zValidator('json', UpdateNicknameBodySchema),
    async (c) => {
      const { nickname } = c.req.valid('json');
      const userIdStr = c.get('userId');

      if (!userIdStr) {
        return c.json(
          {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: '로그인이 필요합니다.',
            },
          },
          401
        );
      }

      const userId = parseInt(userIdStr, 10);

      if (isNaN(userId)) {
        return c.json(
          {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: '유효하지 않은 사용자 ID입니다.',
            },
          },
          401
        );
      }

      const result = await updateNicknameService({ userId, nickname }, c);

      return respond(c, result);
    }
  );
