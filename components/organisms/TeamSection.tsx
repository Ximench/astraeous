import React from 'react';
import { ScrollView, View } from 'react-native';
import AstraDivider from '../atoms/AstraDivider';
import AstraHeader from '../molecules/ AstraHeader';
import MemberCard, { Member } from '../molecules/ MemberCard';

const PLACEHOLDER_MEMBERS: Member[] = [
  { id: '1', name: 'AstraLead', role: 'FOUNDER', initials: 'AL', isLead: true },
  { id: '2', name: 'DevPlayer1', role: 'SCRIPTER', initials: 'D1' },
  { id: '3', name: 'BuilderX', role: 'BUILDER', initials: 'BX' },
  { id: '4', name: 'UIArtist', role: 'UI/UX', initials: 'UA' },
];

interface TeamSectionProps {
  members?: Member[];
}

const TeamSection: React.FC<TeamSectionProps> = ({
  members = PLACEHOLDER_MEMBERS,
}) => {
  const leads = members.filter((m) => m.isLead);
  const rest = members.filter((m) => !m.isLead);

  return (
    <View className="flex-1">
      <AstraHeader title="EQUIPO" subtitle="MIEMBROS DE ASTRAEOUS" />
      <ScrollView
        contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: 64 }}
        showsVerticalScrollIndicator={false}
      >
        {leads.length > 0 && (
          <>
            {leads.map(({ id, ...props }) => <MemberCard key={id} {...props} />)}
            <AstraDivider variant="dashed" />
          </>
        )}
        {rest.map(({ id, ...props }) => <MemberCard key={id} {...props} />)}
      </ScrollView>
    </View>
  );
};

export default TeamSection;
