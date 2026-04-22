import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

export type MemberSession = {
  memberId: string;
  email?: string | null;
  profileId?: string | null;
  profilePhotoUrl?: string | null;
  status?: 'activo' | 'offline';
};

type MemberSessionContextValue = {
  session: MemberSession | null;
  setSession: (s: MemberSession | null) => void;
  loading: boolean;
};

const STORAGE_KEY = 'astraeous.memberSession.v1';

const MemberSessionContext = React.createContext<MemberSessionContextValue | undefined>(undefined);

export function MemberSessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = React.useState<MemberSession | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setSessionState(JSON.parse(raw));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setSession = React.useCallback((s: MemberSession | null) => {
    setSessionState(s);
    if (s) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    else AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <MemberSessionContext.Provider value={{ session, setSession, loading }}>
      {children}
    </MemberSessionContext.Provider>
  );
}

export function useMemberSession() {
  const ctx = React.useContext(MemberSessionContext);
  if (!ctx) throw new Error('useMemberSession must be used within MemberSessionProvider');
  return ctx;
}
