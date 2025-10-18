import { z } from 'zod';
import { NICKNAME_MIN_LENGTH, NICKNAME_MAX_LENGTH, NICKNAME_PATTERN } from '../constants/validation';

// === 닉네임 변경 관련 스키마 ===

export const UpdateNicknameBodySchema = z.object({
  nickname: z
    .string()
    .min(NICKNAME_MIN_LENGTH, `닉네임은 ${NICKNAME_MIN_LENGTH}자 이상이어야 합니다.`)
    .max(NICKNAME_MAX_LENGTH, `닉네임은 ${NICKNAME_MAX_LENGTH}자 이하여야 합니다.`)
    .regex(NICKNAME_PATTERN, '닉네임에 특수문자는 사용할 수 없습니다.')
    .trim()
    .refine((val) => val.length >= NICKNAME_MIN_LENGTH, {
      message: '닉네임은 공백만으로 구성될 수 없습니다.',
    }),
});

export const UserProfileSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
});

export const UpdateNicknameResponseSchema = z.object({
  success: z.literal(true),
  data: UserProfileSchema,
});

export type UpdateNicknameBody = z.infer<typeof UpdateNicknameBodySchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UpdateNicknameResponse = z.infer<typeof UpdateNicknameResponseSchema>;
