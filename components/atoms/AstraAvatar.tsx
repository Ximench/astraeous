import React from 'react';
import { Image, Text, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AstraAvatarProps {
  uri?: string;
  initials?: string;
  size?: AvatarSize;
  ring?: boolean;
}

const SIZES: Record<AvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 72,
};

const AstraAvatar: React.FC<AstraAvatarProps> = ({
  uri,
  initials = '??',
  size = 'md',
  ring = false,
}) => {
  const dim = SIZES[size];
  const ringStyle = ring
    ? {
        borderColor: COLORS.purpleStrong,
        shadowColor: COLORS.purpleStrong,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 6,
      }
    : null;

  return (
    <View
      className="items-center justify-center border-2 border-transparent"
      style={[
        {
          width:        dim + 6,
          height:       dim + 6,
          borderRadius: (dim + 6) / 2,
        },
        ringStyle,
      ]}
    >
      <View
        className="items-center justify-center bg-background-elevated"
        style={[{ width: dim, height: dim, borderRadius: dim / 2 }]}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={{ width: dim, height: dim, borderRadius: dim / 2 }}
          />
        ) : (
          <Text
            style={[
              FONTS.subtitle,
              { color: COLORS.purpleWeak, fontWeight: '700', fontSize: dim * 0.33 },
            ]}
          >
            {initials}
          </Text>
        )}
      </View>
    </View>
  );
};

export default AstraAvatar;