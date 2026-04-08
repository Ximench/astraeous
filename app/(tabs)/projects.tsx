import { SafeAreaView } from 'react-native-safe-area-context';
import ProjectsSection from '../../components/organisms/ProjectsSection';
import { COLORS } from '../../constants/colors';

export default function ProjectsScreen() {
  return (
    <SafeAreaView className="flex-1" edges={['top']} style={{ backgroundColor: COLORS.background }}>
      <ProjectsSection />
    </SafeAreaView>
  );
}