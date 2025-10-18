'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateNickname } from '@/features/profile/hooks/useUpdateNickname';
import { useToast } from '@/hooks/use-toast';
import { UI_TEXT } from '@/features/profile/constants/text';

interface NicknameFormProps {
  currentNickname: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NicknameForm({
  currentNickname,
  onSuccess,
  onCancel,
}: NicknameFormProps) {
  const { toast } = useToast();
  const { mutate: updateNickname, isPending } = useUpdateNickname();

  const [nickname, setNickname] = useState(currentNickname);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nickname.trim() === currentNickname) {
      setError('기존 닉네임과 동일합니다.');
      return;
    }

    setError('');

    updateNickname(
      { nickname },
      {
        onSuccess: () => {
          toast({
            title: '성공',
            description: UI_TEXT.SUCCESS_NICKNAME_UPDATED,
          });
          onSuccess?.();
        },
        onError: (error: any) => {
          const errorCode = error.response?.data?.error?.code;
          let errorMessage: string = UI_TEXT.ERROR_UNKNOWN;

          if (errorCode === 'NICKNAME_ALREADY_EXISTS') {
            errorMessage = UI_TEXT.ERROR_NICKNAME_ALREADY_EXISTS;
          } else if (errorCode === 'INVALID_NICKNAME_FORMAT') {
            errorMessage = UI_TEXT.ERROR_INVALID_NICKNAME_FORMAT;
          } else if (errorCode === 'USER_NOT_FOUND') {
            errorMessage = UI_TEXT.ERROR_USER_NOT_FOUND;
          } else if (errorCode === 'NICKNAME_UPDATE_FAILED') {
            errorMessage = UI_TEXT.ERROR_NICKNAME_UPDATE_FAILED;
          } else if (errorCode === 'INTERNAL_SERVER_ERROR') {
            errorMessage = UI_TEXT.ERROR_INTERNAL_SERVER_ERROR;
          }

          toast({
            variant: 'destructive',
            title: '닉네임 변경 실패',
            description: errorMessage,
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nickname">{UI_TEXT.LABEL_NICKNAME}</Label>
        <Input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={UI_TEXT.PLACEHOLDER_NICKNAME}
          required
          disabled={isPending}
        />
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? UI_TEXT.BUTTON_SAVING : UI_TEXT.BUTTON_SAVE}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            {UI_TEXT.BUTTON_CANCEL}
          </Button>
        )}
      </div>
    </form>
  );
}
