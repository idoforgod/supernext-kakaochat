'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/remote/api-client';
import type { Message } from '@/features/messages/lib/dto';

interface SendMessageParams {
  roomId: number;
  content: string;
}

interface SendMessageResponse {
  success: true;
  data: Message;
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SendMessageParams) => {
      const response = await apiClient.post<SendMessageResponse['data']>(
        '/api/messages',
        params
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // 메시지 목록 캐시 무효화하여 최신 데이터 가져오기
      queryClient.invalidateQueries({
        queryKey: ['messages', variables.roomId],
      });
    },
  });
}
