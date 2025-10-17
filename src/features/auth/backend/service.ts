import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import { createToken } from '@/backend/auth/jwt';
import { AuthErrorCode } from './error';
import type { AppContext } from '@/backend/hono/context';
import { success, failure, type HandlerResult } from '@/backend/http/response';

export interface LoginParams {
  email: string;
  password: string;
}

export async function loginService(
  params: LoginParams,
  c: AppContext
) {
  const { email, password } = params;
  const supabase = c.get('supabase');
  const logger = c.get('logger');

  try {
    // 1. 사용자 조회
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, nickname, password_hash, status, created_at')
      .eq('email', email)
      .single();

    if (error || !user) {
      logger.warn(`Login attempt for non-existent email: ${email}`);
      return {
        success: false,
        error: AuthErrorCode.AUTH_FAILED,
      };
    }

    // 2. 계정 상태 확인
    if (user.status !== 'active') {
      logger.warn(`Login attempt for inactive account: ${email}, status: ${user.status}`);
      return {
        success: false,
        error: {
          code: AuthErrorCode.ACCOUNT_INACTIVE.code,
          statusCode: AuthErrorCode.ACCOUNT_INACTIVE.statusCode,
          message:
            user.status === 'pending'
              ? AuthErrorCode.ACCOUNT_INACTIVE.messages.pending
              : AuthErrorCode.ACCOUNT_INACTIVE.messages.inactive,
        },
      };
    }

    // 3. 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash as string
    );

    if (!isPasswordValid) {
      logger.warn(`Invalid password for email: ${email}`);
      return {
        success: false,
        error: AuthErrorCode.AUTH_FAILED,
      };
    }

    // 4. JWT 토큰 생성
    const token = createToken({
      userId: user.id,
      email: user.email,
    });

    logger.info(`Successful login for: ${email}`);

    // 5. 응답 반환
    return {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          createdAt: user.created_at,
        },
        redirectTo: '/rooms',
      },
    };

  } catch (err) {
    logger.error('Unexpected error during login', err);
    return {
      success: false,
      error: AuthErrorCode.SERVER_ERROR,
    };
  }
}

export interface SignupParams {
  nickname: string;
  email: string;
  password: string;
}

export async function signupService(
  params: SignupParams,
  c: AppContext
): Promise<HandlerResult<{ message: string; redirectTo: string }, string>> {
  const { nickname, email, password } = params;
  const supabase = c.get('supabase');
  const logger = c.get('logger');

  try {
    // 1. 닉네임 중복 검증
    const { data: existingNickname } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', nickname)
      .maybeSingle();

    if (existingNickname) {
      logger.warn(`Signup attempt with duplicate nickname: ${nickname}`);
      return failure(
        409,
        AuthErrorCode.DUPLICATE_NICKNAME.code,
        AuthErrorCode.DUPLICATE_NICKNAME.message
      );
    }

    // 2. 이메일 중복 검증
    const { data: existingEmail } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingEmail) {
      logger.warn(`Signup attempt with duplicate email: ${email}`);
      return failure(
        409,
        AuthErrorCode.DUPLICATE_EMAIL.code,
        AuthErrorCode.DUPLICATE_EMAIL.message
      );
    }

    // 3. 비밀번호 해싱
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. 사용자 생성
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        nickname,
        email,
        password_hash: passwordHash,
        status: 'pending',
      })
      .select('id, email')
      .single();

    if (insertError || !newUser) {
      logger.error('Failed to create user', insertError);
      return failure(
        500,
        AuthErrorCode.DB_ERROR.code,
        AuthErrorCode.DB_ERROR.message
      );
    }

    // 5. 이메일 인증 토큰 생성 및 발송 (현재는 로그로 대체)
    logger.info(
      `[MOCK] Email verification link for ${email}: /verify-email?token=mock-token-${newUser.id}`
    );

    logger.info(`New user signed up: ${email}`);

    return success(
      {
        message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.',
        redirectTo: '/login',
      },
      201
    );
  } catch (err) {
    logger.error('Unexpected error during signup', err);
    return failure(
      500,
      AuthErrorCode.SERVER_ERROR.code,
      AuthErrorCode.SERVER_ERROR.message
    );
  }
}