import { SafeAreaView, StyleSheet } from 'react-native';
import ProjectsSection from '../../components/organisms/ProjectsSection';
import { COLORS } from '../../constants/colors';

export default function ProjectsScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ProjectsSection />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});