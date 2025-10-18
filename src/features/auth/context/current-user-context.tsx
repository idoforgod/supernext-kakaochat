"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { match, P } from "ts-pattern";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import type {
  CurrentUserContextValue,
  CurrentUserSnapshot,
} from "../types";

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

type CurrentUserProviderProps = {
  children: ReactNode;
  initialState: CurrentUserSnapshot;
};

export const CurrentUserProvider = ({
  children,
  initialState,
}: CurrentUserProviderProps) => {
  const queryClient = useQueryClient();
  const [snapshot, setSnapshot] = useState<CurrentUserSnapshot>(initialState);

  const refresh = useCallback(async () => {
    setSnapshot((prev) => ({ status: "loading", user: prev.user }));
    const supabase = getSupabaseBrowserClient();

    try {
      const result = await supabase.auth.getUser();

      if (result.data.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('nickname')
          .eq('id', result.data.user.id)
          .maybeSingle();

        const nickname: string = (userData as { nickname?: string } | null)?.nickname ?? '';

        const nextSnapshot: CurrentUserSnapshot = {
          status: "authenticated",
          user: {
            id: result.data.user.id,
            email: result.data.user.email,
            nickname,
            appMetadata: result.data.user.app_metadata ?? {},
            userMetadata: result.data.user.user_metadata ?? {},
          },
        };

        setSnapshot(nextSnapshot);
        queryClient.setQueryData(["currentUser"], nextSnapshot);
      } else {
        const nextSnapshot: CurrentUserSnapshot = {
          status: "unauthenticated",
          user: null,
        };
        setSnapshot(nextSnapshot);
        queryClient.setQueryData(["currentUser"], nextSnapshot);
      }
    } catch (error) {
      const fallbackSnapshot: CurrentUserSnapshot = {
        status: "unauthenticated",
        user: null,
      };
      setSnapshot(fallbackSnapshot);
      queryClient.setQueryData(["currentUser"], fallbackSnapshot);
    }
  }, [queryClient]);

  const value = useMemo<CurrentUserContextValue>(() => {
    return {
      ...snapshot,
      refresh,
      isAuthenticated: snapshot.status === "authenticated",
      isLoading: snapshot.status === "loading",
    };
  }, [refresh, snapshot]);

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUserContext = () => {
  const value = useContext(CurrentUserContext);

  if (!value) {
    throw new Error("CurrentUserProvider가 트리 상단에 필요합니다.");
  }

  return value;
};
