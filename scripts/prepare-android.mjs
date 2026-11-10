import { readFile, writeFile } from 'node:fs/promises';

const path = 'android/variables.gradle';
let gradle;
try {
  gradle = await readFile(path, 'utf8');
} catch {
  throw new Error('No existe android/variables.gradle. Ejecutá primero: npx cap add android');
}

for (const [name, value] of [['compileSdkVersion', 36], ['targetSdkVersion', 36]]) {
  const pattern = new RegExp(`(\\b${name}\\s*=\\s*)\\d+`);
  if (!pattern.test(gradle)) {
    throw new Error(`No se encontró ${name} en ${path}; revisar la plantilla de Capacitor antes de compilar.`);
  }
  gradle = gradle.replace(pattern, `$1${value}`);
}
await writeFile(path, gradle);
console.log('Android configurado para compileSdkVersion 36 y targetSdkVersion 36.');
