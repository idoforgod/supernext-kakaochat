import type { AppContext } from '@/backend/hono/context';
import { success, failure, type HandlerResult } from '@/backend/http/response';
import { ChatRoomErrorCode } from './error';

export interface CreateRoomParams {
  name: string;
  userId: number;
}

export async function createRoomService(
  params: CreateRoomParams,
  c: AppContext
): Promise<HandlerResult<{ id: number; name: string; creatorId: number; createdAt: string }, string>> {
  const { name, userId } = params;
  const supabase = c.get('supabase');
  const logger = c.get('logger');

  try {
    // 1. 채팅방 이름 중복 검증
    const { data: existingRoom } = await supabase
      .from('chat_rooms')
      .select('id')
      .eq('name', name)
      .maybeSingle();

    if (existingRoom) {
      logger.warn(`Room creation attempt with duplicate name: ${name}`);
      return failure(
        ChatRoomErrorCode.ROOM_NAME_DUPLICATE.statusCode,
        ChatRoomErrorCode.ROOM_NAME_DUPLICATE.code,
        ChatRoomErrorCode.ROOM_NAME_DUPLICATE.message
      );
    }

    // 2. 채팅방 생성
    const { data: newRoom, error: insertError } = await supabase
      .from('chat_rooms')
      .insert({
        name,
        creator_id: userId,
      })
      .select('id, name, creator_id, created_at')
      .single();

    if (insertError || !newRoom) {
      logger.error('Failed to create chat room', insertError);
      return failure(
        ChatRoomErrorCode.DB_ERROR.statusCode,
        ChatRoomErrorCode.DB_ERROR.code,
        ChatRoomErrorCode.DB_ERROR.message
      );
    }

    logger.info(`New chat room created: ${name} by user ${userId}`);

    return success(
      {
        id: newRoom.id,
        name: newRoom.name,
        creatorId: newRoom.creator_id,
        createdAt: newRoom.created_at,
      },
      201
    );
  } catch (err) {
    logger.error('Unexpected error during room creation', err);
    return failure(
      ChatRoomErrorCode.INTERNAL_SERVER_ERROR.statusCode,
      ChatRoomErrorCode.INTERNAL_SERVER_ERROR.code,
      ChatRoomErrorCode.INTERNAL_SERVER_ERROR.message
    );
  }
}

export async function getRoomDetailService(
  roomId: number,
  c: AppContext
): Promise<HandlerResult<{ id: number; name: string; creatorId: number; createdAt: string }, string>> {
  const supabase = c.get('supabase');
  const logger = c.get('logger');

  try {
    const { data: room, error } = await supabase
      .from('chat_rooms')
      .select('id, name, creator_id, created_at')
      .eq('id', roomId)
      .maybeSingle();

    if (error || !room) {
      logger.warn(`Room not found: ${roomId}`);
      return failure(
        ChatRoomErrorCode.ROOM_NOT_FOUND.statusCode,
        ChatRoomErrorCode.ROOM_NOT_FOUND.code,
        ChatRoomErrorCode.ROOM_NOT_FOUND.message
      );
    }

    return success({
      id: room.id,
      name: room.name,
      creatorId: room.creator_id,
      createdAt: room.created_at,
    });
  } catch (err) {
    logger.error('Unexpected error during room detail fetch', err);
    return failure(
      ChatRoomErrorCode.INTERNAL_SERVER_ERROR.statusCode,
      ChatRoomErrorCode.INTERNAL_SERVER_ERROR.code,
      ChatRoomErrorCode.INTERNAL_SERVER_ERROR.message
    );
  }
}
