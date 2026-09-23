import test from 'node:test';
import assert from 'node:assert/strict';
import { validarMaterial } from '../src/validacion.js';

test('acepta un material valido', () => {
  const { errores, valores } = validarMaterial({
    nombre: 'Cemento gris',
    descripcion: 'Saco de 50 kg',
    categoria: 'Construccion',
    imagen_url: 'https://ejemplo.com/a.jpg',
    disponible: 'on'
  });
  assert.deepEqual(errores, []);
  assert.equal(valores.nombre, 'Cemento gris');
  assert.equal(valores.disponible, true);
});

test('rechaza nombre corto y url invalida', () => {
  const { errores } = validarMaterial({ nombre: 'ab', imagen_url: 'ftp://x' });
  assert.equal(errores.length, 2);
});

test('disponible es falso si no se envia', () => {
  const { valores } = validarMaterial({ nombre: 'Taladro percutor' });
  assert.equal(valores.disponible, false);
});
