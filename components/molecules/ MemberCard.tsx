import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/typography';
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
  <View style={[styles.card, isLead && styles.cardLead]}>
    <View style={styles.cornerAccent} />

    <AstraAvatar initials={initials} uri={uri} size="md" ring={isLead} />

    <View style={styles.info}>
      <GlowText variant="subtitle" glow={isLead}>{name}</GlowText>
      <AstraBadge label={role} variant={isLead ? 'status' : 'role'} />
    </View>

    {isLead && <View style={styles.leadIndicator} />}
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: COLORS.backgroundCard,
    borderWidth:     1,
    borderColor:     COLORS.whiteAlpha10,
    borderRadius:    10,
    padding:         SPACING.md,
    gap:             SPACING.md,
    overflow:        'hidden',
  },
  cardLead: {
    borderColor:     COLORS.purpleAlpha30,
    backgroundColor: COLORS.backgroundElevated,
  },
  info: {
    flex: 1,
    gap:  SPACING.xs,
  },
  cornerAccent: {
    position:        'absolute',
    top:             0,
    right:           0,
    width:           24,
    height:          24,
    borderBottomLeftRadius: 8,
    backgroundColor: COLORS.purpleAlpha15,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor:     COLORS.purpleAlpha30,
  },
  leadIndicator: {
    position:        'absolute',
    left:            0,
    top:             8,
    bottom:          8,
    width:           3,
    backgroundColor: COLORS.yellowPale,
    borderRadius:    2,
    shadowColor:     COLORS.yellowPale,
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   1,
    shadowRadius:    6,
  },
});

export default MemberCard;