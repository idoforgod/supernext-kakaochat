import type { AppContext } from '@/backend/hono/context';
import { success, failure, type HandlerResult } from '@/backend/http/response';
import { MessageErrorCode } from './error';
import { ChatRoomErrorCode } from '@/features/chat-rooms/backend/error';
import type { Message, SendMessageBody } from './schema';
import { MESSAGE_LIST_DEFAULT_LIMIT } from '../constants/validation';

export interface GetMessagesParams {
  roomId: number;
  limit?: number;
  before?: number;
}

export interface SendMessageParams {
  roomId: number;
  content: string;
  userId: number;
  parentMessageId?: number;
}

export async function getMessagesService(
  params: GetMessagesParams,
  c: AppContext
): Promise<HandlerResult<{ messages: Message[]; pagination: { total: number; hasMore: boolean } }, string>> {
  const { roomId, limit = MESSAGE_LIST_DEFAULT_LIMIT, before } = params;
  const supabase = c.get('supabase');
  const logger = c.get('logger');

  try {
    let query = supabase
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
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .limit(limit + 1);

    if (before) {
      query = query.lt('id', before);
    }

    const { data: messagesData, error } = await query;

    if (error) {
      logger.error('Failed to fetch messages', error);
      return failure(
        MessageErrorCode.MESSAGE_FETCH_FAILED.statusCode,
        MessageErrorCode.MESSAGE_FETCH_FAILED.code,
        MessageErrorCode.MESSAGE_FETCH_FAILED.message
      );
    }

    const hasMore = messagesData.length > limit;
    const messages = (hasMore ? messagesData.slice(0, limit) : messagesData).map((msg: any) => ({
      id: msg.id,
      roomId: msg.room_id,
      userId: msg.user_id,
      user: {
        id: msg.users.id,
        nickname: msg.users.nickname,
      },
      content: msg.content,
      parentMessageId: msg.parent_message_id,
      createdAt: msg.created_at,
    }));

    // 최신순으로 정렬 (DB에서는 내림차순으로 가져오지만 클라이언트에는 오름차순으로)
    messages.reverse();

    return success({
      messages,
      pagination: {
        total: messages.length,
        hasMore,
      },
    });
  } catch (err) {
    logger.error('Unexpected error during message fetch', err);
    return failure(
      MessageErrorCode.INTERNAL_SERVER_ERROR.statusCode,
      MessageErrorCode.INTERNAL_SERVER_ERROR.code,
      MessageErrorCode.INTERNAL_SERVER_ERROR.message
    );
  }
}

export async function sendMessageService(
  params: SendMessageParams,
  c: AppContext
): Promise<HandlerResult<Message, string>> {
  const { roomId, content, userId, parentMessageId } = params;
  const supabase = c.get('supabase');
  const logger = c.get('logger');

  try {
    // 1. 채팅방 존재 여부 확인
    const { data: room, error: roomError } = await supabase
      .from('chat_rooms')
      .select('id')
      .eq('id', roomId)
      .maybeSingle();

    if (roomError || !room) {
      logger.error('Room not found', { roomId, error: roomError });
      return failure(
        ChatRoomErrorCode.ROOM_NOT_FOUND.statusCode,
        ChatRoomErrorCode.ROOM_NOT_FOUND.code,
        ChatRoomErrorCode.ROOM_NOT_FOUND.message
      );
    }

    // 2. 원본 메시지 존재 여부 확인 (답장인 경우)
    if (parentMessageId) {
      const { data: parentMessage, error: parentError } = await supabase
        .from('messages')
        .select('id, room_id')
        .eq('id', parentMessageId)
        .maybeSingle();

      if (parentError || !parentMessage) {
        logger.error('Parent message not found', { parentMessageId, error: parentError });
        return failure(
          MessageErrorCode.PARENT_MESSAGE_NOT_FOUND.statusCode,
          MessageErrorCode.PARENT_MESSAGE_NOT_FOUND.code,
          MessageErrorCode.PARENT_MESSAGE_NOT_FOUND.message
        );
      }

      // 원본 메시지와 동일한 채팅방인지 확인
      if (parentMessage.room_id !== roomId) {
        logger.error('Parent message room mismatch', { parentMessageId, roomId, parentRoomId: parentMessage.room_id });
        return failure(
          MessageErrorCode.INVALID_PARENT_MESSAGE.statusCode,
          MessageErrorCode.INVALID_PARENT_MESSAGE.code,
          MessageErrorCode.INVALID_PARENT_MESSAGE.message
        );
      }
    }

    // 3. 메시지 저장
    const { data: messageData, error: insertError } = await supabase
      .from('messages')
      .insert({
        room_id: roomId,
        user_id: userId,
        content: content.trim(),
        parent_message_id: parentMessageId || null,
      })
      .select(
        `
        id,
        room_id,
        user_id,
        content,
        parent_message_id,
        created_at
      `
      )
      .single();

    if (insertError || !messageData) {
      logger.error('Failed to insert message', { error: insertError });
      return failure(
        MessageErrorCode.DB_SAVE_FAILED.statusCode,
        MessageErrorCode.DB_SAVE_FAILED.code,
        MessageErrorCode.DB_SAVE_FAILED.message
      );
    }

    // 4. 사용자 정보 조회
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, nickname')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      logger.error('Failed to fetch user info', { userId, error: userError });
      return failure(
        MessageErrorCode.INTERNAL_SERVER_ERROR.statusCode,
        MessageErrorCode.INTERNAL_SERVER_ERROR.code,
        MessageErrorCode.INTERNAL_SERVER_ERROR.message
      );
    }

    // 5. 완전한 메시지 객체 생성
    const message: Message = {
      id: messageData.id,
      roomId: messageData.room_id,
      userId: messageData.user_id,
      user: {
        id: userData.id,
        nickname: userData.nickname,
      },
      content: messageData.content,
      parentMessageId: messageData.parent_message_id,
      createdAt: messageData.created_at,
    };

    return success(message);
  } catch (err) {
    logger.error('Unexpected error during message send', err);
    return failure(
      MessageErrorCode.INTERNAL_SERVER_ERROR.statusCode,
      MessageErrorCode.INTERNAL_SERVER_ERROR.code,
      MessageErrorCode.INTERNAL_SERVER_ERROR.message
    );
  }
}
