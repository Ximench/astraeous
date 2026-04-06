import { SafeAreaView, StyleSheet } from 'react-native';
import ProfileSection from '../../components/organisms/ ProfileSection';
import { COLORS } from '../../constants/colors';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ProfileSection />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});