import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
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

  const textClassNames: Record<BadgeVariant, string> = {
    role:   'text-purple-strong',
    status: 'text-yellow-pale',
    tag:    'text-white-alpha-80',
  };

  return (
    <View
      className={`self-start rounded-[4px] border px-[8px] py-[3px] ${badgeClassNames[variant]}`}
      style={style}
    >
      <Text
        className={textClassNames[variant]}
        style={[FONTS.caption, { fontSize: 10, fontWeight: '700' }]}
      >
        {label}
      </Text>
    </View>
  );
};

export default AstraBadge;