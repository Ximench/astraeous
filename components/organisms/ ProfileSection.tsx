import { Brush, Earth, MonitorPlay, Music4, Shell, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
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
  projects:  number | null;
  commits:   number | null;
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

const RANK_CONFIG: Record<UserRank, { icon: React.ReactNode; color: string; description: string }> = {
  INVITADO: {
    icon:        <Earth size={25} color={COLORS.yellowPale} />,
    color:       COLORS.yellowPale,
    description: 'Usuario recién unido a Astraeous. Está conociendo el grupo y sus proyectos.',
  },
  FUNDADOR: {
    icon:        <Shell size={25} color={COLORS.yellowPale} />,
    color:       COLORS.yellowPale,
    description: 'Miembro fundador del grupo. Forma parte del núcleo original de Astraeous.',
  },
  QA: {
    icon:        <MonitorPlay size={25} color={COLORS.yellowPale} />,
    color:       COLORS.yellowPale,
    description: 'Encargado de probar y verificar la calidad de los proyectos antes de su lanzamiento.',
  },
  ARTISTA: {
    icon:        <Brush size={25} color={COLORS.yellowPale} />,
    color:       COLORS.yellowPale,
    description: 'Responsable del arte visual del grupo: ilustraciones, modelos y diseño gráfico.',
  },
  COMPOSITOR: {
    icon:        <Music4 size={25} color={COLORS.yellowPale} />,
    color:       COLORS.yellowPale,
    description: 'Crea la música y efectos de sonido para los proyectos de Astraeous.',
  },
};

// Lista ordenada para el modal
const RANK_LIST = Object.entries(RANK_CONFIG) as [UserRank, typeof RANK_CONFIG[UserRank]][];

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
  const [rankModalVisible, setRankModalVisible] = useState(false);
  const rankCfg = RANK_CONFIG[data.rank];

  return (
    <>
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
          <AstraAvatar initials="US" size="lg" ring />
        </View>

        {/* Info */}
        <View className="items-center px-6" style={{ gap: 4 }}>
          <GlowText variant="title" glow>{data.username}</GlowText>
          <GlowText variant="caption" color={COLORS.whiteAlpha40}>
            MIEMBRO DE ASTRAEOUS
          </GlowText>

          <View className="flex-row" style={{ gap: 8, marginTop: 4 }}>
            <AstraBadge label={data.role} variant="role" />
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

          {/* Commits */}
          <View className="items-center" style={{ gap: 4 }}>
            <GlowText variant="title" glow>
              {data.commits !== null ? String(data.commits) : '—'}
            </GlowText>
            <GlowText variant="caption" color={COLORS.whiteAlpha40}>COMMITS</GlowText>
          </View>

          {/* Rango — toca para ver info */}
          <TouchableOpacity
            className="items-center"
            style={{ gap: 4 }}
            onPress={() => setRankModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              {rankCfg.icon}
            </View>
            <GlowText variant="caption" color={COLORS.whiteAlpha40}>RANGO</GlowText>
          </TouchableOpacity>

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

      {/* ── Modal de rangos ── */}
      <Modal
        visible={rankModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRankModalVisible(false)}
      >
        {/* Fondo oscuro — toca para cerrar */}
        <Pressable
          style={{
            flex:            1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            justifyContent:  'flex-end',
          }}
          onPress={() => setRankModalVisible(false)}
        >
          {/* Contenedor del sheet — no propaga el toque al fondo */}
          <Pressable
            style={{
              backgroundColor: COLORS.backgroundCard,
              borderTopLeftRadius:  20,
              borderTopRightRadius: 20,
              borderTopWidth:       1,
              borderColor:          COLORS.purpleAlpha30,
              paddingBottom:        40,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Handle + header */}
            <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
              <View
                style={{
                  width:           40,
                  height:          4,
                  borderRadius:    2,
                  backgroundColor: COLORS.whiteAlpha10,
                  marginBottom:    16,
                }}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, width: '100%' }}>
                <GlowText variant="title" style={{ flex: 1 }}>RANGOS</GlowText>
                <TouchableOpacity onPress={() => setRankModalVisible(false)} activeOpacity={0.7}>
                  <X size={20} color={COLORS.whiteAlpha40} />
                </TouchableOpacity>
              </View>
            </View>

            <AstraDivider variant="glow" style={{ marginHorizontal: 24 }} />

            {/* Lista de rangos */}
            <View style={{ paddingHorizontal: 24, gap: 16 }}>
              {RANK_LIST.map(([rankKey, cfg]) => {
                const isCurrentRank = rankKey === data.rank;
                return (
                  <View
                    key={rankKey}
                    style={{
                      flexDirection:   'row',
                      alignItems:      'center',
                      gap:             16,
                      padding:         14,
                      borderRadius:    10,
                      borderWidth:     1,
                      borderColor:     isCurrentRank ? COLORS.purpleAlpha30 : COLORS.whiteAlpha10,
                      backgroundColor: isCurrentRank ? COLORS.backgroundElevated : 'transparent',
                    }}
                  >
                    {/* Ícono */}
                    <View
                      style={{
                        width:           44,
                        height:          44,
                        borderRadius:    22,
                        backgroundColor: COLORS.purpleAlpha15,
                        borderWidth:     1,
                        borderColor:     COLORS.purpleAlpha30,
                        alignItems:      'center',
                        justifyContent:  'center',
                        flexShrink:      0,
                      }}
                    >
                      {cfg.icon}
                    </View>

                    {/* Nombre + descripción */}
                    <View style={{ flex: 1, gap: 3 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <GlowText variant="subtitle" style={{ color: cfg.color }}>
                          {rankKey}
                        </GlowText>
                        {isCurrentRank && (
                          <View
                            style={{
                              backgroundColor:   COLORS.purpleAlpha30,
                              borderWidth:       1,
                              borderColor:       COLORS.purpleStrong,
                              paddingHorizontal: 6,
                              paddingVertical:   1,
                              borderRadius:      4,
                            }}
                          >
                            <GlowText variant="caption" style={{ fontSize: 9, color: COLORS.purpleStrong }}>
                              TU RANGO
                            </GlowText>
                          </View>
                        )}
                      </View>
                      <GlowText variant="body" color={COLORS.whiteAlpha80} style={{ lineHeight: 18 }}>
                        {cfg.description}
                      </GlowText>
                    </View>
                  </View>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default ProfileSection;