/**
 * Message feature UI text constants
 */

export const MESSAGE_UI_TEXT = {
  // Empty states
  EMPTY_MESSAGE: '아직 메시지가 없습니다. 첫 메시지를 남겨보세요!',

  // Loading states
  LOADING_ROOM: '채팅방을 불러오는 중...',
  LOADING_MESSAGES: '메시지를 불러오는 중...',

  // Error messages
  ERROR_ROOM_NOT_FOUND: '요청하신 채팅방을 찾을 수 없습니다. 채팅방 목록으로 이동합니다.',
  ERROR_INVALID_ROOM_ID: '유효하지 않은 채팅방 주소입니다.',
  ERROR_MESSAGE_FETCH_FAILED: '메시지를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.',
  ERROR_UNAUTHORIZED: '로그인이 필요합니다. 로그인 후 다시 시도해주세요.',
  ERROR_REALTIME_CONNECTION_FAILED: '실시간 연결에 실패했습니다. 메시지는 새로고침 시 업데이트됩니다.',
  ERROR_UNKNOWN: '알 수 없는 오류가 발생했습니다.',

  // Buttons
  BUTTON_RETRY: '다시 시도',
  BUTTON_BACK_TO_ROOMS: '채팅방 목록으로',

  // Connection status
  CONNECTION_CONNECTED: '연결됨',
  CONNECTION_DISCONNECTED: '연결 끊김',
} as const;
