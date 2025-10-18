'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/remote/api-client';
import type { Message } from '@/features/messages/lib/dto';

interface UseMessagesParams {
  roomId: number;
  limit?: number;
  before?: number;
}

export function useMessages({ roomId, limit, before }: UseMessagesParams) {
  return useQuery({
    queryKey: ['messages', roomId, { limit, before }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (before) params.append('before', before.toString());

      const response = await apiClient.get<Message[]>(
        `/api/rooms/${roomId}/messages?${params.toString()}`
      );
      return response.data;
    },
    enabled: !!roomId && !isNaN(roomId) && roomId > 0,
  });
}
