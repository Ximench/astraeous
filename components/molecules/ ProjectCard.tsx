import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/typography';
import AstraBadge from '../atoms/AstraBadge';
import AstraButton from '../atoms/AstraButton';
import GlowText from '../atoms/GlowText';

export interface Project {
  id:            string;
  title:         string;
  status:        string;
  description?:  string;
  thumbnailUri?: string;
}

interface ProjectCardProps extends Omit<Project, 'id'> {
  onPress?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title        = 'Project Name',
  status       = 'IN DEV',
  description,
  thumbnailUri,
  onPress,
}) => (
  <View style={styles.card}>
    {/* Thumbnail */}
    <View style={styles.thumbnail}>
      {thumbnailUri ? (
        <Image source={{ uri: thumbnailUri }} style={styles.thumbnailImg} />
      ) : (
        <View style={styles.thumbnailPlaceholder}>
          <GlowText variant="display" style={styles.placeholderIcon}>✦</GlowText>
        </View>
      )}
      <View style={styles.thumbnailOverlay} />
      <View style={styles.statusBadge}>
        <AstraBadge label={status} variant="status" />
      </View>
    </View>

    {/* Contenido */}
    <View style={styles.content}>
      <GlowText variant="title">{title}</GlowText>

      {description ? (
        <GlowText
          variant="body"
          color={COLORS.whiteAlpha80}
          style={styles.desc}
          numberOfLines={2}
        >
          {description}
        </GlowText>
      ) : null}

      <AstraButton
        label="VER PROYECTO"
        variant="ghost"
        onPress={onPress}
        style={styles.cta}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     COLORS.whiteAlpha10,
    overflow:        'hidden',
  },
  thumbnail: {
    height:          140,
    backgroundColor: COLORS.backgroundElevated,
  },
  thumbnailImg: {
    width:  '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: COLORS.purpleAlpha15,
  },
  placeholderIcon: {
    fontSize: 40,
    color:    COLORS.purpleAlpha30,
  },
  thumbnailOverlay: {
    position:        'absolute',
    bottom:          0,
    left:            0,
    right:           0,
    height:          50,
    backgroundColor: COLORS.backgroundCard,
    opacity:         0.6,
  },
  statusBadge: {
    position: 'absolute',
    top:      SPACING.sm,
    right:    SPACING.sm,
  },
  content: {
    padding: SPACING.md,
    gap:     SPACING.sm,
  },
  desc: {
    lineHeight: 20,
  },
  cta: {
    alignSelf: 'flex-start',
    marginTop: SPACING.xs,
  },
});

export default ProjectCard;