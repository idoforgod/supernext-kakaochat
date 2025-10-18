import { z } from 'zod';
import { ROOM_NAME_MIN_LENGTH, ROOM_NAME_MAX_LENGTH } from '../constants/validation';

// === 채팅방 생성 관련 스키마 ===

export const CreateRoomRequestSchema = z.object({
  name: z
    .string({ required_error: '채팅방 이름을 입력해주세요.' })
    .min(ROOM_NAME_MIN_LENGTH, { message: `채팅방 이름은 최소 ${ROOM_NAME_MIN_LENGTH}자 이상이어야 합니다.` })
    .max(ROOM_NAME_MAX_LENGTH, { message: `채팅방 이름은 최대 ${ROOM_NAME_MAX_LENGTH}자까지 가능합니다.` }),
});

export const CreateRoomResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    id: z.number(),
    name: z.string(),
    creatorId: z.number(),
    createdAt: z.string().datetime(),
  }),
});

export const CreateRoomErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type CreateRoomRequest = z.infer<typeof CreateRoomRequestSchema>;
export type CreateRoomResponse = z.infer<typeof CreateRoomResponseSchema>;
export type CreateRoomError = z.infer<typeof CreateRoomErrorSchema>;

// === 채팅방 상세 조회 관련 스키마 ===

export const RoomDetailResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    id: z.number(),
    name: z.string(),
    creatorId: z.number(),
    createdAt: z.string().datetime(),
  }),
});

export type RoomDetailResponse = z.infer<typeof RoomDetailResponseSchema>;
