import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
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
  const badgeClassNames: Record<BadgeVariant, string> = {
    role:   'bg-purple-alpha-30 border-purple-strong',
    status: 'bg-yellow-alpha-30 border-yellow-pale',
    tag:    'bg-white-alpha-10 border-white-alpha-40',
  };

  const textStyles: Record<BadgeVariant, TextStyle> = {
    role:   { color: '#7844E5' },
    status: { color: '#FFEE8C' },
    tag:    { color: 'rgba(255,255,255,0.8)' },
  };

  return (
    <View
      className={`self-start rounded-[4px] border px-[8px] py-[3px] ${badgeClassNames[variant]}`}
      style={style}
    >
      <Text style={[FONTS.caption, { fontSize: 10, fontWeight: '700' }, textStyles[variant]]}>
        {label}
      </Text>
    </View>
  );
};

export default AstraBadge;