import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { GAMES } from '../../constants/games';
import AstraHeader from '../molecules/ AstraHeader';
import ProjectCard from '../molecules/ ProjectCard';

const ProjectsSection: React.FC = () => {
  const router = useRouter();

  return (
    <View className="flex-1">
      <AstraHeader title="PROYECTOS" subtitle="JUEGOS Y EXPERIENCIAS" />
      <ScrollView
        contentContainerStyle={{ padding: 24, gap: 24, paddingBottom: 64 }}
        showsVerticalScrollIndicator={false}
      >
        {GAMES.map((game) => (
          <ProjectCard
            key={game.id}
            title={game.title}
            status={game.status}
            thumbnailUri={game.thumbnail}
            onPress={() => router.push(`/game/${game.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default ProjectsSection;