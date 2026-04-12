import React from 'react';
import { Text, TextProps } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS, FontVariant } from '../../constants/typography';

interface GlowTextProps extends TextProps {
  variant?: FontVariant;
  color?: string;
  glow?: boolean;
}

const GlowText: React.FC<GlowTextProps> = ({
  children,
  variant = 'body',
  color = COLORS.white,
  glow = false,
  style,
  className,
  ...props
}) => {
  const baseFont = FONTS[variant] ?? FONTS.body;
  const mergedClassName = [glow ? 'text-[#FFEE8C]' : '', className].filter(Boolean).join(' ') || undefined;

  return (
    <Text
      className={mergedClassName}
      style={[
        baseFont,
        { color },
        glow && {
          color: COLORS.yellowPale,
          textShadowColor: COLORS.yellowPale,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 12,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default GlowText;