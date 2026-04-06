import React from 'react';
import { View, StyleSheet } from 'react-native';
import GlowText from '../atoms/GlowText';
import AstraDivider from '../atoms/AstraDivider';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/typography';

interface AstraHeaderProps {
  title:      string;
  subtitle?:  string;
  showLogo?:  boolean;
}

const AstraHeader: React.FC<AstraHeaderProps> = ({
  title,
  subtitle,
  showLogo = false,
}) => (
  <View style={styles.container}>
    {showLogo && (
      <View style={styles.logoRow}>
        <View style={styles.logoOrbOuter}>
          <View style={styles.logoOrbInner} />
        </View>
        <GlowText variant="caption" color={COLORS.purpleWeak}>
          ASTRAEOUS STUDIOS
        </GlowText>
      </View>
    )}

    <View style={styles.titleRow}>
      <View style={styles.sideBar} />
      <View style={styles.titleContent}>
        <GlowText variant="display" style={styles.title}>
          {title}
        </GlowText>
        {subtitle && (
          <GlowText variant="caption" color={COLORS.whiteAlpha40}>
            {subtitle}
          </GlowText>
        )}
      </View>
    </View>

    <AstraDivider variant="glow" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingTop:        SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  logoRow: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            SPACING.sm,
    marginBottom:   SPACING.md,
  },
  logoOrbOuter: {
    width:           20,
    height:          20,
    borderRadius:    10,
    borderWidth:     1.5,
    borderColor:     COLORS.purpleStrong,
    alignItems:      'center',
    justifyContent:  'center',
  },
  logoOrbInner: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: COLORS.purpleStrong,
    shadowColor:     COLORS.purpleStrong,
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   1,
    shadowRadius:    4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           SPACING.sm,
  },
  sideBar: {
    width:           3,
    height:          48,
    backgroundColor: COLORS.yellowPale,
    borderRadius:    2,
    marginTop:       4,
    shadowColor:     COLORS.yellowPale,
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   0.8,
    shadowRadius:    6,
  },
  titleContent: {
    gap: 4,
  },
  title: {
    fontSize:   28,
    lineHeight: 34,
  },
});

export default AstraHeader;