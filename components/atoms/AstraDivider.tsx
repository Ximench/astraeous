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
      <View className="flex-row items-center" style={[{ marginVertical: 16 }, style]}>
        <View className="flex-1" style={{ height: 1, backgroundColor: COLORS.purpleAlpha30 }} />
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
        <View className="flex-1" style={{ height: 1, backgroundColor: COLORS.purpleAlpha30 }} />
      </View>
    );
  }

  return (
    <View
      style={[
        { marginVertical: 16 },
        variant === 'dashed'
          ? {
              borderStyle: 'dashed',
              borderWidth: 1,
              borderColor: COLORS.purpleAlpha30,
              backgroundColor: 'transparent',
              height: 0,
            }
          : {
              height: 1,
              backgroundColor: COLORS.whiteAlpha10,
            },
        style,
      ]}
    />
  );
};

export default AstraDivider;