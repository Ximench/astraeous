import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native';
import HomeHero from '../../components/organisms/ HomeHero';
import { COLORS } from '../../constants/colors';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <HomeHero
        onPressProjects={() => router.push('/(tabs)/projects')}
        onPressTeam={() => router.push('/(tabs)/team')}
      />
    </SafeAreaView>
  );
}