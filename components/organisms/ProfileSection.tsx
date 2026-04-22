import { Brush, Earth, MonitorPlay, Music4, Shell } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import AstraAvatar from '../atoms/AstraAvatar';
import AstraBadge from '../atoms/AstraBadge';
import AstraButton from '../atoms/AstraButton';
import AstraDivider from '../atoms/AstraDivider';
import GlowText from '../atoms/GlowText';
import StarField from '../atoms/StarField';

// ── Tipos ─────────────────────────────────────────────────────────────────────
type UserStatus = 'ACTIVO' | 'INACTIVO';
type UserRank   = 'INVITADO' | 'FUNDADOR' | 'QA' | 'ARTISTA' | 'COMPOSITOR';

export interface ProfileData {
  username:  string;
  role:      string;
  status:    UserStatus;
  rank:      UserRank;
  projects:  number | null;   // null = cargando / sin dato aún
  commits:   number | null;
  avatarUrl?: string | null;
}

interface ProfileSectionProps {
  data?:          ProfileData;
  onEditProfile?: () => void;
  onSignOut?:     () => void;
}

// ── Constantes ────────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<UserStatus, string> = {
  ACTIVO:   '#4ADE80',
  INACTIVO: '#F87171',
};

const RANK_CONFIG: Record<UserRank, {icon: React.ReactNode; color: string }> = {
  INVITADO: {
    icon: <Earth size={25} color={COLORS.yellowPale} />,
    color: COLORS.yellowPale,
  },
  FUNDADOR: {
    icon: <Shell size={25} color={COLORS.yellowPale} />,
    color: COLORS.yellowPale,
  },
  QA: {
    icon: <MonitorPlay size={25} color={COLORS.yellowPale} />,
    color: COLORS.yellowPale,
  },
  ARTISTA: {
    icon: <Brush size={25} color={COLORS.yellowPale} />,
    color: COLORS.yellowPale,
  },
  COMPOSITOR: {
    icon: <Music4 size={25} color={COLORS.yellowPale} />,
    color: COLORS.yellowPale,
  }
};

const DEFAULT_DATA: ProfileData = {
  username: 'Username',
  role:     'SCRIPTER',
  status:   'ACTIVO',
  rank:     'INVITADO',
  projects: null,
  commits:  null,
};

// ── Componente ────────────────────────────────────────────────────────────────
const ProfileSection: React.FC<ProfileSectionProps> = ({
  data          = DEFAULT_DATA,
  onEditProfile,
  onSignOut,
}) => {
  const rankCfg = RANK_CONFIG[data.rank];

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 64 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Banner */}
      <View
        className="overflow-hidden border-b border-purple-alpha-30 bg-background-elevated"
        style={{ height: 160 }}
      >
        <StarField />
        {[0.2, 0.5, 0.75].map((top, i) => (
          <View
            key={i}
            className="absolute left-0 right-0 h-px bg-purple-strong"
            style={{ top: `${top * 100}%`, opacity: 0.15 - i * 0.03 }}
          />
        ))}
      </View>

      {/* Avatar */}
      <View className="items-center" style={{ marginTop: -42, marginBottom: 16 }}>
        <AstraAvatar uri={data.avatarUrl ?? undefined} initials="US" size="lg" ring />
      </View>

      {/* Info */}
      <View className="items-center px-6" style={{ gap: 4 }}>
        <GlowText variant="title" glow>{data.username}</GlowText>
        <GlowText variant="caption" color={COLORS.whiteAlpha40}>
          MIEMBRO DE ASTRAEOUS
        </GlowText>

        <View className="flex-row" style={{ gap: 8, marginTop: 4 }}>
          {/* Rol */}
          <AstraBadge label={data.role} variant="role" />

          {/* Status — verde o rojo */}
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical:   3,
              borderRadius:      4,
              backgroundColor:   `${STATUS_COLORS[data.status]}20`,
              borderWidth:       1,
              borderColor:       STATUS_COLORS[data.status],
            }}
          >
            <GlowText
              variant="caption"
              style={{ fontSize: 10, fontWeight: '700', color: STATUS_COLORS[data.status] }}
            >
              {data.status}
            </GlowText>
          </View>
        </View>
      </View>

      <AstraDivider variant="glow" style={{ marginHorizontal: 24 }} />

      {/* Stats */}
      <View className="flex-row justify-around px-6" style={{ paddingVertical: 16 }}>

        {/* Proyectos */}
        <View className="items-center" style={{ gap: 4 }}>
          <GlowText variant="title" glow>
            {data.projects !== null ? String(data.projects) : '—'}
          </GlowText>
          <GlowText variant="caption" color={COLORS.whiteAlpha40}>PROYECTOS</GlowText>
        </View>

        {/* Commits */}
        <View className="items-center" style={{ gap: 4 }}>
          <GlowText variant="title" glow>
            {data.commits !== null ? String(data.commits) : '—'}
          </GlowText>
          <GlowText variant="caption" color={COLORS.whiteAlpha40}>COMMITS</GlowText>
        </View>

        {/* Rango */}
        <View className="items-center" style={{ gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            {rankCfg.icon}
            <GlowText variant="title" style={{ color: rankCfg.color }}>
            </GlowText>
          </View>
          <GlowText variant="caption" color={COLORS.whiteAlpha40}>RANGO</GlowText>
        </View>

      </View>

      <AstraDivider variant="line" style={{ marginHorizontal: 24 }} />

      {/* Acciones */}
      <View className="px-6" style={{ gap: 16, marginTop: 16 }}>
        <AstraButton
          label="EDITAR PERFIL"
          variant="secondary"
          fullWidth
          onPress={onEditProfile}
        />
        <AstraButton
          label="CERRAR SESIÓN"
          variant="danger"
          fullWidth
          onPress={onSignOut}
        />
      </View>
    </ScrollView>
  );
};

export default ProfileSection;