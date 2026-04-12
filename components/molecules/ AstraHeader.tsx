import React from 'react';
import { View } from 'react-native';
import { COLORS } from '../../constants/colors';
import AstraDivider from '../atoms/AstraDivider';
import GlowText from '../atoms/GlowText';

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
  <View className="px-6 pt-6">
    {showLogo && (
      <View className="flex-row items-center" style={{ gap: 8, marginBottom: 16 }}>
        <View
          className="items-center justify-center rounded-full border border-purple-strong"
          style={{ width: 20, height: 20, borderWidth: 1.5 }}
        >
          <View
            className="rounded-full bg-purple-strong"
            style={{
              width: 8,
              height: 8,
              shadowColor: COLORS.purpleStrong,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 4,
            }}
          />
        </View>
        <GlowText variant="caption" color={COLORS.purpleWeak}>
          ASTRAEOUS STUDIOS
        </GlowText>
      </View>
    )}

    <View className="flex-row items-start" style={{ gap: 8 }}>
      <View
        className="rounded bg-yellow-pale"
        style={{
          width: 3,
          height: 48,
          marginTop: 4,
          shadowColor: COLORS.yellowPale,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 6,
        }}
      />
      <View style={{ gap: 4 }}>
        <GlowText variant="display" style={{ fontSize: 28, lineHeight: 34 }}>
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

export default AstraHeader;