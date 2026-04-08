import React from 'react';
import { Image, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import AstraBadge from '../atoms/AstraBadge';
import AstraButton from '../atoms/AstraButton';
import GlowText from '../atoms/GlowText';

export interface Project {
  id:            string;
  title:         string;
  status:        string;
  description?:  string;
  thumbnailUri?: string;
}

interface ProjectCardProps extends Omit<Project, 'id'> {
  onPress?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title        = 'Project Name',
  status       = 'IN DEV',
  description,
  thumbnailUri,
  onPress,
}) => (
  <View
    className="overflow-hidden rounded-[12px] border"
    style={{ backgroundColor: COLORS.backgroundCard, borderColor: COLORS.whiteAlpha10 }}
  >
    {/* Thumbnail */}
    <View className="h-full" style={{ height: 140, backgroundColor: COLORS.backgroundElevated }}>
      {thumbnailUri ? (
        <Image source={{ uri: thumbnailUri }} className="h-full w-full" />
      ) : (
        <View className="flex-1 items-center justify-center" style={{ backgroundColor: COLORS.purpleAlpha15 }}>
          <GlowText variant="display" style={{ fontSize: 40, color: COLORS.purpleAlpha30 }}>✦</GlowText>
        </View>
      )}
      <View
        className="absolute bottom-0 left-0 right-0"
        style={{ height: 50, backgroundColor: COLORS.backgroundCard, opacity: 0.6 }}
      />
      <View className="absolute" style={{ right: 8, top: 8 }}>
        <AstraBadge label={status} variant="status" />
      </View>
    </View>

    {/* Contenido */}
    <View className="" style={{ padding: 16, gap: 8 }}>
      <GlowText variant="title">{title}</GlowText>

      {description ? (
        <GlowText
          variant="body"
          color={COLORS.whiteAlpha80}
          style={{ lineHeight: 20 }}
          numberOfLines={2}
        >
          {description}
        </GlowText>
      ) : null}

      <AstraButton
        label="VER PROYECTO"
        variant="ghost"
        onPress={onPress}
        style={{ alignSelf: 'flex-start', marginTop: 4 }}
      />
    </View>
  </View>
);

export default ProjectCard;