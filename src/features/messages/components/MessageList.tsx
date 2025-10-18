'use client';

import type { Message } from '@/features/messages/lib/dto';
import { MESSAGE_UI_TEXT } from '@/features/messages/constants/text';

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>{MESSAGE_UI_TEXT.EMPTY_MESSAGE}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.map((message) => {
        const isOwnMessage = currentUserId && message.userId.toString() === currentUserId;

        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                isOwnMessage
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {!isOwnMessage && (
                <p className="text-xs font-semibold mb-1">{message.user.nickname}</p>
              )}
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${isOwnMessage ? 'text-white/70' : 'text-gray-500'}`}>
                {new Date(message.createdAt).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
