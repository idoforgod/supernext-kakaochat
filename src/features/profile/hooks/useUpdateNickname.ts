'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/remote/api-client';
import type { UpdateNicknameBody, UpdateNicknameResponse } from '@/features/profile/lib/dto';

export function useUpdateNickname() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateNicknameBody) => {
      const response = await apiClient.patch<UpdateNicknameResponse['data']>(
        '/api/profile/nickname',
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}
