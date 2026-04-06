import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SPACING } from '../../constants/typography';
import AstraHeader from '../molecules/ AstraHeader';
import ProjectCard, { Project } from '../molecules/ ProjectCard';


const PLACEHOLDER_PROJECTS: Project[] = [
  { id: '1', title: 'Proyecto Alfa',  status: 'EN DESARROLLO' },
  { id: '2', title: 'Proyecto Beta',  status: 'BETA' },
  { id: '3', title: 'Proyecto Gamma', status: 'PRÓXIMAMENTE' },
];

interface ProjectsSectionProps {
  projects?:       Project[];
  onProjectPress?: (project: Project) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects       = PLACEHOLDER_PROJECTS,
  onProjectPress,
}) => (
  <View style={styles.container}>
    <AstraHeader title="PROYECTOS" subtitle="JUEGOS Y EXPERIENCIAS" />
    <ScrollView
      contentContainerStyle={styles.list}
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: {
    padding:       SPACING.lg,
    gap:           SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
});

export default ProjectsSection;