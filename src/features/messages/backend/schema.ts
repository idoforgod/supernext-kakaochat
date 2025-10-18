import { z } from 'zod';
import { MESSAGE_LIST_DEFAULT_LIMIT, MESSAGE_LIST_MAX_LIMIT } from '../constants/validation';

// === 메시지 조회 관련 스키마 ===

export const GetMessagesQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : MESSAGE_LIST_DEFAULT_LIMIT))
    .refine((val) => val > 0 && val <= MESSAGE_LIST_MAX_LIMIT, {
      message: `limit은 1에서 ${MESSAGE_LIST_MAX_LIMIT} 사이여야 합니다.`,
    }),
  before: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
});

export const MessageSchema = z.object({
  id: z.number(),
  roomId: z.number(),
  userId: z.number(),
  user: z.object({
    id: z.number(),
    nickname: z.string(),
  }),
  content: z.string(),
  parentMessageId: z.number().nullable(),
  createdAt: z.string().datetime(),
});

export const GetMessagesResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(MessageSchema),
  pagination: z.object({
    total: z.number(),
    hasMore: z.boolean(),
  }),
});

export type GetMessagesQuery = z.infer<typeof GetMessagesQuerySchema>;
export type Message = z.infer<typeof MessageSchema>;
export type GetMessagesResponse = z.infer<typeof GetMessagesResponseSchema>;
