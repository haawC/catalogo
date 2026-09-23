import { pool } from '../src/db/pool.js';

const materiales = [
  ['Taladro percutor 750W', 'Taladro con percusion para obra y mantenimiento.', 'Herramientas', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800'],
  ['Cemento gris 50 kg', 'Saco de cemento de uso general para estructuras.', 'Construccion', 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800'],
  ['Casco de seguridad', 'Casco certificado ANSI para trabajo en obra.', 'Seguridad', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800'],
  ['Cable THHN 12 AWG', 'Rollo de 100 m para instalaciones electricas.', 'Electricidad', 'https://images.unsplash.com/photo-1601987077677-5346c0c57d3f?w=800'],
  ['Pintura latex blanca 20 L', 'Pintura lavable para interiores.', 'Acabados', 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800'],
  ['Tubo PVC 4 pulgadas', 'Tubo sanitario de 3 m para desague.', 'Plomeria', 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800'],
  ['Andamio modular', 'Modulo de andamio galvanizado 1.5 m.', 'Construccion', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800'],
  ['Guantes anticorte', 'Par de guantes nivel 5 resistentes al corte.', 'Seguridad', 'https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?w=800'],
  ['Amoladora angular 4.5', 'Amoladora de 900W con disco incluido.', 'Herramientas', 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800'],
  ['Malla electrosoldada', 'Panel de malla 6x2.4 m para losas.', 'Construccion', 'https://images.unsplash.com/photo-1590959651373-a3db0f38c961?w=800']
];

for (const [nombre, descripcion, categoria, imagen] of materiales) {
  await pool.execute(
    'INSERT INTO materiales (nombre, descripcion, categoria, imagen_url, disponible) VALUES (?, ?, ?, ?, 1)',
    [nombre, descripcion, categoria, imagen]
  );
}

console.log(`Insertados ${materiales.length} materiales.`);
await pool.end();
