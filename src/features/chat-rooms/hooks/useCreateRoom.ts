'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/remote/api-client';
import type { CreateRoomRequest, CreateRoomResponse } from '@/features/chat-rooms/lib/dto';

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoomRequest) => {
      const response = await apiClient.post<CreateRoomResponse['data']>(
        '/api/rooms',
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // 채팅방 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}
