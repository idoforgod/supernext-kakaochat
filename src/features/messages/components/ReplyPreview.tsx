'use client';

import { X } from 'lucide-react';
import { MESSAGE_UI_TEXT } from '../constants/text';
import type { Message } from '../backend/schema';

interface ReplyPreviewProps {
  parentMessage: Message;
  onCancel: () => void;
}

export function ReplyPreview({ parentMessage, onCancel }: ReplyPreviewProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-700 mb-1">
          {MESSAGE_UI_TEXT.REPLYING_TO}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{parentMessage.user.nickname}</span>
          <span className="mx-1">·</span>
          <span className="truncate">
            {parentMessage.content.length > 50
              ? `${parentMessage.content.slice(0, 50)}...`
              : parentMessage.content}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="flex-shrink-0 rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
        aria-label={MESSAGE_UI_TEXT.REPLY_CANCEL}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
