import { SafeAreaView } from 'react-native';
import ProjectsSection from '../../components/organisms/ProjectsSection';
import { COLORS } from '../../constants/colors';

export default function ProjectsScreen() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <ProjectsSection />
    </SafeAreaView>
  );
}