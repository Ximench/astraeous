import React from 'react';
import { Image, ImageSourcePropType, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import AstraBadge from '../atoms/AstraBadge';
import GlowText from '../atoms/GlowText';

export interface Member {
  id:          string;
  name:        string;       // nombre de usuario (ej: "Snova")
  realName?:   string;       // nombre real (ej: "Aarón Machuca")
  role:        string;
  initials:    string;
  uri?:        ImageSourcePropType;
  isLead?:     boolean;
}

type MemberCardProps = Omit<Member, 'id'>;

const MemberCard: React.FC<MemberCardProps> = ({
  name     = 'Username',
  realName,
  role     = 'Developer',
  initials = 'US',
  uri,
  isLead   = false,
}) => (
  <View
    className="relative flex-row items-center overflow-hidden rounded-[10px] border"
    style={[
      {
        padding: 16,
        gap: 16,
        backgroundColor: COLORS.backgroundCard,
        borderColor: COLORS.whiteAlpha10,
      },
      isLead && {
        borderColor: COLORS.purpleAlpha30,
        backgroundColor: COLORS.backgroundElevated,
      },
    ]}
  >
    {/* Esquina decorativa */}
    <View
      className="absolute right-0 top-0 rounded-bl-lg border-b border-l"
      style={{
        width: 24,
        height: 24,
        backgroundColor: COLORS.purpleAlpha15,
        borderColor: COLORS.purpleAlpha30,
      }}
    />

    {/* Avatar con imagen o iniciales */}
    <View
      style={[
        {
          width: 54,
          height: 54,
          borderRadius: 27,
          backgroundColor: COLORS.backgroundElevated,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: isLead ? COLORS.purpleStrong : 'transparent',
          overflow: 'hidden',
        },
        isLead && {
          shadowColor: COLORS.purpleStrong,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
        },
      ]}
    >
      {uri ? (
        <Image
          source={uri}
          style={{ width: 54, height: 54, borderRadius: 27 }}
          resizeMode="cover"
        />
      ) : (
        <GlowText
          variant="subtitle"
          color={COLORS.purpleWeak}
          style={{ fontWeight: '700' }}
        >
          {initials}
        </GlowText>
      )}
    </View>

    {/* Info */}
    <View className="flex-1" style={{ gap: 2 }}>
      {/* Nombre de usuario */}
      <GlowText variant="subtitle" glow={isLead}>
        {name}
      </GlowText>

      {/* Nombre real como subtítulo */}
      {realName && (
        <GlowText
          variant="caption"
          color={COLORS.whiteAlpha40}
          style={{ fontSize: 11, textTransform: 'none', letterSpacing: 0.3 }}
        >
          {realName}
        </GlowText>
      )}

      {/* Badge de rol */}
      <View style={{ marginTop: 4 }}>
        <AstraBadge label={role} variant={isLead ? 'status' : 'role'} />
      </View>
    </View>

    {/* Barra lateral líder */}
    {isLead && (
      <View
        className="absolute left-0 rounded"
        style={{
          width: 3,
          bottom: 8,
          top: 8,
          backgroundColor: COLORS.yellowPale,
          shadowColor: COLORS.yellowPale,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 6,
        }}
      />
    )}
  </View>
);

export default MemberCard;