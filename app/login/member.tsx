import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AstraDivider from '../../components/atoms/AstraDivider';
import GlowText from '../../components/atoms/GlowText';
import StarField from '../../components/atoms/StarField';
import AstraHeader from '../../components/molecules/ AstraHeader';
import MemberLoginForm from '../../components/organisms/MemberLoginForm';
import { COLORS } from '../../constants/colors';
import { useMemberSession } from '../../contexts/MemberSessionContext';
import { memberLogin } from '../../lib/memberAuth';

export default function MemberLoginScreen() {
  const router = useRouter();
  const { setSession } = useMemberSession();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1">
        <View
          className="relative overflow-hidden border-b border-purple-alpha-30 bg-background-elevated"
          style={{ height: 180 }}
        >
          <StarField />
          <View className="absolute inset-0" style={{ opacity: 0.18, backgroundColor: COLORS.purpleStrong }} />

          <View style={{ paddingTop: 12 }}>
            <AstraHeader title="MIEMBROS" subtitle="USUARIO Y CONTRASEÑA" showLogo />
          </View>
        </View>

        <View className="px-6" style={{ gap: 16, marginTop: 18 }}>
          <GlowText variant="body" color={COLORS.whiteAlpha80} style={{ lineHeight: 22 }}>
            Inicia sesión con tus credenciales de Astraeous.
          </GlowText>

          <AstraDivider variant="glow" />

          <MemberLoginForm
            onCancel={() => router.back()}
            onSubmit={async ({ username, password }) => {
              try {
                const res = await memberLogin({ usernameOrEmail: username, password });

                if (!res.ok) {
                  const msg =
                    res.reason === 'not_found'
                      ? 'No existe ese usuario (email).'
                      : res.reason === 'inactive'
                        ? 'Cuenta desactivada.'
                        : 'Contraseña incorrecta.';
                  Alert.alert('No se pudo iniciar sesión', msg);
                  return;
                }

                setSession({
                  memberId: res.member.id,
                  email: res.member.email,
                  profileId: res.member.profile_id,
                  profilePhotoUrl: res.member.profile_photo_url,
                  status: res.member.status,
                });

                router.replace('/(tabs)/home');
              } catch (e: any) {
                Alert.alert('Error', e?.message ?? 'No se pudo conectar a Supabase.');
              }
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
