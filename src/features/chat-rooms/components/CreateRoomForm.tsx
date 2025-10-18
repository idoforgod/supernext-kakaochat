'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateRoom } from '@/features/chat-rooms/hooks/useCreateRoom';
import { useToast } from '@/hooks/use-toast';
import { ROOM_UI_TEXT } from '@/features/chat-rooms/constants/text';
import { ROOM_NAME_MAX_LENGTH } from '@/features/chat-rooms/constants/validation';

export function CreateRoomForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: createRoom, isPending } = useCreateRoom();

  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 클라이언트 측 검증
    if (roomName.trim().length === 0) {
      setError(ROOM_UI_TEXT.ERROR_ROOM_NAME_REQUIRED);
      return;
    }

    if (roomName.length > ROOM_NAME_MAX_LENGTH) {
      setError(ROOM_UI_TEXT.ERROR_ROOM_NAME_TOO_LONG);
      return;
    }

    setError('');

    createRoom(
      { name: roomName },
      {
        onSuccess: () => {
          toast({
            title: '성공',
            description: ROOM_UI_TEXT.SUCCESS_ROOM_CREATED,
          });
          router.push('/rooms');
        },
        onError: (error: any) => {
          const errorCode = error.response?.data?.error?.code;
          const errorMessage = error.response?.data?.error?.message;

          let displayMessage: string = ROOM_UI_TEXT.ERROR_UNKNOWN;

          switch (errorCode) {
            case 'ROOM_NAME_DUPLICATE':
              displayMessage = ROOM_UI_TEXT.ERROR_ROOM_NAME_DUPLICATE;
              break;
            case 'VALIDATION_ERROR':
              displayMessage = ROOM_UI_TEXT.ERROR_VALIDATION;
              break;
            case 'UNAUTHORIZED':
              displayMessage = ROOM_UI_TEXT.ERROR_UNAUTHORIZED;
              router.push('/login');
              return;
            case 'ACCOUNT_INACTIVE':
              displayMessage = ROOM_UI_TEXT.ERROR_ACCOUNT_INACTIVE;
              break;
            case 'INTERNAL_SERVER_ERROR':
            case 'DB_ERROR':
              displayMessage = ROOM_UI_TEXT.ERROR_SERVER;
              break;
            default:
              displayMessage = errorMessage || ROOM_UI_TEXT.ERROR_UNKNOWN;
          }

          setError(displayMessage);
          toast({
            variant: 'destructive',
            title: '채팅방 생성 실패',
            description: displayMessage,
          });
        },
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="roomName">{ROOM_UI_TEXT.LABEL_ROOM_NAME}</Label>
        <Input
          id="roomName"
          type="text"
          value={roomName}
          onChange={handleInputChange}
          placeholder={ROOM_UI_TEXT.PLACEHOLDER_ROOM_NAME}
          required
          disabled={isPending}
          maxLength={ROOM_NAME_MAX_LENGTH}
        />
        <div className="flex justify-between items-center mt-1">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <p className="text-sm text-gray-500 ml-auto">
            {ROOM_UI_TEXT.CHARACTER_COUNT(roomName.length, ROOM_NAME_MAX_LENGTH)}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/rooms')}
          disabled={isPending}
          className="flex-1"
        >
          {ROOM_UI_TEXT.BUTTON_CANCEL}
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? ROOM_UI_TEXT.BUTTON_CREATING : ROOM_UI_TEXT.BUTTON_ADD}
        </Button>
      </div>
    </form>
  );
}
