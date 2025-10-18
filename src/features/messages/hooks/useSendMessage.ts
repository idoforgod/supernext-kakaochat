'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/remote/api-client';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import type { Message } from '@/features/messages/lib/dto';

interface SendMessageParams {
  roomId: number;
  content: string;
  parentMessageId?: number;
}

interface SendMessageResponse {
  success: true;
  data: Message;
}

interface OptimisticMessage extends Omit<Message, 'id' | 'userId' | 'user'> {
  id: string | number; // 임시 ID (string) 또는 실제 ID (number)
  userId: string | number; // string (CurrentUser.id) 또는 number (실제 user id)
  user: {
    id: string | number; // string (CurrentUser.id) 또는 number (실제 user id)
    nickname: string;
  };
  _tempId?: string;
  _status?: 'sending' | 'sent' | 'failed';
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useCurrentUser();

  return useMutation({
    mutationFn: async (params: SendMessageParams) => {
      const response = await apiClient.post<SendMessageResponse['data']>(
        '/api/messages',
        params
      );
      return response.data;
    },
    onMutate: async (variables) => {
      const { roomId, content, parentMessageId } = variables;

      // 진행 중인 쿼리 취소 (optimistic update와 충돌 방지)
      await queryClient.cancelQueries({
        queryKey: ['messages', roomId],
      });

      // 이전 데이터 백업
      const previousMessages = queryClient.getQueryData<Message[]>(['messages', roomId]);

      // 현재 사용자 정보가 없으면 optimistic update 건너뛰기
      if (!currentUser) {
        return { previousMessages, tempId: null };
      }

      // 임시 메시지 생성
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const optimisticMessage: OptimisticMessage = {
        id: tempId,
        roomId,
        userId: currentUser.id,
        user: {
          id: currentUser.id,
          nickname: currentUser.nickname,
        },
        content,
        parentMessageId: parentMessageId || null,
        createdAt: new Date().toISOString(),
        _tempId: tempId,
        _status: 'sending',
        reactionCount: 0,
        hasUserReacted: false,
      };

      // Optimistic Update: 임시 메시지를 캐시에 추가
      queryClient.setQueryData<Message[]>(
        ['messages', roomId],
        (old) => [...(old || []), optimisticMessage as unknown as Message]
      );

      // 롤백을 위해 이전 데이터 반환
      return { previousMessages, tempId };
    },
    onError: (err, variables, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ['messages', variables.roomId],
          context.previousMessages
        );
      }
    },
    onSuccess: (data, variables) => {
      // Realtime이 메시지를 전파하므로 별도 처리 불필요
      // 하지만 Realtime보다 먼저 도착할 수 있으므로 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['messages', variables.roomId],
      });
    },
  });
}
