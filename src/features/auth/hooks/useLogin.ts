import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/remote/api-client';
import type { LoginRequest, LoginResponse } from '@/features/auth/lib/dto';

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiClient.post<LoginResponse['data']>(
        '/api/auth/login',
        data
      );
      return response.data;
    },
  });
}