import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';

type BadgeVariant = 'role' | 'status' | 'tag';

interface AstraBadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const AstraBadge: React.FC<AstraBadgeProps> = ({
  label,
  variant = 'role',
  style,
}) => {
  const badgeStyles: Record<BadgeVariant, ViewStyle> = {
    role: {
      backgroundColor: COLORS.purpleAlpha30,
      borderColor: COLORS.purpleStrong,
    },
    status: {
      backgroundColor: COLORS.yellowAlpha30,
      borderColor: COLORS.yellowPale,
    },
    tag: {
      backgroundColor: COLORS.whiteAlpha10,
      borderColor: COLORS.whiteAlpha40,
    },
  };

  const textStyles: Record<BadgeVariant, TextStyle> = {
    role: { color: COLORS.purpleStrong },
    status: { color: COLORS.yellowPale },
    tag: { color: COLORS.whiteAlpha80 },
  };

  return (
    <View
      className="self-start rounded-[4px] border px-[8px] py-[3px]"
      style={[badgeStyles[variant], style]}
    >
      <Text style={[FONTS.caption, { fontSize: 10, fontWeight: '700' }, textStyles[variant]]}>
        {label}
      </Text>
    </View>
  );
};

export default AstraBadge;