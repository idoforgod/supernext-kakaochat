/**
 * Chat room feature UI text constants
 */

export const ROOM_UI_TEXT = {
  // Page titles
  PAGE_TITLE_CREATE: '새로운 채팅방 만들기',
  PAGE_TITLE_ROOMS: '채팅방 목록',

  // Button labels
  BUTTON_CREATE_ROOM: '채팅방 추가하기',
  BUTTON_ADD: '추가',
  BUTTON_CANCEL: '취소',
  BUTTON_CREATING: '생성 중...',

  // Form labels
  LABEL_ROOM_NAME: '채팅방 이름',
  PLACEHOLDER_ROOM_NAME: '채팅방 이름을 입력하세요',

  // Success messages
  SUCCESS_ROOM_CREATED: '채팅방이 생성되었습니다',

  // Error messages
  ERROR_ROOM_NAME_REQUIRED: '채팅방 이름을 입력해주세요',
  ERROR_ROOM_NAME_TOO_LONG: '채팅방 이름은 100자 이하여야 합니다',
  ERROR_ROOM_NAME_DUPLICATE: '이미 존재하는 채팅방 이름입니다. 다른 이름을 입력해주세요.',
  ERROR_VALIDATION: '입력한 정보가 올바르지 않습니다. 다시 확인해주세요.',
  ERROR_UNAUTHORIZED: '세션이 만료되었습니다. 다시 로그인해주세요.',
  ERROR_ACCOUNT_INACTIVE: '이메일 인증이 필요합니다. 인증 메일을 확인해주세요.',
  ERROR_SERVER: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  ERROR_UNKNOWN: '알 수 없는 오류가 발생했습니다.',

  // Character count
  CHARACTER_COUNT: (current: number, max: number) => `${current}/${max}`,
} as const;
