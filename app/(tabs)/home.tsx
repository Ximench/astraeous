import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeHero from '../../components/organisms/ HomeHero';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <HomeHero
        onPressProjects={() => router.push('/(tabs)/projects')}
        onPressTeam={() => router.push('/(tabs)/team')}
      />
    </SafeAreaView>
  );
}