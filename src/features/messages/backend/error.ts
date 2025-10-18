/**
 * Message error codes
 */

export const MessageErrorCode = {
  // 메시지 조회 실패 (500)
  MESSAGE_FETCH_FAILED: {
    code: 'MESSAGE_FETCH_FAILED',
    statusCode: 500,
    message: '메시지를 불러올 수 없습니다.',
  },

  // 서버 내부 오류 (500)
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
    message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  },
} as const;
