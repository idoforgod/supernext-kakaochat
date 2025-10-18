import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { AppEnv } from '@/backend/hono/context';
import { respond } from '@/backend/http/response';
import { authMiddleware } from '@/backend/middleware/auth';
import { GetMessagesQuerySchema, SendMessageBodySchema } from './schema';
import { getMessagesService, sendMessageService } from './service';

export const messageRoute = new Hono<AppEnv>()
  .get(
    '/api/rooms/:id/messages',
    authMiddleware,
    zValidator('query', GetMessagesQuerySchema),
    async (c) => {
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

      const { limit, before } = c.req.valid('query');

      const result = await getMessagesService(
        { roomId, limit, before },
        c
      );

      // 성공 시 데이터 구조를 맞춤
      if ('data' in result && result.data) {
        return c.json({
          success: true,
          data: result.data.messages,
          pagination: result.data.pagination,
        });
      }

      return respond(c, result);
    }
  )
  .post(
    '/api/messages',
    authMiddleware,
    zValidator('json', SendMessageBodySchema),
    async (c) => {
      const { roomId, content, parentMessageId } = c.req.valid('json');
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

      const result = await sendMessageService(
        { roomId, content, userId, parentMessageId },
        c
      );

      return respond(c, result);
    }
  );
