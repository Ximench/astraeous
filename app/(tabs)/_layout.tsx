import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface TabIconProps {
  symbol:   string;
  label:    string;
  focused:  boolean;
}

// ─── Ícono de tab personalizado ───────────────────────────────────────────────
function TabIcon({ symbol, label, focused }: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      {/* Punto activo superior */}
      {focused && <View style={styles.activeDot} />}

      <Text style={[styles.symbol, focused && styles.symbolActive]}>
        {symbol}
      </Text>

      <Text style={[styles.label, focused && styles.labelActive]}>
        {label}
      </Text>
    </View>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,           // Labels los manejamos nosotros
        tabBarActiveTintColor:   COLORS.yellowPale,
        tabBarInactiveTintColor: COLORS.whiteAlpha40,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon symbol="⬡" label="INICIO" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon symbol="✦" label="PROYECTOS" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon symbol="◈" label="EQUIPO" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon symbol="◎" label="PERFIL" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor:  COLORS.backgroundCard,
    borderTopWidth:   1,
    borderTopColor:   COLORS.purpleAlpha30,
    height:           64,
    paddingBottom:    8,
    paddingTop:       4,
    elevation:        0,
  },
  tabItem: {
    alignItems:    'center',
    justifyContent:'center',
    gap:           2,
    paddingTop:    4,
    position:      'relative',
  },
  activeDot: {
    position:        'absolute',
    top:             -4,
    width:           20,
    height:          2,
    backgroundColor: COLORS.yellowPale,
    borderRadius:    1,
    shadowColor:     COLORS.yellowPale,
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   1,
    shadowRadius:    4,
  },
  symbol: {
    fontSize:    20,
    color:       COLORS.whiteAlpha40,
  },
  symbolActive: {
    color:            COLORS.purpleStrong,
    textShadowColor:  COLORS.purpleStrong,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  label: {
    ...FONTS.caption,
    fontSize: 9,
    color:    COLORS.whiteAlpha40,
  },
  labelActive: {
    color:            COLORS.yellowPale,
    textShadowColor:  COLORS.yellowPale,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});