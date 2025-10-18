'use client';

import { use, useCallback, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useRoomDetails } from '@/features/chat-rooms/hooks/useRoomDetails';
import { useMessages } from '@/features/messages/hooks/useMessages';
import { useRealtimeMessages } from '@/features/messages/hooks/useRealtimeMessages';
import { MessageList } from '@/features/messages/components/MessageList';
import { MessageInput } from '@/features/messages/components/MessageInput';
import { useToast } from '@/hooks/use-toast';
import { MESSAGE_UI_TEXT } from '@/features/messages/constants/text';
import type { Message } from '@/features/messages/lib/dto';

export default function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const roomId = parseInt(resolvedParams.id, 10);
  const router = useRouter();
  const { toast } = useToast();
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 유효성 검증
  useEffect(() => {
    if (isNaN(roomId) || roomId <= 0) {
      toast({
        variant: 'destructive',
        title: MESSAGE_UI_TEXT.ERROR_INVALID_ROOM_ID,
      });
      router.push('/rooms');
    }
  }, [roomId, router, toast]);

  // 채팅방 정보 조회
  const {
    data: roomData,
    isLoading: isLoadingRoom,
    error: roomError,
  } = useRoomDetails(roomId);

  // 메시지 목록 조회
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useMessages({ roomId });

  // 로컬 메시지 상태 초기화
  useEffect(() => {
    if (messagesData) {
      setLocalMessages(messagesData);
    }
  }, [messagesData]);

  // 새 메시지 핸들러
  const handleNewMessage = useCallback((message: Message) => {
    setLocalMessages((prev) => {
      // 중복 방지
      if (prev.some((m) => m.id === message.id)) {
        return prev;
      }
      return [...prev, message];
    });
  }, []);

  // 메시지 업데이트 핸들러
  const handleUpdateMessage = useCallback((message: Message) => {
    setLocalMessages((prev) =>
      prev.map((m) => (m.id === message.id ? message : m))
    );
  }, []);

  // 답장 핸들러
  const handleReply = useCallback((message: Message) => {
    setReplyingTo(message);
  }, []);

  // 답장 취소 핸들러
  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  // Realtime 구독
  useRealtimeMessages({
    roomId,
    onNewMessage: handleNewMessage,
    onUpdateMessage: handleUpdateMessage,
  });

  // 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  // 에러 처리
  useEffect(() => {
    if (roomError) {
      const errorCode = (roomError as any)?.response?.data?.error?.code;
      if (errorCode === 'ROOM_NOT_FOUND') {
        toast({
          variant: 'destructive',
          title: MESSAGE_UI_TEXT.ERROR_ROOM_NOT_FOUND,
        });
        setTimeout(() => router.push('/rooms'), 3000);
      } else if (errorCode === 'UNAUTHORIZED') {
        toast({
          variant: 'destructive',
          title: MESSAGE_UI_TEXT.ERROR_UNAUTHORIZED,
        });
        router.push('/login');
      }
    }
  }, [roomError, router, toast]);

  // 로딩 상태
  if (isLoadingRoom || isLoadingMessages) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isLoadingRoom ? MESSAGE_UI_TEXT.LOADING_ROOM : MESSAGE_UI_TEXT.LOADING_MESSAGES}
          </p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (roomError || messagesError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-red-600">
            {MESSAGE_UI_TEXT.ERROR_MESSAGE_FETCH_FAILED}
          </p>
          <Button onClick={() => router.push('/rooms')}>
            {MESSAGE_UI_TEXT.BUTTON_BACK_TO_ROOMS}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center">
        <Button
          variant="ghost"
          onClick={() => router.push('/rooms')}
          className="mr-4"
        >
          ← 뒤로
        </Button>
        <h1 className="text-xl font-semibold">{roomData?.name}</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <MessageList messages={localMessages} onReply={handleReply} />
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        roomId={roomId}
        replyingTo={replyingTo}
        onCancelReply={handleCancelReply}
      />
    </div>
  );
}
