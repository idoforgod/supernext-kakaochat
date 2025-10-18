'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/remote/api-client';

interface ToggleReactionParams {
  messageId: number;
}

interface ToggleReactionResponse {
  success: true;
  data: {
    messageId: number;
    reactionType: string;
    totalCount: number;
    isActive: boolean;
  };
}

export function useToggleReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: ToggleReactionParams) => {
      const response = await apiClient.post<ToggleReactionResponse['data']>(
        `/api/messages/${params.messageId}/reactions`,
        {}
      );
      return response.data;
    },
    onSuccess: (data) => {
      // 메시지 목록 캐시 무효화하여 최신 데이터 가져오기
      queryClient.invalidateQueries({
        queryKey: ['messages'],
      });
    },
  });
}
