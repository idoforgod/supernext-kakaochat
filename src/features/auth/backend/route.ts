import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { LoginRequestSchema, SignupRequestSchema } from './schema';
import { loginService, signupService } from './service';
import { AuthErrorCode } from './error';
import { respond } from '@/backend/http/response';
import type { AppEnv } from '@/backend/hono/context';

export const authRoute = new Hono<AppEnv>()
  .post(
    '/api/auth/signup',
    zValidator('json', SignupRequestSchema),
    async (c) => {
      const { nickname, email, password } = await c.req.json();
      const result = await signupService({ nickname, email, password }, c);

      return respond(c, result);
    }
  )
  .post(
    '/api/auth/login',
    zValidator('json', LoginRequestSchema),
    async (c) => {
      const { email, password } = await c.req.json();
      const result = await loginService({ email, password }, c);

      if (!result.success) {
        return c.json(result, result.error.statusCode || 401);
      }

      return c.json(result);
    }
  );