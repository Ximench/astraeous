import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet } from 'react-native';
import HomeHero from '../../components/organisms/ HomeHero';
import { COLORS } from '../../constants/colors';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <HomeHero
        onPressProjects={() => router.push('/(tabs)/projects')}
        onPressTeam={() => router.push('/(tabs)/team')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});