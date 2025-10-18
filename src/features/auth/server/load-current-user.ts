import "server-only";

import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { CurrentUserSnapshot } from "../types";

const mapUser = async (user: User) => {
  const supabase = await createSupabaseServerClient();

  const { data: userData } = await supabase
    .from('users')
    .select('nickname')
    .eq('id', user.id)
    .maybeSingle();

  const nickname: string = (userData as { nickname?: string } | null)?.nickname ?? '';

  return {
    id: user.id,
    email: user.email,
    nickname,
    appMetadata: user.app_metadata ?? {},
    userMetadata: user.user_metadata ?? {},
  };
};

export const loadCurrentUser = async (): Promise<CurrentUserSnapshot> => {
  const supabase = await createSupabaseServerClient();
  const result = await supabase.auth.getUser();
  const user = result.data.user;

  if (user) {
    return {
      status: "authenticated",
      user: await mapUser(user),
    };
  }

  return { status: "unauthenticated", user: null };
};
