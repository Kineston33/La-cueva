# Brújula — MVP

Aplicación web progresiva (PWA) en español para acompañar rutinas infantiles y alfabetización emocional.

## Funciones implementadas
- Rutina editable con tareas marcables y progreso.
- Registro emocional local (sin historial ni envío).
- Temporizador configurable de concentración.
- Ejercicio breve de respiración.
- Persistencia local mediante localStorage.
- Service worker y manifiesto para uso instalable/offline.

## Ejecutar localmente
Servir esta carpeta mediante un servidor estático. Para probar la instalación PWA, usar HTTPS o localhost.

## Alcance y seguridad
Prototipo funcional, no producto clínico ni sustituto de supervisión adulta. No incorpora cuentas, analítica, publicidad, chat, ubicación ni backend. Los datos de rutina quedan en el almacenamiento local del dispositivo.

## Antes de publicar en Google Play
Este repositorio todavía no contiene un APK/AAB ni una compilación Android. Para Play Store hace falta empaquetar la PWA (por ejemplo, con Bubblewrap/TWA o Capacitor), configurar firma y target SDK vigente, probar en dispositivos, completar ficha y política de privacidad, y cumplir la política de familias/niños de Google Play. La publicación requiere revisión y aprobación de Google.
