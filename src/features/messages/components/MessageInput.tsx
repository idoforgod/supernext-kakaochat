'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSendMessage } from '@/features/messages/hooks/useSendMessage';
import { useToast } from '@/hooks/use-toast';
import { MESSAGE_UI_TEXT } from '@/features/messages/constants/text';
import { MESSAGE_CONTENT_MAX_LENGTH } from '@/features/messages/constants/validation';
import { ReplyPreview } from './ReplyPreview';
import type { Message } from '@/features/messages/lib/dto';

interface MessageInputProps {
  roomId: number;
  replyingTo: Message | null;
  onCancelReply: () => void;
}

export function MessageInput({ roomId, replyingTo, onCancelReply }: MessageInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const sendMessageMutation = useSendMessage();

  const handleSend = async () => {
    const trimmedContent = content.trim();

    // 빈 메시지 검증
    if (!trimmedContent) {
      return;
    }

    // 길이 검증
    if (trimmedContent.length > MESSAGE_CONTENT_MAX_LENGTH) {
      toast({
        variant: 'destructive',
        title: MESSAGE_UI_TEXT.ERROR_MESSAGE_TOO_LONG,
      });
      return;
    }

    try {
      await sendMessageMutation.mutateAsync({
        roomId,
        content: trimmedContent,
        parentMessageId: replyingTo?.id,
      });

      // 전송 성공 시 입력 필드 초기화 및 답장 모드 해제
      setContent('');
      onCancelReply();

      // 포커스 유지
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (error: any) {
      const errorCode = error?.response?.data?.error?.code;
      let errorMessage: string = MESSAGE_UI_TEXT.ERROR_SEND_FAILED;

      if (errorCode === 'MESSAGE_TOO_LONG') {
        errorMessage = MESSAGE_UI_TEXT.ERROR_MESSAGE_TOO_LONG;
      } else if (errorCode === 'MESSAGE_EMPTY') {
        errorMessage = MESSAGE_UI_TEXT.ERROR_MESSAGE_EMPTY;
      } else if (errorCode === 'ROOM_NOT_FOUND') {
        errorMessage = MESSAGE_UI_TEXT.ERROR_ROOM_NOT_FOUND;
      } else if (errorCode === 'UNAUTHORIZED') {
        errorMessage = MESSAGE_UI_TEXT.ERROR_UNAUTHORIZED;
      } else if (errorCode === 'PARENT_MESSAGE_NOT_FOUND') {
        errorMessage = MESSAGE_UI_TEXT.ERROR_PARENT_MESSAGE_NOT_FOUND;
      } else if (errorCode === 'INVALID_PARENT_MESSAGE') {
        errorMessage = MESSAGE_UI_TEXT.ERROR_INVALID_PARENT_MESSAGE;
      }

      toast({
        variant: 'destructive',
        title: errorMessage,
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter 키로 전송 (Shift+Enter는 줄바꿈)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDisabled = sendMessageMutation.isPending || !content.trim();

  return (
    <div className="bg-white border-t px-6 py-4">
      {/* 답장 프리뷰 */}
      {replyingTo && (
        <div className="mb-3">
          <ReplyPreview parentMessage={replyingTo} onCancel={onCancelReply} />
        </div>
      )}

      <div className="flex gap-2 items-end">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={MESSAGE_UI_TEXT.INPUT_PLACEHOLDER}
          disabled={sendMessageMutation.isPending}
          className="min-h-[60px] max-h-[120px] resize-none"
          rows={2}
        />
        <Button
          onClick={handleSend}
          disabled={isDisabled}
          className="px-6"
        >
          {sendMessageMutation.isPending
            ? MESSAGE_UI_TEXT.INPUT_SENDING
            : MESSAGE_UI_TEXT.BUTTON_SEND}
        </Button>
      </div>
      {content.length > MESSAGE_CONTENT_MAX_LENGTH * 0.9 && (
        <p className="text-xs text-gray-500 mt-1">
          {content.length} / {MESSAGE_CONTENT_MAX_LENGTH}
        </p>
      )}
    </div>
  );
}
