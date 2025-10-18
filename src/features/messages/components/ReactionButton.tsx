'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useToggleReaction } from '../hooks/useToggleReaction';
import { useToast } from '@/hooks/use-toast';
import { MESSAGE_UI_TEXT } from '../constants/text';

interface ReactionButtonProps {
  messageId: number;
  initialCount: number;
  initialIsActive: boolean;
  isOwnMessage?: boolean;
}

export function ReactionButton({
  messageId,
  initialCount,
  initialIsActive,
  isOwnMessage = false,
}: ReactionButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [isActive, setIsActive] = useState(initialIsActive);
  const { toast } = useToast();
  const toggleReactionMutation = useToggleReaction();

  // props가 변경되면 로컬 상태 동기화
  useEffect(() => {
    setCount(initialCount);
    setIsActive(initialIsActive);
  }, [initialCount, initialIsActive]);

  const handleClick = async () => {
    // Optimistic Update
    const previousCount = count;
    const previousIsActive = isActive;

    setIsActive(!isActive);
    setCount(isActive ? count - 1 : count + 1);

    try {
      await toggleReactionMutation.mutateAsync({ messageId });
    } catch (error: any) {
      // 실패 시 롤백
      setIsActive(previousIsActive);
      setCount(previousCount);

      const errorCode = error?.response?.data?.error?.code;
      let errorMessage: string = MESSAGE_UI_TEXT.ERROR_REACTION_FAILED;

      if (errorCode === 'MESSAGE_NOT_FOUND') {
        errorMessage = MESSAGE_UI_TEXT.ERROR_MESSAGE_NOT_FOUND;
      } else if (errorCode === 'UNAUTHORIZED') {
        errorMessage = MESSAGE_UI_TEXT.ERROR_UNAUTHORIZED;
      }

      toast({
        variant: 'destructive',
        title: errorMessage,
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={toggleReactionMutation.isPending}
      className={`flex items-center gap-1 rounded px-2 py-1 transition-all duration-300 ${
        isOwnMessage
          ? isActive
            ? 'bg-white/20 text-white'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
          : isActive
          ? 'bg-red-50 text-red-500'
          : 'text-gray-400 hover:bg-gray-100 hover:text-red-500'
      } ${toggleReactionMutation.isPending ? 'opacity-50 cursor-wait' : 'hover:scale-110'}`}
      aria-label={isActive ? `${MESSAGE_UI_TEXT.REACTION_LIKE} 취소` : MESSAGE_UI_TEXT.REACTION_LIKE}
    >
      <Heart
        className={`h-4 w-4 transition-all duration-300 ${
          isActive ? 'fill-current scale-125' : 'scale-100'
        }`}
      />
      {count > 0 && <span className="text-xs font-medium">{count}</span>}
    </button>
  );
}
