# Astraeous

Astraeous es una aplicación creada con Expo y `expo-router` que usa React Native y Tailwind para construir una experiencia multiplataforma. El proyecto está diseñado para ejecutarse en Android, iOS y web con navegación basada en archivos.

## Cómo funciona

- `expo-router` gestiona las rutas usando la carpeta `app/`.
- `app/_layout.tsx` define el contenedor raíz y carga los estilos globales.
- Las pantallas se organizan en `app/(tabs)/` con rutas como `home`, `profile`, `projects` y `team`.
- La carpeta `components/` contiene los componentes reutilizables ordenados por niveles:
  - `atoms/`: componentes básicos como botones, avatares y separadores.
  - `molecules/`: componentes compuestos como tarjetas y cabeceras.
  - `organisms/`: secciones completas de página como `HomeHero`, `ProfileSection`, `ProjectsSection` y `TeamSection`.
- `constants/` guarda configuración de diseño reutilizable como colores, juegos y tipografía.
- `global.css` contiene estilos globales y utilidades Tailwind.

## Instalación

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar el proyecto:

```bash
npm start
```

3. Ejecutar en Android:

```bash
npm run android
```

4. Ejecutar en iOS:

```bash
npm run ios
```

5. Ejecutar en web:

```bash
npm run web
```

## Scripts principales

- `npm start`: inicia el servidor de desarrollo de Expo.
- `npm run android`: compila y ejecuta la app en un emulador/dispositivo Android.
- `npm run ios`: compila y ejecuta la app en un emulador/dispositivo iOS.
- `npm run web`: inicia la versión web de la app.
- `npm run lint`: ejecuta ESLint.
- `npm run reset-project`: mueve el código inicial a `app-example` y crea una carpeta `app` limpia.

## Archivos y carpetas principales

- `app/`: ruta principal de la aplicación.
  - `_layout.tsx`: layout raíz con `SafeAreaView` y `Stack` de navegación.
  - `index.tsx`: pantalla de inicio principal.
  - `(tabs)/`: diseño de pestañas para la navegación dentro de la app.
- `assets/`: imágenes, canciones y otros recursos estáticos.
- `components/`: componentes reutilizables clasificados por nivel.
- `constants/`: constantes de estilo y datos.
- `global.css`: estilos globales compartidos.
- `babel.config.js`, `tsconfig.json`, `tailwind.config.js`: configuración de compilación, TypeScript y Tailwind.
- `app.json`, `eas.json`, `metro.config.js`: configuración de Expo y Metro.

## Dependencias importantes

- `expo`: plataforma base para la app.
- `expo-router`: navegación basada en archivos.
- `nativewind` y `tailwindcss`: estilos con Tailwind en React Native.
- `react-native-safe-area-context`: manejo de áreas seguras.
- `react-native-gesture-handler` y `react-native-reanimated`: animaciones y gestos.
- `lucide`, `lucide-react-native`: iconos.

## Uso básico

- Edita las páginas dentro de `app/` para cambiar las rutas.
- Agrega nuevos componentes en `components/` y reutilízalos en las pantallas.
- Usa `constants/` para mantener colores y tipografía consistentes.
- Coloca recursos de imágenes o audio en `assets/`.

## Notas

- La aplicación está pensada como una plantilla Expo con navegación en pestañas.
- Si necesitas resetear el proyecto a una versión base, usa `npm run reset-project`.
