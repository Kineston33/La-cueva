import { cp, mkdir } from 'node:fs/promises';

const assets = ['index.html', 'manifest.webmanifest', 'sw.js', 'icon.svg'];
await mkdir('www', { recursive: true });
for (const asset of assets) {
  await cp(asset, `www/${asset}`);
}
console.log(`Web bundle preparado: ${assets.join(', ')}`);
