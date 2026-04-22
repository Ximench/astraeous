import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileSection, { ProfileData } from '../../components/organisms/ ProfileSection';
import { STORAGE_KEY_STATUS } from '../edit-profile';

export default function ProfileScreen() {
  const router = useRouter();

  const [profileData, setProfileData] = useState<ProfileData>({
    username: 'Username',
    role:     'SCRIPTER',
    status:   'ACTIVO',
    rank:     'INVITADO',
    projects: null,
    commits:  null,
  });

  // useFocusEffect vuelve a leer el status cada vez que
  // el usuario regresa desde edit-profile
  useFocusEffect(
    useCallback(() => {
      const loadStatus = async () => {
        try {
          const saved = await AsyncStorage.getItem(STORAGE_KEY_STATUS);
          if (saved === 'ACTIVO' || saved === 'INACTIVO') {
            setProfileData((prev) => ({ ...prev, status: saved }));
          }
        } catch (e) {
          console.warn('Error leyendo status:', e);
        }
      };

      loadStatus();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ProfileSection
        data={profileData}
        onEditProfile={() => router.push('/edit-profile')}
      />
    </SafeAreaView>
  );
}