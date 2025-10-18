'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/remote/api-client';
import type { RoomDetailResponse } from '@/features/chat-rooms/lib/dto';

export function useRoomDetails(roomId: number) {
  return useQuery({
    queryKey: ['room', roomId],
    queryFn: async () => {
      const response = await apiClient.get<RoomDetailResponse['data']>(
        `/api/rooms/${roomId}`
      );
      return response.data;
    },
    enabled: !!roomId && !isNaN(roomId) && roomId > 0,
  });
}
