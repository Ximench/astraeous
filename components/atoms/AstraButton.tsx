import React from 'react';
import {
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { COLORS } from '../../constants/colors';
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
  const variantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: {
      backgroundColor: COLORS.purpleStrong,
      borderWidth: 1,
      borderColor: COLORS.purpleMid,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: COLORS.purpleStrong,
    },
    accent: {
      backgroundColor: COLORS.yellowPale,
    },
    ghost: {
      backgroundColor: COLORS.purpleAlpha15,
    },
  };

  const labelStyles: Record<ButtonVariant, TextStyle> = {
    primary: { color: COLORS.white },
    secondary: { color: COLORS.purpleStrong },
    accent: { color: COLORS.purpleDeep },
    ghost: { color: COLORS.whiteAlpha80 },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      className="relative flex-row items-center justify-center overflow-hidden"
      style={[
        {
          paddingHorizontal: 24,
          paddingVertical: 10,
          borderRadius: 6,
        },
        variantStyles[variant],
        fullWidth && { width: '100%' },
        disabled && { opacity: 0.4 },
        style,
      ]}
    >
      {variant === 'primary' && (
        <View
          className="absolute bottom-[4px] left-0 top-[4px] w-[3px] rounded-[2px]"
          style={{ backgroundColor: COLORS.yellowPale }}
        />
      )}
      <Text style={[FONTS.caption, { fontWeight: '700' }, labelStyles[variant]]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default AstraButton;