import { ImageSourcePropType } from 'react-native';

export interface MemberData {
  id:       string;
  name:     string;
  realName: string;
  role:     string;
  initials: string;
  bio:      string;
  uri?:     ImageSourcePropType;
  uri_2?:     ImageSourcePropType;
  isLead?:  boolean;
}

const PROFILE_PHOTOS: Record<string, ImageSourcePropType> = {
  Snova:     require('../assets/ProfilePhotos/Snova.jpeg'),
  PF:        require('../assets/ProfilePhotos/PF.jpeg'),
  Vichigato: require('../assets/ProfilePhotos/Vichigato.jpeg'),
  Ximench:   require('../assets/ProfilePhotos/Ximench.jpeg'),
};

const REAL_PHOTOS: Record<string, ImageSourcePropType> = {
  AM:     require('../assets/ProfilePhotos/RealPhotos/ArMa.jpg'),
  OM:        require('../assets/ProfilePhotos/RealPhotos/OlMo.png'),
  VM: require('../assets/ProfilePhotos/RealPhotos/ViMe.jpeg'),
  AC:   require('../assets/ProfilePhotos/RealPhotos/AnCa.jpeg'),
};

export const MEMBERS: MemberData[] = [
  {
    id:       'snova',
    name:     'Snova',
    realName: 'Aarón Machuca',
    role:     'FOUNDER',
    initials: 'SN',
    uri:      PROFILE_PHOTOS.Snova,
    uri_2:    REAL_PHOTOS.AM,
    isLead:   true,
    bio:      'Programador, animador y artista en Roblox. Le gusta hacer cosas visuales y probar ideas nuevas, aunque muchas veces solo sea por diversión.',
  },
  {
    id:       'flordefuegoyseta',
    name:     'Flordefuegoyseta',
    realName: 'Oliver Montalván',
    role:     'ARTIST & ANIMATOR',
    initials: 'PF',
    uri:      PROFILE_PHOTOS.PF,
    uri_2:    REAL_PHOTOS.OM,
    bio:      'Programador, animador, dibujante y modelador. Hace un poco de todo y siempre anda experimentando con diseños, scripts y cosas raras.',
  },
  {
    id:       'vichigato',
    name:     'Vichigato',
    realName: 'Vicente Mendieta',
    role:     'COMPOSITOR',
    initials: 'VI',
    uri:      PROFILE_PHOTOS.Vichigato,
    uri_2:    REAL_PHOTOS.VM,
    bio:      'Hago juegos, programo y compongo música. A veces todo funciona… y a veces explota, pero se ve muy bien. También creo juegos, hago música y rompo cosas… a veces sin querer.',
  },
  {
    id:       'ximench',
    name:     'Ximench',
    realName: 'Andrés Campoverde',
    role:     'QA & CONTENT CREATOR',
    initials: 'XI',
    uri:      PROFILE_PHOTOS.Ximench,
    uri_2:    REAL_PHOTOS.AC,
    bio:      'Programador y creador de contenido. Le gusta desarrollar ideas, experimentar con scripts y probar todo tipo de juegos, siempre buscando algo nuevo que aprender o mejorar.',
  },
];

export const getMemberById = (id: string): MemberData | undefined =>
  MEMBERS.find((m) => m.id === id);