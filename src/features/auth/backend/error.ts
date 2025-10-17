export const AuthErrorCode = {
  // 검증 오류 (400)
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    statusCode: 400,
    messages: {
      emptyEmail: '이메일 주소를 입력해주세요.',
      invalidEmail: '올바른 이메일 형식이 아닙니다.',
      emptyPassword: '비밀번호를 입력해주세요.',
      shortPassword: '비밀번호는 최소 8자 이상이어야 합니다.',
    },
  },

  // 인증 실패 (401)
  AUTH_FAILED: {
    code: 'AUTH_FAILED',
    statusCode: 401,
    message: '이메일 또는 비밀번호가 잘못되었습니다.',
  },

  // 계정 비활성 (403)
  ACCOUNT_INACTIVE: {
    code: 'ACCOUNT_INACTIVE',
    statusCode: 403,
    messages: {
      pending: '이메일 인증이 필요합니다. 이메일을 확인해주세요.',
      inactive: '비활성화된 계정입니다. 고객센터에 문의해주세요.',
    },
  },

  // 서버 내부 오류 (500)
  SERVER_ERROR: {
    code: 'SERVER_ERROR',
    statusCode: 500,
    message: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  },

  // 회원가입 관련 에러 (409)
  DUPLICATE_NICKNAME: {
    code: 'DUPLICATE_NICKNAME',
    statusCode: 409,
    message: '이미 사용 중인 닉네임입니다.',
  },

  DUPLICATE_EMAIL: {
    code: 'DUPLICATE_EMAIL',
    statusCode: 409,
    message: '이미 가입된 이메일입니다.',
  },

  // 데이터베이스 오류 (500)
  DB_ERROR: {
    code: 'DB_ERROR',
    statusCode: 500,
    message: '회원가입 처리 중 오류가 발생했습니다.',
  },
} as const;

export type AuthErrorCode = typeof AuthErrorCode;