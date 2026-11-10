import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';

const assets = ['manifest.webmanifest', 'sw.js', 'icon.svg'];
await mkdir('www', { recursive: true });
for (const asset of assets) {
  await cp(asset, \`www/\${asset}\`);
}
const sourceHtml = await readFile('index.html', 'utf8');
if (!sourceHtml.includes('</head>')) {
  throw new Error('index.html no contiene </head>; no se pudo preparar el bundle Android.');
}
const nativeHtml = sourceHtml.replace('</head>', '<script>window.__BRUJULA_NATIVE__=true;</script>\n</head>');
await writeFile('www/index.html', nativeHtml);
console.log(\`Bundle Android preparado: index.html + \${assets.join(', ')}\`);
