import { query } from './pool.js';

const CAMPOS = 'id, nombre, descripcion, categoria, imagen_url, disponible, creado_en';

export async function listarAleatorios(limite = 6) {
  const n = Math.max(1, Math.min(50, Number(limite) || 6));
  return query(`SELECT ${CAMPOS} FROM materiales WHERE disponible = 1 ORDER BY RAND() LIMIT ${n}`);
}

export async function listarTodos() {
  return query(`SELECT ${CAMPOS} FROM materiales ORDER BY creado_en DESC`);
}

export async function obtener(id) {
  const rows = await query(`SELECT ${CAMPOS} FROM materiales WHERE id = ?`, [id]);
  return rows[0] ?? null;
}

export async function crear({ nombre, descripcion, categoria, imagenUrl, disponible }) {
  const res = await query(
    'INSERT INTO materiales (nombre, descripcion, categoria, imagen_url, disponible) VALUES (?, ?, ?, ?, ?)',
    [nombre, descripcion, categoria, imagenUrl || null, disponible ? 1 : 0]
  );
  return res.insertId;
}

export async function actualizar(id, { nombre, descripcion, categoria, imagenUrl, disponible }) {
  await query(
    'UPDATE materiales SET nombre = ?, descripcion = ?, categoria = ?, imagen_url = ?, disponible = ? WHERE id = ?',
    [nombre, descripcion, categoria, imagenUrl || null, disponible ? 1 : 0, id]
  );
}

export async function eliminar(id) {
  await query('DELETE FROM materiales WHERE id = ?', [id]);
}
