import { ImageSourcePropType } from 'react-native';

export interface GameData {
  id:          string;
  title:       string;
  status:      string;
  description: string;
  thumbnail:   ImageSourcePropType;
  videos:      any[];   // require() de cada .mp4
}

const GAME_PHOTOS: Record<string, ImageSourcePropType> = {
  OM: require('../assets/GamePhotos/OM.jpg'),
  GR: require('../assets/GamePhotos/GR.jpg'),
  DO: require('../assets/GamePhotos/DO.jpg'),
};

export const GAMES: GameData[] = [
  {
    id:        'outcome-memories',
    title:     'Outcome Memories',
    status:    'EN DESARROLLO',
    thumbnail: GAME_PHOTOS.OM,
    videos: [
      require('../assets/Gameplays/OM.mp4'),
    ],
    description:
      'Un lugar creado por un vacío desconocido, similar al uno X vino de. Es un purgatorio infernal, que mantiene cautivos tanto a los Verdugos como a los Supervivientes en líneas temporales infinitas con diferentes resultados.\n\nFue un popular fangame de terror asimétrico en Roblox, basado en el creepypasta de Sonic.EXE y sucesor espiritual de Sonic.EXE: The Disaster. Enfrentaba a sobrevivientes contra un verdugo (EXE) en un purgatorio con estética única.',
  },
  {
    id:        'grace',
    title:     'Grace',
    status:    'EN DESARROLLO',
    thumbnail: GAME_PHOTOS.GR,
    videos: [
      require('../assets/Gameplays/GR.mp4'),
    ],
    description:
      'Un frenético juego de supervivencia en primera persona en Roblox, lanzado en septiembre de 2026. Se clasifica como un "juego de Rooms" centrado en la velocidad, el caos y la acción intensa.\n\nLos jugadores recorren pasillos infinitos mientras evaden entidades hostiles, inspirado en juegos como DOORS, Pressure y Pizza Tower.',
  },
  {
    id:        'doors',
    title:     'DOORS',
    status:    'EN DESARROLLO',
    thumbnail: GAME_PHOTOS.DO,
    videos: [
      require('../assets/Gameplays/DO.mp4'),
    ],
    description:
      'Un popular juego de terror y supervivencia en primera persona dentro de Roblox. Los jugadores deben explorar un hotel embrujado, atravesando habitaciones y abriendo puertas (hasta la 100 o más).\n\nMientras evaden "entidades" (monstruos) que intentan eliminarlos, utilizan objetos de ayuda como linternas y ganzúas para sobrevivir.',
  },
];

export const getGameById = (id: string): GameData | undefined =>
  GAMES.find((g) => g.id === id);