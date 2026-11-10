import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\\s\\S]*?)<\\/script>/)?.[1];
assert.ok(script, 'No se encontró el script principal de la app');

class Element {
  constructor(tag = 'div') {
    this.tagName = tag;
    this.children = [];
    this.listeners = {};
    this.attributes = {};
    this.dataset = {};
    this.value = '';
    this.checked = false;
    this.textContent = '';
    this.className = '';
    this.onclick = null;
    this.onchange = null;
    this._innerHTML = '';
  }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  append(...children) { this.children.push(...children); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  set innerHTML(value) {
    this._innerHTML = value;
    if (value === '') this.children = [];
  }
  get innerHTML() { return this._innerHTML; }
}

function boot(storage = {}) {
  const elements = new Map();
  const emotions = ['Feliz', 'Tranquilo/a', 'Triste', 'Enojado/a', 'Nervioso/a', 'Cansado/a']
    .map(feel => {
      const button = new Element('button');
      button.dataset.feel = feel;
      button.setAttribute('aria-pressed', 'false');
      return button;
    });
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, new Element());
      return elements.get(id);
    },
    createElement(tag) { return new Element(tag); },
    querySelectorAll(selector) {
      return selector === '.emotion' ? emotions : [];
    }
  };
  let tick = null;
  const localStorage = {
    getItem(key) { return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null; },
    setItem(key, value) { storage[key] = String(value); }
  };
  const context = {
    document,
    localStorage,
    navigator: { serviceWorker: { register() { throw new Error('Android no debe registrar el service worker'); } } },
    window: { __BRUJULA_NATIVE__: true, addEventListener() {} },
    setInterval(callback) { tick = callback; return 1; },
    clearInterval() { tick = null; },
    Date, JSON, Math, Number, String
  };
  vm.runInNewContext(script, context);
  return { document, emotions, storage, getTick: () => tick };
}

test('la rutina permite completar, agregar y recuperar pasos tras reiniciar el runtime', () => {
  const first = boot();
  const taskRoot = first.document.getElementById('tasks');
  assert.equal(taskRoot.children.length, 5);

  const firstCheckbox = taskRoot.children[0].children[0];
  firstCheckbox.checked = true;
  firstCheckbox.listeners.change();
  assert.match(first.document.getElementById('progress').textContent, /1 de 5/);

  first.document.getElementById('newTask').value = 'Preparar la mochila';
  first.document.getElementById('saveTask').onclick();
  assert.equal(taskRoot.children.length, 6);

  const second = boot(first.storage);
  const restoredTasks = second.document.getElementById('tasks').children;
  assert.equal(restoredTasks.length, 6);
  assert.equal(restoredTasks[0].children[0].checked, true);
  assert.equal(restoredTasks[5].children[1].textContent, 'Preparar la mochila');
});

test('el selector emocional actualiza la interfaz sin escribir un historial local', () => {
  const app = boot();
  app.emotions[2].onclick();
  assert.equal(app.emotions[2].getAttribute('aria-pressed'), 'true');
  assert.match(app.document.getElementById('feeling').textContent, /Triste/);
  assert.deepEqual(Object.keys(app.storage), []);
});

test('el temporizador puede iniciar y pausar sin perder el tiempo restante', () => {
  const app = boot();
  app.document.getElementById('start').onclick();
  assert.equal(typeof app.getTick(), 'function');
  app.getTick()();
  assert.equal(app.document.getElementById('timer').textContent, '09:59');
  app.document.getElementById('pause').onclick();
  assert.equal(app.getTick(), null);
  assert.equal(app.document.getElementById('timer').textContent, '09:59');
});
