import React from 'react';
import { View, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';

type DividerVariant = 'line' | 'glow' | 'dashed';

interface AstraDividerProps {
  variant?: DividerVariant;
  style?: ViewStyle;
}

const AstraDivider: React.FC<AstraDividerProps> = ({
  variant = 'line',
  style,
}) => {
  if (variant === 'glow') {
    return (
      <View className="my-4 flex-row items-center" style={style}>
        <View className="h-px flex-1 bg-purple-alpha-30" />
        <View
          className="rounded-full"
          style={{
            width: 6,
            height: 6,
            marginHorizontal: 10,
            backgroundColor: COLORS.yellowPale,
            shadowColor: COLORS.yellowPale,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 6,
            elevation: 4,
          }}
        />
        <View className="h-px flex-1 bg-purple-alpha-30" />
      </View>
    );
  }

  if (variant === 'dashed') {
    return (
      <View
        className="my-4 h-0 border border-dashed border-purple-alpha-30"
        style={style}
      />
    );
  }

  return (
    <View
      className="my-4 h-px bg-white-alpha-10"
      style={style}
    />
  );
};

export default AstraDivider;