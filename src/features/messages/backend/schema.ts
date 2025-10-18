import { z } from 'zod';
import {
  MESSAGE_LIST_DEFAULT_LIMIT,
  MESSAGE_LIST_MAX_LIMIT,
  MESSAGE_CONTENT_MIN_LENGTH,
  MESSAGE_CONTENT_MAX_LENGTH
} from '../constants/validation';

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

// === 메시지 전송 관련 스키마 ===

export const SendMessageBodySchema = z.object({
  roomId: z.number().int().positive(),
  content: z
    .string()
    .min(MESSAGE_CONTENT_MIN_LENGTH, '메시지 내용은 최소 1자 이상이어야 합니다.')
    .max(MESSAGE_CONTENT_MAX_LENGTH, `메시지 내용은 최대 ${MESSAGE_CONTENT_MAX_LENGTH}자 이하여야 합니다.`)
    .trim()
    .refine((val) => val.length > 0, {
      message: '메시지 내용은 공백만으로 구성될 수 없습니다.',
    }),
  parentMessageId: z.number().int().positive().optional(),
});

export const SendMessageResponseSchema = z.object({
  success: z.literal(true),
  data: MessageSchema,
});

export type SendMessageBody = z.infer<typeof SendMessageBodySchema>;
export type SendMessageResponse = z.infer<typeof SendMessageResponseSchema>;
