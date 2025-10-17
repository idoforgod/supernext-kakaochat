import { z } from 'zod';
import { PASSWORD_MIN_LENGTH, NICKNAME_MIN_LENGTH, NICKNAME_MAX_LENGTH } from '../constants/validation';

export const LoginRequestSchema = z.object({
  email: z
    .string({ required_error: '이메일을 입력해주세요.' })
    .min(1, { message: '이메일을 입력해주세요.' })
    .email({ message: '올바른 이메일 형식이 아닙니다.' }),
  password: z
    .string({ required_error: '비밀번호를 입력해주세요.' })
    .min(PASSWORD_MIN_LENGTH, { message: `비밀번호는 최소 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.` }),
});

export const LoginResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    token: z.string(),
    user: z.object({
      id: z.number(),
      email: z.string(),
      nickname: z.string(),
      createdAt: z.string().datetime(),
    }),
    redirectTo: z.string().default('/rooms'),
  }),
});

export const LoginErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type LoginError = z.infer<typeof LoginErrorSchema>;

// 회원가입 스키마
export const SignupRequestSchema = z
  .object({
    nickname: z
      .string({ required_error: '닉네임을 입력해주세요.' })
      .min(NICKNAME_MIN_LENGTH, { message: `닉네임은 최소 ${NICKNAME_MIN_LENGTH}자 이상이어야 합니다.` })
      .max(NICKNAME_MAX_LENGTH, { message: `닉네임은 최대 ${NICKNAME_MAX_LENGTH}자까지 가능합니다.` }),
    email: z
      .string({ required_error: '이메일을 입력해주세요.' })
      .min(1, { message: '이메일을 입력해주세요.' })
      .email({ message: '올바른 이메일 형식이 아닙니다.' }),
    password: z
      .string({ required_error: '비밀번호를 입력해주세요.' })
      .min(PASSWORD_MIN_LENGTH, { message: `비밀번호는 최소 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.` }),
    passwordConfirm: z
      .string({ required_error: '비밀번호 확인을 입력해주세요.' })
      .min(PASSWORD_MIN_LENGTH, { message: `비밀번호 확인은 최소 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.` }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export const SignupResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    message: z.string(),
    redirectTo: z.string(),
  }),
});

export const SignupErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type SignupRequest = z.infer<typeof SignupRequestSchema>;
export type SignupResponse = z.infer<typeof SignupResponseSchema>;
export type SignupError = z.infer<typeof SignupErrorSchema>;