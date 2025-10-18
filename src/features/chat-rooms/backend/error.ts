/**
 * Chat room error codes
 */

export const ChatRoomErrorCode = {
  // 유효성 검증 오류 (400)
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    statusCode: 400,
    message: '입력 데이터가 유효하지 않습니다.',
  },

  // 채팅방 이름 중복 (409)
  ROOM_NAME_DUPLICATE: {
    code: 'ROOM_NAME_DUPLICATE',
    statusCode: 409,
    message: '이미 존재하는 채팅방 이름입니다.',
  },

  // 인증 오류 (401)
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    statusCode: 401,
    message: '인증이 필요합니다.',
  },

  // 계정 비활성 오류 (403)
  ACCOUNT_INACTIVE: {
    code: 'ACCOUNT_INACTIVE',
    statusCode: 403,
    message: '계정이 활성화되지 않았습니다.',
  },

  // 서버 내부 오류 (500)
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
    message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  },

  // 데이터베이스 오류 (500)
  DB_ERROR: {
    code: 'DB_ERROR',
    statusCode: 500,
    message: '채팅방 생성 중 오류가 발생했습니다.',
  },

  // 채팅방 없음 (404)
  ROOM_NOT_FOUND: {
    code: 'ROOM_NOT_FOUND',
    statusCode: 404,
    message: '채팅방을 찾을 수 없습니다.',
  },
} as const;
