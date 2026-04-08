import React from 'react';
import { View } from 'react-native';
import { COLORS } from '../../constants/colors';
import AstraBadge from '../atoms/AstraBadge';
import AstraButton from '../atoms/AstraButton';
import AstraDivider from '../atoms/AstraDivider';
import GlowText from '../atoms/GlowText';
import StarField from '../atoms/StarField';

interface HomeHeroProps {
  onPressProjects?: () => void;
  onPressTeam?:     () => void;
}

const HomeHero: React.FC<HomeHeroProps> = ({
  onPressProjects,
  onPressTeam,
}) => (
  <View className="flex-1 items-center justify-center overflow-hidden" style={{ gap: 24, paddingHorizontal: 32, paddingVertical: 48 }}>
    <StarField />

    {/* Orbe central */}
    <View
      className="items-center justify-center rounded-full border"
      style={{ width: 120, height: 120, marginBottom: 16, borderColor: COLORS.purpleAlpha30 }}
    >
      <View
        className="items-center justify-center rounded-full border"
        style={{ width: 85, height: 85, borderColor: COLORS.purpleAlpha30 }}
      >
        <View
          className="items-center justify-center rounded-full border"
          style={{
            width: 55,
            height: 55,
            backgroundColor: COLORS.purpleAlpha30,
            borderColor: COLORS.purpleStrong,
            shadowColor: COLORS.purpleStrong,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 12,
          }}
        >
          <GlowText variant="display" glow style={{ fontSize: 26 }}>✦</GlowText>
        </View>
      </View>
    </View>

    {/* Texto */}
    <View className="items-center" style={{ gap: 8 }}>
      <AstraBadge label="ROBLOX DEVELOPMENT GROUP" variant="role" />
      <GlowText variant="display" glow style={{ fontSize: 42, textAlign: 'center', letterSpacing: 6 }}>
        ASTRAEOUS
      </GlowText>
      <GlowText variant="subtitle" color={COLORS.whiteAlpha80} style={{ textAlign: 'center', lineHeight: 24 }}>
        Construyendo mundos más allá de los límites
      </GlowText>
    </View>

    <AstraDivider variant="glow" style={{ width: '80%' }} />

    {/* CTAs */}
    <View className="flex-row flex-wrap justify-center" style={{ gap: 16 }}>
      <AstraButton label="PROYECTOS"      variant="primary"   onPress={onPressProjects} style={{ minWidth: 130 }} />
      <AstraButton label="NUESTRO EQUIPO" variant="secondary" onPress={onPressTeam}     style={{ minWidth: 130 }} />
    </View>
  </View>
);

export default HomeHero;