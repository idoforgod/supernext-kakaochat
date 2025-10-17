'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginRequestSchema, type LoginRequest } from '../backend/schema';
import { useLogin } from '../hooks/useLogin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveSession } from '@/lib/auth/session';
import { UI_TEXT } from '@/features/auth/constants/text';

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);

    try {
      const result = await loginMutation.mutateAsync(data);

      // 세션 토큰 저장
      saveSession(result.token);

      // 성공 토스트 표시
      toast({
        title: '로그인 성공',
        description: '환영합니다!',
      });

      // 리디렉션
      router.push(result.redirectTo);
    } catch (error: any) {
      setError('root', {
        type: 'manual',
        message: error.response?.data?.error?.message || UI_TEXT.UNKNOWN_ERROR
      });

      // 실패 토스트 표시
      toast({
        variant: 'destructive',
        title: '로그인 실패',
        description: error.response?.data?.error?.message || UI_TEXT.UNKNOWN_ERROR,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register('email')}
              className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              {...register('password')}
              className={errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {errors.root && (
            <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
              <p className="text-sm text-destructive">{errors.root.message}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {UI_TEXT.LOGIN_BUTTON}
          </Button>

          <p className="text-center text-sm text-gray-600">
            {UI_TEXT.NO_ACCOUNT_YET}{' '}
            <a href="/signup" className="text-primary hover:underline">
              {UI_TEXT.SIGNUP_LINK}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}