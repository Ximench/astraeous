import React from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { FONTS } from '../../constants/typography';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost';

interface AstraButtonProps {
  label: string;
  variant?: ButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const AstraButton: React.FC<AstraButtonProps> = ({
  label,
  variant = 'primary',
  onPress,
  disabled = false,
  fullWidth = false,
  style,
}) => {
  const variantClassNames: Record<ButtonVariant, string> = {
    primary:   'bg-purple-strong border border-purple-mid',
    secondary: 'border-[1.5px] border-purple-strong',
    accent:    'bg-yellow-pale',
    ghost:     'bg-purple-alpha-15',
  };

  const labelClassNames: Record<ButtonVariant, string> = {
    primary:   'text-white',
    secondary: 'text-purple-strong',
    accent:    'text-purple-deep',
    ghost:     'text-white-alpha-80',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      className={`relative flex-row items-center justify-center overflow-hidden ${variantClassNames[variant]}`}
      style={[
        {
          paddingHorizontal: 24,
          paddingVertical: 10,
          borderRadius: 6,
        },
        fullWidth && { width: '100%' },
        disabled && { opacity: 0.4 },
        style,
      ]}
    >
      {variant === 'primary' && (
        <View
          className="absolute bottom-[4px] left-0 top-[4px] w-[3px] rounded-[2px] bg-yellow-pale"
        />
      )}
      <Text className={labelClassNames[variant]} style={[FONTS.caption, { fontWeight: '700' }]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default AstraButton;