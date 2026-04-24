import React from 'react';
import { View } from 'react-native';
import { useMemberSession } from '../../contexts/MemberSessionContext';
import GlowText from '../atoms/GlowText';

export function SessionDebugBanner() {
  const { session, loading } = useMemberSession();

  // Only show in development builds
  if (!__DEV__) return null;

  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(0,0,0,0.25)',
      }}
    >
      <GlowText variant="caption" style={{ fontSize: 10 }}>
        session: {loading ? 'loading' : session ? 'OK' : 'null'}
      </GlowText>
      {session?.email ? (
        <GlowText variant="caption" style={{ fontSize: 10 }}>
          user: {session.email}
        </GlowText>
      ) : null}
    </View>
  );
}


export default SessionDebugBanner;
