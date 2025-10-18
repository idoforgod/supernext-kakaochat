import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { AppEnv } from '@/backend/hono/context';
import { respond } from '@/backend/http/response';
import { authMiddleware } from '@/backend/middleware/auth';
import { CreateRoomRequestSchema } from './schema';
import { createRoomService, getRoomDetailService } from './service';

export const roomRoute = new Hono<AppEnv>()
  .post(
    '/api/rooms',
    authMiddleware,
    zValidator('json', CreateRoomRequestSchema),
    async (c) => {
      const { name } = await c.req.json();
      const userId = c.get('userId');

      if (!userId) {
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

      const result = await createRoomService(
        { name, userId: parseInt(userId, 10) },
        c
      );

      return respond(c, result);
    }
  )
  .get('/api/rooms/:id', authMiddleware, async (c) => {
    const roomId = parseInt(c.req.param('id'), 10);

    if (isNaN(roomId)) {
      return c.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '유효하지 않은 채팅방 ID입니다.',
          },
        },
        400
      );
    }

    const result = await getRoomDetailService(roomId, c);
    return respond(c, result);
  });
