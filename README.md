# Brújula — MVP

Aplicación en español para acompañar rutinas infantiles y alfabetización emocional.

## Funciones implementadas

- Rutina editable con tareas marcables y progreso.
- Selector de emociones sin historial ni envío.
- Temporizador configurable de concentración.
- Ejercicio breve de respiración.
- Persistencia local mediante `localStorage`.
- PWA con manifiesto y service worker para recursos offline.

## Proyecto Android

El proyecto usa Capacitor 8.6.0 y genera el proyecto nativo Android durante la compilación automatizada.

- Identificador Android provisional: `ar.brujula.infantil` (confirmarlo antes de publicar; debe mantenerse estable).
- Nombre de la app: `Brújula`.
- `webDir`: `www`, generado desde los recursos locales del repositorio.
- SDK mínimo 24 (Android 7.0), API de compilación 36 y API objetivo 36 (Android 16).
- No se agregaron SDKs de anuncios, analítica, chat ni permisos sensibles.
- La compilación se ejecuta en GitHub Actions con Node 22, Java 21 y Android SDK 36.

### Compilar localmente

Requisitos: Node.js 22+, Android Studio compatible con Capacitor 8 y Android SDK API 36.

```bash
npm install
npm test
npm run build:web
npx cap add android
npm run prepare:android
npx cap sync android
npx cap open android
```

Desde Android Studio se puede ejecutar en un dispositivo o emulador. Para generar artefactos desde terminal:

```bash
cd android
./gradlew assembleDebug bundleRelease
```

### Compilación automática

El workflow `.github/workflows/android-build.yml` se ejecuta al hacer push a `main` o manualmente desde la pestaña Actions. Ejecuta pruebas de estructura y lógica con DOM simulado, prepara el bundle local y genera:

- APK debug para pruebas.
- AAB release sin firmar.

Los artefactos se publican como artifact de GitHub Actions durante 14 días. El AAB sin firmar **no se puede subir a Google Play**. Para una versión publicable hay que crear una clave de carga, guardarla como secreto seguro y configurar la firma de release; nunca subir el keystore ni sus contraseñas al repositorio.

## Privacidad y seguridad

La app no incorpora cuentas, publicidad, analítica, chat, ubicación ni backend. Las rutinas se guardan en `localStorage` del dispositivo. La selección emocional no se guarda como historial. No se integran SDKs de anuncios, seguimiento ni analítica; el proyecto Android usa las dependencias base de Capacitor y AndroidX.

Durante la preparación Android se elimina del manifiesto fusionado el permiso `INTERNET` y se desactivan las copias de seguridad de la app, tanto en nube como en transferencia entre dispositivos. La app utiliza únicamente recursos empaquetados localmente. Estos controles deben volver a comprobarse sobre cada APK/AAB generado.

## Pendiente antes de Google Play

1. Instalar el APK en dispositivos reales y probar inicio, navegación, rotación, persistencia, cierre/reapertura y uso en modo avión.
2. Verificar el manifiesto del AAB de release, en particular `targetSdk 36`, ausencia de permisos de red/sensibles y copias de seguridad desactivadas.
3. Crear una política de privacidad pública, con identidad y contacto reales del responsable, y enlazarla dentro de la app y en Play Console.
4. Completar Seguridad de los datos, audiencia objetivo, clasificación IARC y declaraciones de la Política de Familias con información veraz.
5. Completar la declaración de Apps de salud: Google exige el formulario para todas las apps; evaluar y declarar correctamente si el ejercicio de respiración entra en estrés/relajación.
6. Confirmar el identificador Android y preparar iconos nativos y recursos gráficos de tienda.
7. Configurar firma de release, ficha de tienda, capturas y pruebas requeridas por Play Console.

## Alcance

Prototipo funcional, no producto clínico ni sustituto de supervisión adulta. La app está orientada a niños; por eso no debe publicarse hasta completar la revisión de la Política de Familias y las pruebas de seguridad y privacidad.
