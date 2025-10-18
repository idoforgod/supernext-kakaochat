'use client';

import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Message } from '@/features/messages/lib/dto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface ReactionUpdate {
  messageId: number;
  reactionCount: number;
  hasUserReacted: boolean;
}

interface UseRealtimeMessagesParams {
  roomId: number;
  currentUserId?: number;
  onNewMessage: (message: Message) => void;
  onUpdateMessage: (message: Message) => void;
  onReactionUpdate?: (update: ReactionUpdate) => void;
}

export function useRealtimeMessages({
  roomId,
  currentUserId,
  onNewMessage,
  onUpdateMessage,
  onReactionUpdate,
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
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
        },
        async (payload) => {
          if (!onReactionUpdate) return;

          // INSERT 또는 DELETE된 반응의 메시지 ID
          const messageId = (payload.new as any)?.message_id || (payload.old as any)?.message_id;

          if (!messageId) return;

          // 해당 메시지가 현재 채팅방의 메시지인지 확인
          const { data: messageData } = await supabase
            .from('messages')
            .select('room_id')
            .eq('id', messageId)
            .single();

          if (!messageData || messageData.room_id !== roomId) return;

          // 총 반응 개수 조회
          const { count: reactionCount } = await supabase
            .from('message_reactions')
            .select('*', { count: 'exact', head: true })
            .eq('message_id', messageId);

          // 현재 사용자의 반응 여부 조회
          let hasUserReacted = false;
          if (currentUserId) {
            const { data: userReaction } = await supabase
              .from('message_reactions')
              .select('*')
              .eq('message_id', messageId)
              .eq('user_id', currentUserId)
              .maybeSingle();

            hasUserReacted = !!userReaction;
          }

          onReactionUpdate({
            messageId,
            reactionCount: reactionCount || 0,
            hasUserReacted,
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [roomId, currentUserId, onNewMessage, onUpdateMessage, onReactionUpdate]);
}
