import { mkdir, readFile, writeFile } from 'node:fs/promises';

const variablesPath = 'android/variables.gradle';
let gradle;
try {
  gradle = await readFile(variablesPath, 'utf8');
} catch {
  throw new Error('No existe android/variables.gradle. Ejecutá primero: npx cap add android');
}

for (const [name, value] of [['minSdkVersion', 24], ['compileSdkVersion', 36], ['targetSdkVersion', 36]]) {
  const pattern = new RegExp(`(\\\\b${name}\\\\s*=\\\\s*)\\\\d+`);
  if (!pattern.test(gradle)) {
    throw new Error(`No se encontró ${name} en ${variablesPath}; revisar la plantilla de Capacitor antes de compilar.`);
  }
  gradle = gradle.replace(pattern, `$1${value}`);
}
await writeFile(variablesPath, gradle);

const manifestPath = 'android/app/src/main/AndroidManifest.xml';
let manifest = await readFile(manifestPath, 'utf8');
if (!/<manifest\\b/.test(manifest) || !/<application\\b/.test(manifest)) {
  throw new Error(`El manifiesto ${manifestPath} no tiene la estructura esperada.`);
}

if (!manifest.includes('xmlns:tools=')) {
  manifest = manifest.replace(
    /<manifest\\b([^>]*)>/,
    '<manifest$1 xmlns:tools="http://schemas.android.com/tools">'
  );
}

const internetPermission = /<uses-permission\\b[^>]*android:name=["']android\\.permission\\.INTERNET["'][^>]*\\/?\\s*>/;
const removeInternet = '<uses-permission android:name="android.permission.INTERNET" tools:node="remove" />';
if (internetPermission.test(manifest)) {
  manifest = manifest.replace(internetPermission, removeInternet);
} else {
  manifest = manifest.replace(/(<application\\b)/, `    ${removeInternet}\\n    $1`);
}

const applicationTag = manifest.match(/<application\\b[^>]*>/)?.[0];
if (!applicationTag) throw new Error('No se encontró la etiqueta application en AndroidManifest.xml.');

function setAttribute(tag, name, value) {
  const pattern = new RegExp(`\\\\s${name}=["'][^"']*["']`);
  return pattern.test(tag)
    ? tag.replace(pattern, ` ${name}="${value}"`)
    : tag.replace(/>$/, ` ${name}="${value}">`);
}

let securedApplicationTag = applicationTag;
securedApplicationTag = setAttribute(securedApplicationTag, 'android:allowBackup', 'false');
securedApplicationTag = setAttribute(securedApplicationTag, 'android:fullBackupContent', 'false');
securedApplicationTag = setAttribute(securedApplicationTag, 'android:dataExtractionRules', '@xml/data_extraction_rules');
manifest = manifest.replace(applicationTag, securedApplicationTag);
await writeFile(manifestPath, manifest);

const xmlDirectory = 'android/app/src/main/res/xml';
await mkdir(xmlDirectory, { recursive: true });
await writeFile(`${xmlDirectory}/data_extraction_rules.xml`, `<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
        <exclude domain="root" path="." />
        <exclude domain="file" path="." />
        <exclude domain="database" path="." />
        <exclude domain="sharedpref" path="." />
        <exclude domain="external" path="." />
    </cloud-backup>
    <device-transfer>
        <exclude domain="root" path="." />
        <exclude domain="file" path="." />
        <exclude domain="database" path="." />
        <exclude domain="sharedpref" path="." />
        <exclude domain="external" path="." />
    </device-transfer>
</data-extraction-rules>
`);

console.log('Android configurado: minSdk 24, compile/target SDK 36, sin permiso de red y con copias de seguridad desactivadas.');
