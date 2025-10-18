import type { AppContext } from '@/backend/hono/context';
import { success, failure, type HandlerResult } from '@/backend/http/response';
import { ProfileErrorCode } from './error';
import type { UserProfile } from './schema';

export interface UpdateNicknameParams {
  userId: number;
  nickname: string;
}

export async function updateNicknameService(
  params: UpdateNicknameParams,
  c: AppContext
): Promise<HandlerResult<UserProfile, string>> {
  const { userId, nickname } = params;
  const supabase = c.get('supabase');
  const logger = c.get('logger');

  try {
    // 1. 사용자 존재 여부 확인
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, nickname, email, created_at')
      .eq('id', userId)
      .maybeSingle();

    if (userError || !user) {
      logger.error('User not found', { userId, error: userError });
      return failure(
        ProfileErrorCode.USER_NOT_FOUND.statusCode,
        ProfileErrorCode.USER_NOT_FOUND.code,
        ProfileErrorCode.USER_NOT_FOUND.message
      );
    }

    // 2. 닉네임 중복 검증 (자신 제외)
    const { data: duplicateUser, error: duplicateError } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', nickname)
      .neq('id', userId)
      .maybeSingle();

    if (duplicateError) {
      logger.error('Failed to check nickname duplicate', { error: duplicateError });
      return failure(
        ProfileErrorCode.NICKNAME_UPDATE_FAILED.statusCode,
        ProfileErrorCode.NICKNAME_UPDATE_FAILED.code,
        ProfileErrorCode.NICKNAME_UPDATE_FAILED.message
      );
    }

    if (duplicateUser) {
      logger.info('Nickname already exists', { nickname });
      return failure(
        ProfileErrorCode.NICKNAME_ALREADY_EXISTS.statusCode,
        ProfileErrorCode.NICKNAME_ALREADY_EXISTS.code,
        ProfileErrorCode.NICKNAME_ALREADY_EXISTS.message
      );
    }

    // 3. 닉네임 업데이트
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ nickname })
      .eq('id', userId)
      .select('id, nickname, email, created_at')
      .single();

    if (updateError || !updatedUser) {
      logger.error('Failed to update nickname', { error: updateError });
      return failure(
        ProfileErrorCode.NICKNAME_UPDATE_FAILED.statusCode,
        ProfileErrorCode.NICKNAME_UPDATE_FAILED.code,
        ProfileErrorCode.NICKNAME_UPDATE_FAILED.message
      );
    }

    return success({
      id: updatedUser.id,
      nickname: updatedUser.nickname,
      email: updatedUser.email,
      createdAt: updatedUser.created_at,
    });
  } catch (err) {
    logger.error('Unexpected error during nickname update', err);
    return failure(
      ProfileErrorCode.INTERNAL_SERVER_ERROR.statusCode,
      ProfileErrorCode.INTERNAL_SERVER_ERROR.code,
      ProfileErrorCode.INTERNAL_SERVER_ERROR.message
    );
  }
}
