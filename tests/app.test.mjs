import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const manifest = JSON.parse(await readFile(new URL('../manifest.webmanifest', import.meta.url), 'utf8'));
const worker = await readFile(new URL('../sw.js', import.meta.url), 'utf8');

test('la app tiene idioma español y viewport móvil', () => {
  assert.match(html, /<html lang="es">/);
  assert.match(html, /name="viewport"/);
});

test('el manifiesto declara una PWA independiente', () => {
  assert.equal(manifest.name, 'Brújula — Mi día, paso a paso');
  assert.equal(manifest.display, 'standalone');
  assert.ok(manifest.icons.some(icon => icon.src === 'icon.svg'));
});

test('el service worker precarga los recursos locales esenciales', () => {
  for (const asset of ['./index.html', './manifest.webmanifest', './icon.svg']) {
    assert.ok(worker.includes(asset), `Falta recurso offline: ${asset}`);
  }
});

test('las rutinas se guardan localmente y el contenido del usuario se inserta como texto', () => {
  assert.match(html, /localStorage\.getItem\(KEY\)/);
  assert.match(html, /localStorage\.setItem\(KEY/);
  assert.match(html, /span\.textContent\s*=\s*t\.text/);
});

test('no hay scripts externos ni SDK de anuncios/analítica declarados', () => {
  assert.doesNotMatch(html, /<script[^>]+src\s*=\s*["']https?:/i);
  assert.doesNotMatch(html, /googlesyndication|doubleclick|firebase-analytics|google-analytics/i);
});

test('el contenedor Android no registra un service worker redundante', () => {
  assert.match(html, /window\.Capacitor\?\.isNativePlatform\?\.\(\)===true/);
  assert.match(html, /navigator\.serviceWorker\.register/);
});
