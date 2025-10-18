/**
 * Profile feature UI text constants
 */

export const UI_TEXT = {
  PAGE_TITLE: '프로필 설정',
  SECTION_TITLE_NICKNAME: '닉네임 변경',

  LABEL_NICKNAME: '닉네임',
  PLACEHOLDER_NICKNAME: '2~50자 (한글, 영문, 숫자만 가능)',

  BUTTON_SAVE: '저장',
  BUTTON_SAVING: '저장 중...',
  BUTTON_CANCEL: '취소',

  SUCCESS_NICKNAME_UPDATED: '닉네임이 성공적으로 변경되었습니다.',

  ERROR_NICKNAME_ALREADY_EXISTS: '이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.',
  ERROR_INVALID_NICKNAME_FORMAT: '닉네임 형식이 올바르지 않습니다.',
  ERROR_USER_NOT_FOUND: '사용자를 찾을 수 없습니다.',
  ERROR_NICKNAME_UPDATE_FAILED: '닉네임 변경에 실패했습니다. 잠시 후 다시 시도해주세요.',
  ERROR_INTERNAL_SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  ERROR_UNKNOWN: '알 수 없는 오류가 발생했습니다.',
} as const;
