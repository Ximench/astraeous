import React from 'react';
import { ScrollView, View } from 'react-native';
import AstraHeader from '../molecules/ AstraHeader';
import ProjectCard, { Project } from '../molecules/ ProjectCard';

const PLACEHOLDER_PROJECTS: Project[] = [
  { id: '1', title: 'Proyecto Alfa', status: 'EN DESARROLLO' },
  { id: '2', title: 'Proyecto Beta', status: 'BETA' },
  { id: '3', title: 'Proyecto Gamma', status: 'PRÓXIMAMENTE' },
];

interface ProjectsSectionProps {
  projects?: Project[];
  onProjectPress?: (project: Project) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects = PLACEHOLDER_PROJECTS,
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
