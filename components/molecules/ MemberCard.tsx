import React from 'react';
import { View } from 'react-native';
import { COLORS } from '../../constants/colors';
import AstraAvatar from '../atoms/AstraAvatar';
import AstraBadge from '../atoms/AstraBadge';
import GlowText from '../atoms/GlowText';

export interface Member {
  id:       string;
  name:     string;
  role:     string;
  initials: string;
  uri?:     string;
  isLead?:  boolean;
}

type MemberCardProps = Omit<Member, 'id'>;

const MemberCard: React.FC<MemberCardProps> = ({
  name     = 'Username',
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
    <View
      className="absolute right-0 top-0 rounded-bl-lg border-b border-l"
      style={{
        width: 24,
        height: 24,
        backgroundColor: COLORS.purpleAlpha15,
        borderColor: COLORS.purpleAlpha30,
      }}
    />

    <AstraAvatar initials={initials} uri={uri} size="md" ring={isLead} />

    <View className="flex-1" style={{ gap: 4 }}>
      <GlowText variant="subtitle" glow={isLead}>{name}</GlowText>
      <AstraBadge label={role} variant={isLead ? 'status' : 'role'} />
    </View>

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