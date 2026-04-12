import React from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
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

const AnimatedView = Animated.createAnimatedComponent(View);
const ORBITS = [
  { size: 144, c: COLORS.purpleAlpha15, o: -72 },
  { size: 178, c: COLORS.whiteAlpha40, o: -89 },
  { size: 216, c: COLORS.purpleAlpha15, o: -108 },
] as const;

function OrbScene() {
  const intro = useSharedValue(0);
  const beat = useSharedValue(0);
  const halo = useSharedValue(0);

  React.useEffect(() => {
    intro.value = withTiming(1, { duration: 640, easing: Easing.out(Easing.cubic) });
    beat.value = withRepeat(withSequence(
      withTiming(1, { duration: 220, easing: Easing.out(Easing.ease) }),
      withTiming(0.08, { duration: 420, easing: Easing.inOut(Easing.ease) }),
      withTiming(0.34, { duration: 220, easing: Easing.out(Easing.ease) }),
      withTiming(0.1, { duration: 420, easing: Easing.inOut(Easing.ease) }),
      withTiming(0.5, { duration: 240, easing: Easing.out(Easing.ease) }),
      withTiming(0.12, { duration: 420, easing: Easing.inOut(Easing.ease) }),
      withTiming(1, { duration: 260, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 760, easing: Easing.inOut(Easing.ease) }),
    ), -1, false);
    halo.value = withRepeat(withSequence(withTiming(1, { duration: 4400, easing: Easing.inOut(Easing.ease) }), withTiming(0, { duration: 0 })), -1, false);
  }, [beat, halo, intro]);

  const shell = useAnimatedStyle(() => ({ opacity: interpolate(beat.value, [0, 1], [0.82, 1]), transform: [{ scale: interpolate(intro.value + beat.value, [0, 1, 2], [0.92, 1.06, 1.015]) }, { translateY: interpolate(beat.value, [0, 1], [0, -2.5]) }] }));
  const inner = useAnimatedStyle(() => ({ opacity: interpolate(beat.value, [0, 1], [0.9, 1]), transform: [{ scale: interpolate(intro.value + beat.value, [0, 1, 2], [0.96, 1.035, 1.01]) }] }));
  const core = useAnimatedStyle(() => ({ opacity: interpolate(beat.value, [0, 0.12, 0.5, 1], [0.95, 1, 0.88, 1]), transform: [{ scale: interpolate(intro.value + beat.value, [0, 1, 2], [0.96, 1.08, 1.02]) }] }));
  const line = useAnimatedStyle(() => ({ opacity: interpolate(beat.value, [0, 0.18, 1], [0.22, 0.12, 0]), transform: [{ scale: interpolate(beat.value, [0, 1], [0.18, 1.42]) }] }));
  const glow = useAnimatedStyle(() => ({ opacity: interpolate(halo.value, [0, 0.72, 1], [0, 0.72, 0]), transform: [{ scale: interpolate(halo.value, [0, 1], [0.96, 1.22]) }] }));

  const containerStyle = { width: 224, height: 224, marginBottom: 16 };
  const glowOrbStyle = {
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: COLORS.purpleAlpha15,
    shadowColor: COLORS.purpleStrong,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.32,
    shadowRadius: 18,
  };
  const shellBaseStyle = {
    width: 132,
    height: 132,
    borderColor: COLORS.purpleAlpha15,
    shadowColor: COLORS.purpleStrong,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    backgroundColor: COLORS.purpleAlpha15,
  };
  const innerBaseStyle = {
    width: 94,
    height: 94,
    borderColor: COLORS.purpleAlpha15,
  };
  const coreBaseStyle = {
    width: 64,
    height: 64,
    backgroundColor: COLORS.purpleAlpha15,
    borderColor: COLORS.purpleStrong,
    shadowColor: COLORS.purpleStrong,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 12,
  };

  return (
    <View className="items-center justify-center" style={containerStyle}>
      <AnimatedView
        pointerEvents="none"
        className="absolute rounded-full"
        style={[glowOrbStyle, glow]}
      />

      <View className="absolute items-center justify-center">
        {ORBITS.map(({ size, c, o }) => (
          <AnimatedView
            key={size}
            pointerEvents="none"
            className="absolute rounded-full"
            style={[
              {
                width: size,
                height: size,
                marginLeft: o,
                marginTop: o,
                borderWidth: 0.8,
                borderColor: c,
                backgroundColor: 'transparent',
              },
              line,
            ]}
          />
        ))}
      </View>

      <AnimatedView
        className="items-center justify-center rounded-full border"
        style={[shellBaseStyle, shell]}
      >
        <AnimatedView
          className="items-center justify-center rounded-full border"
          style={[innerBaseStyle, inner]}
        >
          <AnimatedView
            className="items-center justify-center rounded-full border"
            style={[coreBaseStyle, core]}
          >
            <GlowText variant="display" glow style={{ fontSize: 30 }}>
              ✦
            </GlowText>
          </AnimatedView>
        </AnimatedView>
      </AnimatedView>
    </View>
  );
}

const HomeHero: React.FC<HomeHeroProps> = ({
  onPressProjects,
  onPressTeam,
}) => (
  <View className="flex-1 items-center justify-center overflow-hidden" style={{ gap: 24, paddingHorizontal: 32, paddingVertical: 48 }}>
    <GlowText
      variant="subtitle"
      color={COLORS.whiteAlpha40}
      style={{ position: 'absolute', top: 12, left: 16, fontSize: 12, letterSpacing: 2 }}
    >
      V1.5.5
    </GlowText>

    <StarField />

    {/* Orbe central */}
    <OrbScene />

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