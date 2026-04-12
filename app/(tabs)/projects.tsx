import { SafeAreaView } from 'react-native-safe-area-context';
import ProjectsSection from '../../components/organisms/ProjectsSection';

export default function ProjectsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ProjectsSection />
    </SafeAreaView>
  );
}