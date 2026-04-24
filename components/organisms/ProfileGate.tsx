import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { useMemberSession } from '../../contexts/MemberSessionContext';
import { fetchProfileById } from '../../lib/memberAuth';
import { mapDbToProfileData } from '../../lib/profileMapper';
import ProfileSection from './ProfileSection';
import SessionDebugBanner from './SessionDebugBanner';

function buildFallbackProfile(session: { email?: string | null; status?: 'activo' | 'offline'; profilePhotoUrl?: string | null }) {
  return {
    username: session.email?.split('@')[0] ?? 'Miembro',
    role: 'MIEMBRO',
    status: session.status === 'activo' ? 'ACTIVO' : 'INACTIVO',
    avatar_url: session.profilePhotoUrl ?? null,
  };
}

function buildGuestProfile() {
  return {
    username: 'Visitante',
    role: 'INVITADO',
    status: 'ACTIVO' as const,
    rank: 'INVITADO' as const,
    projects: null,
    commits: null,
    avatar_url: null,
  };
}

export default function ProfileGate() {
  const router = useRouter();
  const { session, setSession, loading } = useMemberSession();
  const [profileData, setProfileData] = React.useState<any>(null);
  const [fetching, setFetching] = React.useState(false);

  React.useEffect(() => {
    if (loading) return;
    if (!session) {
      setProfileData(buildGuestProfile());
      return;
    }

    (async () => {
      if (!session.profileId) {
        setProfileData(buildFallbackProfile(session));
        return;
      }

      setFetching(true);
      try {
        const dbProfile = await fetchProfileById(session.profileId);
        if (!dbProfile) {
          setProfileData(buildFallbackProfile(session));
          return;
        }

        setProfileData({
          username: dbProfile.display_name ?? dbProfile.username ?? (session.email?.split('@')[0] ?? 'Miembro'),
          role: dbProfile.role ?? 'MIEMBRO',
          status: session.status === 'activo' ? 'ACTIVO' : 'INACTIVO',
          avatar_url: dbProfile.avatar_url ?? session.profilePhotoUrl ?? null,
        });
      } catch (e: any) {
        Alert.alert('Error', e?.message ?? 'No se pudo cargar el perfil');
      } finally {
        setFetching(false);
      }
    })();
  }, [loading, session, router]);

  if (loading || fetching) {
    return (
      <View className="flex-1">
        <SessionDebugBanner />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={COLORS.purpleStrong} />
        </View>
      </View>
    );
  }

  const data = mapDbToProfileData(profileData ?? {});
  const isGuest = !session;

  return (
    <View className="flex-1">
      <SessionDebugBanner />
      <ProfileSection
        data={data}
        onEditProfile={isGuest ? undefined : () => router.push('/edit-profile')}
        onSignOut={isGuest ? undefined : () => {
          setSession(null);
          router.replace('/login');
        }}
      />
    </View>
  );
}
