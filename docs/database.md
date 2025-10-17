## SuperChat 서비스 데이터베이스 설계 (최종본)

확정된 유저플로우를 기반으로, SuperChat 서비스의 백엔드 기능을 지원하기 위한 데이터베이스의 데이터플로우와 스키마를 다음과 같이 정의합니다.

### **1. 데이터베이스 관점의 데이터플로우**

각 유저플로우가 데이터베이스의 테이블과 상호작용하는 방식을 CRUD(Create, Read, Update, Delete) 관점에서 기술합니다.

*   **1. 사용자 회원가입**
    *   **Read**: `users` 테이블에서 요청된 닉네임/이메일이 존재하는지 `SELECT`하여 중복을 확인합니다.
    *   **Create**: 모든 검증 통과 시, 해시된 비밀번호와 함께 `users` 테이블에 새로운 레코드를 `INSERT`합니다 (`status`는 'pending').

*   **2. 사용자 로그인**
    *   **Read**: `users` 테이블에서 요청된 이메일로 사용자를 `SELECT`하고, 계정 `status`와 `password_hash`를 확인합니다.

*   **3. 새로운 채팅방 생성**
    *   **Read**: `chat_rooms` 테이블에서 요청된 이름이 존재하는지 `SELECT`하여 중복을 확인합니다.
    *   **Create**: 검증 통과 시, `chat_rooms` 테이블에 새로운 레코드를 `INSERT`합니다.

*   **4. 기존 채팅방 입장**
    *   **Read**: `chat_rooms` 테이블과 `messages` 테이블을 `JOIN`하여 특정 채팅방의 정보와 메시지 목록을 `SELECT`합니다.

*   **5. 메시지 전송**
    *   **Create**: `messages` 테이블에 새로운 메시지 레코드를 `INSERT`합니다.

*   **6. 메시지에 답장하기**
    *   **Read**: `messages` 테이블에서 답장할 원본 메시지가 유효한지 `SELECT`하여 확인합니다.
    *   **Create**: `messages` 테이블에 `parent_message_id`를 포함한 새로운 메시지 레코드를 `INSERT`합니다.

*   **7. 메시지에 반응하기**
    *   **Read**: `message_reactions` 테이블에서 해당 유저가 해당 메시지에 이미 반응했는지 `SELECT`하여 확인합니다.
    *   **Create**: 기존 반응이 없으면 `message_reactions` 테이블에 레코드를 `INSERT`합니다.
    *   **Delete**: 기존 반응이 있으면 `message_reactions` 테이블에서 해당 레코드를 `DELETE`합니다.

*   **8. 닉네임 변경**
    *   **Read**: `users` 테이블에서 변경할 닉네임이 존재하는지 `SELECT`하여 중복을 확인합니다.
    *   **Update**: 검증 통과 시, `users` 테이블에서 특정 사용자의 `nickname` 필드를 `UPDATE`합니다.

---

### **2. 데이터베이스 스키마 (PostgreSQL)**

위 데이터플로우를 구현하기 위한 최소 스펙의 PostgreSQL 데이터베이스 스키마입니다.

```sql
-- 사용자 계정 상태를 위한 ENUM 타입 정의
CREATE TYPE user_status AS ENUM ('pending', 'active', 'inactive');

-- 1. 사용자 테이블 (Users)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    status user_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE users IS '서비스 사용자 정보를 저장하는 테이블';
COMMENT ON COLUMN users.status IS 'pending: 이메일 인증 대기, active: 활성, inactive: 비활성';


-- 2. 채팅방 테이블 (Chat Rooms)
CREATE TABLE chat_rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    creator_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE chat_rooms IS '생성된 채팅방 정보를 저장하는 테이블';
COMMENT ON COLUMN chat_rooms.creator_id IS '채팅방을 생성한 사용자의 ID';


-- 3. 메시지 테이블 (Messages)
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    parent_message_id INTEGER REFERENCES messages(id), -- 답장을 위한 자기 참조 관계
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_room_id_created_at ON messages (room_id, created_at DESC);

COMMENT ON TABLE messages IS '채팅방에서 주고받은 메시지를 저장하는 테이블';
COMMENT ON COLUMN messages.room_id IS '메시지가 속한 채팅방의 ID';
COMMENT ON COLUMN messages.user_id IS '메시지를 보낸 사용자의 ID';
COMMENT ON COLUMN messages.parent_message_id IS '답장한 원본 메시지의 ID. 일반 메시지는 NULL.';


-- 4. 메시지 반응 테이블 (Message Reactions)
CREATE TABLE message_reactions (
    message_id INTEGER NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reaction VARCHAR(50) NOT NULL DEFAULT 'like', -- 현재는 'like'만 사용
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (message_id, user_id) -- 한 사용자는 한 메시지에 하나의 반응만 할 수 있도록 제약
);

COMMENT ON TABLE message_reactions IS '메시지에 대한 사용자 반응(좋아요 등)을 저장하는 테이블';
COMMENT ON COLUMN message_reactions.reaction IS '반응의 종류 (확장성 고려)';

```