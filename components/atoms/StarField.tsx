import React, { useMemo } from 'react';
import { View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface Star {
  id:        number;
  top:       `${number}%`;
  left:      `${number}%`;
  size:      number;
  opacity:   number;
  duration:  number;
  delay:     number;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const StarParticle: React.FC<Star> = React.memo(({
  id,
  top,
  left,
  size,
  opacity,
  duration,
  delay,
}) => {
  const animatedOpacity = useSharedValue(opacity * 0.2);
  const animatedOffsetX = useSharedValue(0);
  const animatedOffsetY = useSharedValue(0);

  React.useEffect(() => {
    animatedOpacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(opacity, { duration, easing: Easing.inOut(Easing.ease) }),
          withTiming(opacity * 0.2, { duration, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
      ),
    );

    animatedOffsetX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(3.5, { duration: duration * 1.5, easing: Easing.inOut(Easing.ease) }),
          withTiming(-3.5, { duration: duration * 1.5, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
      ),
    );

    animatedOffsetY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(2.2, { duration: duration * 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(-2.2, { duration: duration * 2, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
      ),
    );
  }, [animatedOpacity, animatedOffsetX, animatedOffsetY, opacity, duration, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animatedOpacity.value,
    transform: [
      { translateX: animatedOffsetX.value },
      { translateY: animatedOffsetY.value },
    ],
  }));

  return (
    <AnimatedView
      className="absolute bg-white"
      style={[
        {
          top,
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    />
  );
});

const StarField: React.FC = () => {
  // Generamos las estrellas una sola vez con useMemo
  const stars = useMemo<Star[]>(() =>
    Array.from({ length: 42 }, (_, i) => ({
      id:       i,
      top:      `${Math.random() * 100}%` as `${number}%`,
      left:     `${Math.random() * 100}%` as `${number}%`,
      size:     Math.random() < 0.15 ? 3 : Math.random() < 0.45 ? 2 : 1,
      opacity:  0.45 + Math.random() * 0.45,
      duration: 1400 + Math.random() * 1200,
      delay:    Math.random() * 1200,
    })),
    [],
  );

  return (
    <View pointerEvents="none" className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <StarParticle key={star.id} {...star} />
      ))}
    </View>
  );
};

export default StarField;