'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ROOM_UI_TEXT } from '@/features/chat-rooms/constants/text';

export default function RoomsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {ROOM_UI_TEXT.PAGE_TITLE_ROOMS}
          </h1>
          <Button onClick={() => router.push('/rooms/new')}>
            {ROOM_UI_TEXT.BUTTON_CREATE_ROOM}
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-center">
            채팅방 목록 기능은 아직 구현되지 않았습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
