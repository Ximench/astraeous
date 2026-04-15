import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { MEMBERS } from '../../constants/members';
import AstraDivider from '../atoms/AstraDivider';
import AstraHeader from '../molecules/ AstraHeader';
import MemberCard from '../molecules/ MemberCard';

const TeamSection: React.FC = () => {
  const router = useRouter();
  const leads  = MEMBERS.filter((m) => m.isLead);
  const rest   = MEMBERS.filter((m) => !m.isLead);

  return (
    <View className="flex-1">
      <AstraHeader title="EQUIPO" subtitle="MIEMBROS DE ASTRAEOUS" />
      <ScrollView
        contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: 64 }}
        showsVerticalScrollIndicator={false}
      >
        {leads.length > 0 && (
          <>
            {leads.map((member) => (
              <MemberCard
                key={member.id}
                name={member.name}
                role={member.role}
                initials={member.initials}
                uri={member.uri}
                isLead={member.isLead}
                onPress={() => router.push(`/member/${member.id}`)}
              />
            ))}
            <AstraDivider variant="dashed" />
          </>
        )}
        {rest.map((member) => (
          <MemberCard
            key={member.id}
            name={member.name}
            role={member.role}
            initials={member.initials}
            uri={member.uri}
            isLead={member.isLead}
            onPress={() => router.push(`/member/${member.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default TeamSection;