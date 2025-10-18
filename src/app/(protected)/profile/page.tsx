'use client';

import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { NicknameForm } from '@/features/profile/components/NicknameForm';
import { UI_TEXT } from '@/features/profile/constants/text';

type ProfilePageProps = {
  params: Promise<Record<string, never>>;
};

export default function ProfilePage({ params }: ProfilePageProps) {
  void params;
  const { user } = useCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
        <p className="text-center text-slate-500">사용자 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">{UI_TEXT.PAGE_TITLE}</h1>
        <p className="text-slate-500">{user.email}</p>
      </header>

      <section className="rounded-lg border border-slate-200 p-6">
        <h2 className="mb-4 text-lg font-medium">{UI_TEXT.SECTION_TITLE_NICKNAME}</h2>
        <NicknameForm currentNickname={user.nickname} />
      </section>
    </div>
  );
}
