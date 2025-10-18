import type { AppContext } from '@/backend/hono/context';
import { success, failure, type HandlerResult } from '@/backend/http/response';
import { MessageErrorCode } from './error';
import type { Message } from './schema';
import { MESSAGE_LIST_DEFAULT_LIMIT } from '../constants/validation';

export interface GetMessagesParams {
  roomId: number;
  limit?: number;
  before?: number;
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
