import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { refreshStoredMemberSession } from '../lib/memberAuth';

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
        if (!raw) return;

        const parsed = JSON.parse(raw) as MemberSession;
        const refreshed = await refreshStoredMemberSession(parsed);

        if (refreshed) {
          setSessionState(refreshed);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(refreshed));
        } else {
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.warn('Error validando la sesión de miembro:', error);
        try {
          const raw = await AsyncStorage.getItem(STORAGE_KEY);
          if (raw) setSessionState(JSON.parse(raw));
        } catch {
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
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
