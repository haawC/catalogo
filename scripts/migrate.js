import fs from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'node:url';
import { config } from '../src/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '..', 'migrations');

const conn = await mysql.createConnection({ ...config.db, database: undefined, multipleStatements: true });
await conn.query(
  `CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
);
await conn.changeUser({ database: config.db.database });
await conn.query(
  'CREATE TABLE IF NOT EXISTS migraciones (nombre VARCHAR(255) PRIMARY KEY, aplicada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP)'
);

const [aplicadas] = await conn.query('SELECT nombre FROM migraciones');
const hechas = new Set(aplicadas.map((r) => r.nombre));
const archivos = (await fs.readdir(dir)).filter((n) => n.endsWith('.sql')).sort();

for (const archivo of archivos) {
  if (hechas.has(archivo)) continue;
  const sql = await fs.readFile(path.join(dir, archivo), 'utf8');
  await conn.query(sql);
  await conn.query('INSERT INTO migraciones (nombre) VALUES (?)', [archivo]);
  console.log('Aplicada', archivo);
}

await conn.end();
console.log('Migraciones al dia.');
