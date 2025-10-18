'use client';

import { Reply } from 'lucide-react';
import type { Message } from '@/features/messages/lib/dto';
import { MESSAGE_UI_TEXT } from '@/features/messages/constants/text';
import { ReactionButton } from './ReactionButton';

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  onReply?: (message: Message) => void;
}

export function MessageList({ messages, currentUserId, onReply }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>{MESSAGE_UI_TEXT.EMPTY_MESSAGE}</p>
      </div>
    );
  }

  const getParentMessage = (parentId: number | null) => {
    if (!parentId) return null;
    return messages.find((msg) => msg.id === parentId);
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.map((message) => {
        const isOwnMessage = currentUserId && message.userId.toString() === currentUserId;
        const parentMessage = getParentMessage(message.parentMessageId);

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

              {/* 답장 대상 표시 */}
              {parentMessage && (
                <div
                  className={`mb-2 rounded border-l-2 pl-2 py-1 text-xs ${
                    isOwnMessage
                      ? 'border-white/30 bg-white/10'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <p
                    className={`font-medium ${
                      isOwnMessage ? 'text-white/90' : 'text-gray-700'
                    }`}
                  >
                    {MESSAGE_UI_TEXT.REPLY_TO.replace('님에게', `${parentMessage.user.nickname}님에게`)}
                  </p>
                  <p
                    className={`truncate ${
                      isOwnMessage ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {parentMessage.content.length > 30
                      ? `${parentMessage.content.slice(0, 30)}...`
                      : parentMessage.content}
                  </p>
                </div>
              )}

              <p className="text-sm">{message.content}</p>

              <div className="flex items-center justify-between mt-1">
                <p className={`text-xs ${isOwnMessage ? 'text-white/70' : 'text-gray-500'}`}>
                  {new Date(message.createdAt).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>

                <div className="flex items-center gap-1">
                  {/* 반응 버튼 */}
                  <ReactionButton
                    messageId={message.id}
                    initialCount={message.reactionCount || 0}
                    initialIsActive={message.hasUserReacted || false}
                    isOwnMessage={isOwnMessage}
                  />

                  {/* 답장 버튼 */}
                  {onReply && (
                    <button
                      type="button"
                      onClick={() => onReply(message)}
                      className={`rounded p-1 transition-colors ${
                        isOwnMessage
                          ? 'text-white/70 hover:bg-white/20 hover:text-white'
                          : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                      }`}
                      aria-label={MESSAGE_UI_TEXT.REPLY_TO}
                    >
                      <Reply className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
