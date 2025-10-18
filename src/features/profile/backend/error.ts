/**
 * Profile error codes
 */

export const ProfileErrorCode = {
  // 닉네임 중복 (409)
  NICKNAME_ALREADY_EXISTS: {
    code: 'NICKNAME_ALREADY_EXISTS',
    statusCode: 409,
    message: '이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.',
  },

  // 유효하지 않은 닉네임 형식 (400)
  INVALID_NICKNAME_FORMAT: {
    code: 'INVALID_NICKNAME_FORMAT',
    statusCode: 400,
    message: '닉네임 형식이 올바르지 않습니다.',
  },

  // 사용자를 찾을 수 없음 (404)
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    statusCode: 404,
    message: '사용자를 찾을 수 없습니다.',
  },

  // 닉네임 업데이트 실패 (500)
  NICKNAME_UPDATE_FAILED: {
    code: 'NICKNAME_UPDATE_FAILED',
    statusCode: 500,
    message: '닉네임 변경에 실패했습니다. 잠시 후 다시 시도해주세요.',
  },

  // 서버 내부 오류 (500)
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
    message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  },
} as const;
