import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import AstraButton from '../atoms/AstraButton';
import AstraDivider from '../atoms/AstraDivider';
import GlowText from '../atoms/GlowText';
import StarField from '../atoms/StarField';
import AstraHeader from '../molecules/ AstraHeader';
import MemberLoginForm from './MemberLoginForm';
import { useMemberSession } from '../../contexts/MemberSessionContext';
import { memberLogin } from '../../lib/memberAuth';

type LoginMode = 'guest' | 'member';

function LoginModeTabs({
  mode,
  onChange,
}: {
  mode: LoginMode;
  onChange: (m: LoginMode) => void;
}) {
  return (
    <View className="flex-row overflow-hidden rounded-[12px] border border-white-alpha-10 bg-background-card p-1">
      {(
        [
          { key: 'guest' as const, label: 'INVITADO' },
          { key: 'member' as const, label: 'MIEMBRO' },
        ]
      ).map((t) => {
        const active = mode === t.key;
        return (
          <Pressable
            key={t.key}
            accessibilityRole="button"
            onPress={() => onChange(t.key)}
            className={
              active
                ? 'flex-1 items-center justify-center rounded-[10px] border border-purple-alpha-30 bg-purple-alpha-15 py-2'
                : 'flex-1 items-center justify-center rounded-[10px] py-2'
            }
          >
            <GlowText
              variant="caption"
              className={active ? 'text-yellow-pale' : 'text-white-alpha-40'}
            >
              {t.label}
            </GlowText>
          </Pressable>
        );
      })}
    </View>
  );
}

const LoginGate: React.FC = () => {
  const router = useRouter();
  const { setSession } = useMemberSession();
  const [mode, setMode] = React.useState<LoginMode>('guest');

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="pb-6"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Hero superior */}
      <View className="relative h-[190px] overflow-hidden border-b border-purple-alpha-30 bg-background-elevated">
        <StarField />
        <View className="absolute inset-0 bg-purple-strong opacity-[0.18]" />

        <View className="pt-3">
          <AstraHeader title="INGRESO" subtitle="ELIGE CÓMO ENTRAR" showLogo />
        </View>
      </View>

      {/* contenido */}
      <View className="mt-5 px-6" style={{ gap: 18 }}>
        <GlowText variant="body" className="text-white-alpha-80" style={{ lineHeight: 22 }}>
          Puedes entrar como invitado para explorar, o iniciar sesión si eres parte del equipo.
        </GlowText>

        {/* mini pantalla con tabs */}
        <View
          className="overflow-hidden rounded-[14px] border border-white-alpha-10 bg-background-card p-[18px]"
          style={{ gap: 16 }}
        >
          <LoginModeTabs mode={mode} onChange={setMode} />

          <AstraDivider variant="line" style={{ marginVertical: 2 }} />

          {mode === 'guest' ? (
            <View className="pt-0.5" style={{ gap: 14 }}>
              <GlowText variant="subtitle" glow>
                Ingresar como invitado
              </GlowText>
              <GlowText variant="body" className="text-white-alpha-80" style={{ lineHeight: 22 }}>
                Explora proyectos, equipo y contenido sin iniciar sesión.
              </GlowText>

              <AstraButton
                label="CONTINUAR COMO INVITADO"
                variant="primary"
                fullWidth
                onPress={() => router.replace('/(tabs)/home')}
              />

              <AstraButton
                label="SOY MIEMBRO"
                variant="ghost"
                fullWidth
                onPress={() => setMode('member')}
              />
            </View>
          ) : (
            <View className="pt-0.5" style={{ gap: 14 }}>
              <GlowText variant="subtitle" glow>
                Soy miembro
              </GlowText>

              <GlowText variant="body" className="text-white-alpha-80" style={{ lineHeight: 22 }}>
                Entra con usuario y contraseña para acceder a funciones de miembro.
              </GlowText>

              <MemberLoginForm
                onCancel={() => setMode('guest')}
                onSubmit={async ({ username, password }) => {
                  try {
                    const res = await memberLogin({ usernameOrEmail: username, password });

                    if (!res.ok) {
                      const msg =
                        res.reason === 'not_found'
                          ? 'No existe ese usuario.'
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
          )}
        </View>

        <AstraDivider variant="glow" />

        <GlowText variant="caption" className="mt-1.5 text-center text-white-alpha-40">
          ASTRAEOUS • V1.6.0
        </GlowText>
      </View>
    </ScrollView>
  );
};

export default LoginGate;
