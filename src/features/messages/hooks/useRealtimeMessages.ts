'use client';

import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Message } from '@/features/messages/lib/dto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface UseRealtimeMessagesParams {
  roomId: number;
  onNewMessage: (message: Message) => void;
  onUpdateMessage: (message: Message) => void;
}

export function useRealtimeMessages({
  roomId,
  onNewMessage,
  onUpdateMessage,
}: UseRealtimeMessagesParams) {
  useEffect(() => {
    if (!roomId || isNaN(roomId) || roomId <= 0) {
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          // 사용자 정보를 포함한 완전한 메시지 데이터 가져오기
          const { data: messageData } = await supabase
            .from('messages')
            .select(
              `
              id,
              room_id,
              user_id,
              content,
              parent_message_id,
              created_at,
              users!inner (
                id,
                nickname
              )
            `
            )
            .eq('id', payload.new.id)
            .single();

          if (messageData) {
            const message: Message = {
              id: messageData.id,
              roomId: messageData.room_id,
              userId: messageData.user_id,
              user: {
                id: (messageData.users as any).id,
                nickname: (messageData.users as any).nickname,
              },
              content: messageData.content,
              parentMessageId: messageData.parent_message_id,
              createdAt: messageData.created_at,
            };
            onNewMessage(message);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const { data: messageData } = await supabase
            .from('messages')
            .select(
              `
              id,
              room_id,
              user_id,
              content,
              parent_message_id,
              created_at,
              users!inner (
                id,
                nickname
              )
            `
            )
            .eq('id', payload.new.id)
            .single();

          if (messageData) {
            const message: Message = {
              id: messageData.id,
              roomId: messageData.room_id,
              userId: messageData.user_id,
              user: {
                id: (messageData.users as any).id,
                nickname: (messageData.users as any).nickname,
              },
              content: messageData.content,
              parentMessageId: messageData.parent_message_id,
              createdAt: messageData.created_at,
            };
            onUpdateMessage(message);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [roomId, onNewMessage, onUpdateMessage]);
}
