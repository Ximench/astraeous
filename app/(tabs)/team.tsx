import { SafeAreaView } from 'react-native-safe-area-context';
import TeamSection from '../../components/organisms/TeamSection';

export default function TeamScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <TeamSection />
    </SafeAreaView>
  );
}