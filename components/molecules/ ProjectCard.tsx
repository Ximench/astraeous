import React from 'react';
import { Image, ImageSourcePropType, Pressable, View } from 'react-native';
import AstraBadge from '../atoms/AstraBadge';
import GlowText from '../atoms/GlowText';

export interface Project {
  id:             string;
  title:          string;
  status:         string;
  description?:   string;
  thumbnailUri?:  ImageSourcePropType;
}

interface ProjectCardProps extends Omit<Project, 'id'> {
  onPress?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title       = 'Project Name',
  status      = 'IN DEV',
  description,
  thumbnailUri,
  onPress,
}) => (
  <Pressable
    accessibilityRole="button"
    disabled={!onPress}
    onPress={onPress}
    className="overflow-hidden rounded-[12px] border border-white-alpha-10 bg-background-card"
  >
    {/* Thumbnail */}
    <View className="bg-background-elevated" style={{ height: 140 }}>
      {thumbnailUri ? (
        <Image
          source={thumbnailUri}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      ) : (
        <View className="flex-1 items-center justify-center bg-purple-alpha-15">
          <GlowText variant="display" className="text-purple-alpha-30" style={{ fontSize: 40 }}>✦</GlowText>
        </View>
      )}

      {/* Degradado inferior */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-background-card opacity-60"
        style={{ height: 50 }}
      />

      {/* Badge de status */}
      <View className="absolute" style={{ right: 8, top: 8 }}>
        <AstraBadge label={status} variant="status" />
      </View>
    </View>

    {/* Contenido */}
    <View style={{ padding: 16, gap: 8 }}>
      <GlowText variant="title">{title}</GlowText>

      {description ? (
        <GlowText
          variant="body"
          className="text-white-alpha-80"
          style={{ lineHeight: 20 }}
          numberOfLines={2}
        >
          {description}
        </GlowText>
      ) : null}

    </View>
  </Pressable>
);

export default ProjectCard;