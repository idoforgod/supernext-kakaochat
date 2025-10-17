'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignup } from '@/features/auth/hooks/useSignup';
import { useToast } from '@/hooks/use-toast';
import { UI_TEXT } from '@/features/auth/constants/text';
import { REDIRECT_DELAY_MS } from '@/features/auth/constants/validation';

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: signup, isPending } = useSignup();

  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 클라이언트 측 검증
    const newErrors: Record<string, string> = {};

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    signup(formData, {
      onSuccess: (data) => {
        toast({
          title: '회원가입 성공',
          description: data.message,
        });
        setTimeout(() => {
          router.push(data.redirectTo);
        }, REDIRECT_DELAY_MS);
      },
      onError: (error: any) => {
        toast({
          variant: 'destructive',
          title: '회원가입 실패',
          description:
            error.response?.data?.error?.message ||
            error.message ||
            UI_TEXT.UNKNOWN_ERROR,
        });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="nickname">닉네임</Label>
        <Input
          id="nickname"
          type="text"
          value={formData.nickname}
          onChange={(e) =>
            setFormData({ ...formData, nickname: e.target.value })
          }
          placeholder={UI_TEXT.PLACEHOLDER_NICKNAME}
          required
          disabled={isPending}
        />
        {errors.nickname && (
          <p className="text-sm text-red-600 mt-1">{errors.nickname}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder={UI_TEXT.PLACEHOLDER_EMAIL}
          required
          disabled={isPending}
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder={UI_TEXT.PLACEHOLDER_PASSWORD}
          required
          disabled={isPending}
        />
        {errors.password && (
          <p className="text-sm text-red-600 mt-1">{errors.password}</p>
        )}
      </div>

      <div>
        <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
        <Input
          id="passwordConfirm"
          type="password"
          value={formData.passwordConfirm}
          onChange={(e) =>
            setFormData({ ...formData, passwordConfirm: e.target.value })
          }
          placeholder={UI_TEXT.PLACEHOLDER_PASSWORD_CONFIRM}
          required
          disabled={isPending}
        />
        {errors.passwordConfirm && (
          <p className="text-sm text-red-600 mt-1">{errors.passwordConfirm}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? UI_TEXT.SIGNUP_BUTTON_PENDING : UI_TEXT.SIGNUP_BUTTON_DEFAULT}
      </Button>

      <p className="text-center text-sm text-gray-600">
        {UI_TEXT.ALREADY_HAVE_ACCOUNT}{' '}
        <a href="/login" className="text-primary hover:underline">
          {UI_TEXT.LOGIN_BUTTON}
        </a>
      </p>
    </form>
  );
}
