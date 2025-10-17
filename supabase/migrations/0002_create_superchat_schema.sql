-- Migration: SuperChat 서비스 데이터베이스 스키마
-- Description: 사용자, 채팅방, 메시지, 메시지 반응 테이블 생성
-- Date: 2025-10-17

BEGIN;

-- 사용자 계정 상태를 위한 ENUM 타입 정의
DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('pending', 'active', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. 사용자 테이블 (Users)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    status user_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE users IS '서비스 사용자 정보를 저장하는 테이블';
COMMENT ON COLUMN users.status IS 'pending: 이메일 인증 대기, active: 활성, inactive: 비활성';

-- 2. 채팅방 테이블 (Chat Rooms)
CREATE TABLE IF NOT EXISTS chat_rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    creator_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE chat_rooms IS '생성된 채팅방 정보를 저장하는 테이블';
COMMENT ON COLUMN chat_rooms.creator_id IS '채팅방을 생성한 사용자의 ID';

-- 3. 메시지 테이블 (Messages)
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    parent_message_id INTEGER REFERENCES messages(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 메시지 조회 성능을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_messages_room_id_created_at ON messages (room_id, created_at DESC);

COMMENT ON TABLE messages IS '채팅방에서 주고받은 메시지를 저장하는 테이블';
COMMENT ON COLUMN messages.room_id IS '메시지가 속한 채팅방의 ID';
COMMENT ON COLUMN messages.user_id IS '메시지를 보낸 사용자의 ID';
COMMENT ON COLUMN messages.parent_message_id IS '답장한 원본 메시지의 ID. 일반 메시지는 NULL.';

-- 4. 메시지 반응 테이블 (Message Reactions)
CREATE TABLE IF NOT EXISTS message_reactions (
    message_id INTEGER NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reaction VARCHAR(50) NOT NULL DEFAULT 'like',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (message_id, user_id)
);

COMMENT ON TABLE message_reactions IS '메시지에 대한 사용자 반응(좋아요 등)을 저장하는 테이블';
COMMENT ON COLUMN message_reactions.reaction IS '반응의 종류 (확장성 고려)';

-- updated_at 자동 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- users 테이블에 updated_at 트리거 적용
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- chat_rooms 테이블에 updated_at 트리거 적용
DROP TRIGGER IF EXISTS update_chat_rooms_updated_at ON chat_rooms;
CREATE TRIGGER update_chat_rooms_updated_at
    BEFORE UPDATE ON chat_rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- messages 테이블에 updated_at 트리거 적용
DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- message_reactions 테이블에 updated_at 트리거 적용
DROP TRIGGER IF EXISTS update_message_reactions_updated_at ON message_reactions;
CREATE TRIGGER update_message_reactions_updated_at
    BEFORE UPDATE ON message_reactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS 비활성화 (CLAUDE.md 가이드라인에 따름)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions DISABLE ROW LEVEL SECURITY;

COMMIT;
