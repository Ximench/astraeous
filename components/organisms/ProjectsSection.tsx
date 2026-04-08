import React from 'react';
import { ScrollView, View } from 'react-native';
import AstraHeader from '../molecules/ AstraHeader';
import ProjectCard, { Project } from '../molecules/ ProjectCard';

const GAME_PHOTOS: Record<string, any> = {
  OM: require('../../assets/GamePhotos/OM.jpg'),
  GR: require('../../assets/GamePhotos/GR.jpg'),
  DO: require('../../assets/GamePhotos/DO.jpg'),
};

const PLACEHOLDER_PROJECTS: Project[] = [
  {
    id:           '1',
    title:        'Outcome Memories',
    status:       'EN DESARROLLO',
    thumbnailUri: GAME_PHOTOS.OM,
  },
  {
    id:           '2',
    title:        'Grace',
    status:       'EN DESARROLLO',
    thumbnailUri: GAME_PHOTOS.GR,
  },
  {
    id:           '3',
    title:        'DOORS',
    status:       'EN DESARROLLO',
    thumbnailUri: GAME_PHOTOS.DO,
  },
];

interface ProjectsSectionProps {
  projects?:       Project[];
  onProjectPress?: (project: Project) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects       = PLACEHOLDER_PROJECTS,
  onProjectPress,
}) => (
  <View className="flex-1">
    <AstraHeader title="PROYECTOS" subtitle="JUEGOS Y EXPERIENCIAS" />
    <ScrollView
      contentContainerStyle={{ padding: 24, gap: 24, paddingBottom: 64 }}
      showsVerticalScrollIndicator={false}
    >
      {projects.map(({ id, ...props }) => (
        <ProjectCard
          key={id}
          {...props}
          onPress={() => onProjectPress?.({ id, ...props })}
        />
      ))}
    </ScrollView>
  </View>
);

export default ProjectsSection;