import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/colors';

interface Star {
  id:      number;
  top:     `${number}%`;
  left:    `${number}%`;
  size:    number;
  opacity: number;
}

const StarField: React.FC = () => {
  // Generamos las estrellas una sola vez con useMemo
  const stars = useMemo<Star[]>(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id:      i,
      top:     `${Math.random() * 100}%` as `${number}%`,
      left:    `${Math.random() * 100}%` as `${number}%`,
      size:    Math.random() < 0.2 ? 3 : Math.random() < 0.5 ? 2 : 1,
      opacity: 0.3 + Math.random() * 0.7,
    })),
  []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map((star) => (
        <View
          key={star.id}
          className="absolute"
          style={[
            { backgroundColor: COLORS.white },
            {
              top:          star.top,
              left:         star.left,
              width:        star.size,
              height:       star.size,
              borderRadius: star.size / 2,
              opacity:      star.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

export default StarField;