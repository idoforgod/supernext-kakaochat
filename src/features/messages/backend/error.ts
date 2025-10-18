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

  // 메시지 전송 실패 (400)
  MESSAGE_SEND_FAILED: {
    code: 'MESSAGE_SEND_FAILED',
    statusCode: 400,
    message: '메시지 전송에 실패했습니다.',
  },

  // 메시지 내용 너무 김 (400)
  MESSAGE_TOO_LONG: {
    code: 'MESSAGE_TOO_LONG',
    statusCode: 400,
    message: '메시지가 너무 깁니다. 2000자 이내로 작성해주세요.',
  },

  // 빈 메시지 (400)
  MESSAGE_EMPTY: {
    code: 'MESSAGE_EMPTY',
    statusCode: 400,
    message: '메시지 내용을 입력해주세요.',
  },

  // DB 저장 실패 (500)
  DB_SAVE_FAILED: {
    code: 'DB_SAVE_FAILED',
    statusCode: 500,
    message: '메시지 전송에 실패했습니다. 잠시 후 다시 시도해주세요.',
  },

  // 서버 내부 오류 (500)
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
    message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  },
} as const;
