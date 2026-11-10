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

- Identificador Android: `ar.brujula.infantil`.
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

El workflow `.github/workflows/android-build.yml` se ejecuta al hacer push a `main` o manualmente desde la pestaña Actions. Ejecuta las pruebas estáticas y genera:

- APK debug para pruebas.
- AAB release sin firmar.

Los artefactos se publican como artifact de GitHub Actions durante 14 días. El AAB sin firmar **no se puede subir a Google Play**. Para una versión publicable hay que crear una clave de carga, guardarla como secreto seguro y configurar la firma de release; nunca subir el keystore ni sus contraseñas al repositorio.

## Privacidad y seguridad

La app no incorpora cuentas, publicidad, analítica, chat, ubicación ni backend. Las rutinas se guardan en el almacenamiento local del dispositivo. La selección emocional no se guarda como historial. El código de la app no incorpora SDKs de terceros.

La compilación Capacitor puede incluir el permiso de red requerido por el runtime WebView; no se añadió funcionalidad de envío de datos. Hay que inspeccionar el manifiesto Android generado y probar el comportamiento de red antes de publicar.

## Pendiente antes de Google Play

1. Ejecutar y revisar el resultado del workflow de Android.
2. Probar APK en dispositivos reales: instalación, rotación, navegación, almacenamiento y funcionamiento sin conexión.
3. Revisar el manifiesto Android final y permisos efectivos.
4. Crear una política de privacidad pública, con identidad y contacto reales del responsable, y enlazarla dentro de la app y en Play Console.
5. Completar Seguridad de los datos, audiencia objetivo, clasificación IARC y declaraciones de la Política de Familias con información veraz.
6. Configurar firma de release, ficha de tienda, capturas, icono y pruebas requeridas por Play Console.

## Alcance

Prototipo funcional, no producto clínico ni sustituto de supervisión adulta. La app está orientada a niños; por eso no debe publicarse hasta completar la revisión de la Política de Familias y las pruebas de seguridad y privacidad.
