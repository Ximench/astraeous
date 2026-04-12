import React from 'react';
import { Image, View } from 'react-native';
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
    className="overflow-hidden rounded-[12px] border border-white-alpha-10 bg-background-card"
  >
    {/* Thumbnail */}
    <View className="bg-background-elevated" style={{ height: 140 }}>
      {thumbnailUri ? (
        <Image source={{ uri: thumbnailUri }} className="h-full w-full" />
      ) : (
        <View className="flex-1 items-center justify-center bg-purple-alpha-15">
          <GlowText variant="display" style={{ fontSize: 40, color: 'rgba(120,68,229,0.3)' }}>✦</GlowText>
        </View>
      )}
      <View
        className="absolute bottom-0 left-0 right-0 bg-background-card opacity-60"
        style={{ height: 50 }}
      />
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
          color="rgba(255,255,255,0.8)"
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