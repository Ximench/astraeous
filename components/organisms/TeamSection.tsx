import React from 'react';
import { ScrollView, View } from 'react-native';
import AstraDivider from '../atoms/AstraDivider';
import AstraHeader from '../molecules/ AstraHeader';
import MemberCard, { Member } from '../molecules/ MemberCard';

// Las imágenes se importan estáticamente para que el bundler de Metro las resuelva
const PROFILE_PHOTOS: Record<string, any> = {
  Snova:      require('../../assets/ProfilePhotos/Snova.jpeg'),
  PF:         require('../../assets/ProfilePhotos/PF.jpeg'),
  Vichigato:  require('../../assets/ProfilePhotos/Vichigato.jpeg'),
  Ximench:    require('../../assets/ProfilePhotos/Ximench.jpeg'),
};

const PLACEHOLDER_MEMBERS: Member[] = [
  {
    id:       '1',
    name:     'Snova',
    realName: 'Aarón Machuca',
    role:     'FOUNDER',
    initials: 'SN',
    uri:      PROFILE_PHOTOS.Snova,
    isLead:   true,
  },
  {
    id:       '2',
    name:     'Flordefuegoyseta',
    realName: 'Oliver Montalván',
    role:     'ARTISTA',
    initials: 'PF',
    uri:      PROFILE_PHOTOS.PF,
  },
  {
    id:       '3',
    name:     'Vichigato',
    realName: 'Vicente Mendieta',
    role:     'COMPOSITOR',
    initials: 'VI',
    uri:      PROFILE_PHOTOS.Vichigato,
  },
  {
    id:       '4',
    name:     'Ximench',
    realName: 'Andrés Campoverde',
    role:     'TESTER',
    initials: 'XI',
    uri:      PROFILE_PHOTOS.Ximench,
  },
];

interface TeamSectionProps {
  members?: Member[];
}

const TeamSection: React.FC<TeamSectionProps> = ({
  members = PLACEHOLDER_MEMBERS,
}) => {
  const leads = members.filter((m) => m.isLead);
  const rest  = members.filter((m) => !m.isLead);

  return (
    <View className="flex-1">
      <AstraHeader title="EQUIPO" subtitle="MIEMBROS DE ASTRAEOUS" />
      <ScrollView
        contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: 64 }}
        showsVerticalScrollIndicator={false}
      >
        {leads.length > 0 && (
          <>
            {leads.map(({ id, ...props }) => (
              <MemberCard key={id} {...props} />
            ))}
            <AstraDivider variant="dashed" />
          </>
        )}
        {rest.map(({ id, ...props }) => (
          <MemberCard key={id} {...props} />
        ))}
      </ScrollView>
    </View>
  );
};

export default TeamSection;