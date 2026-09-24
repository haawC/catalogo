# Catálogo de materiales

Sitio web en Express + MySQL que muestra 6 materiales al azar en cada carga y ofrece un panel de administración para dar de alta, editar y eliminar recursos.

¿Primera vez? Sigue la [guía paso a paso](GUIA_LOCAL.md) (o la [guía para Windows](GUIA_WINDOWS.md)).

## Requisitos

- Node.js 20 o superior
- MySQL 8 (o MariaDB 10.6+)

## Puesta en marcha

```bash
cp .env.example .env     # ajusta credenciales de MySQL y del admin
npm install
npm run migrate          # crea la base de datos y la tabla materiales
npm run seed             # datos de ejemplo (opcional)
npm start                # http://localhost:3000
```

Levantar MySQL con Docker:

```bash
docker run -d --name catalogo-mysql -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=catalogo -p 3306:3306 mysql:8
```

## Panel de administración

- URL: `/admin` (login en `/admin/login`)
- Usuario y contraseña se configuran con `ADMIN_USER` y `ADMIN_PASSWORD_HASH`.
- Genera el hash con `npm run hash -- miPassword`. En desarrollo puedes usar `ADMIN_PASSWORD` en texto plano; si hay hash, tiene prioridad.

## Rutas

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/` | Catálogo con 6 materiales al azar |
| GET | `/material/:id` | Ficha de un material |
| GET | `/api/materiales/aleatorios` | Los mismos 6 materiales en JSON |
| GET/POST | `/admin/login` | Acceso al panel |
| GET | `/admin` | Listado completo |
| GET/POST | `/admin/nuevo` | Alta de material |
| GET/POST | `/admin/:id/editar` | Edición |
| POST | `/admin/:id/eliminar` | Baja |

## Base de datos

Tabla `materiales`: `id`, `nombre`, `descripcion`, `categoria`, `imagen_url`, `disponible`, `creado_en`, `actualizado_en`.
Las migraciones viven en `migrations/` y se aplican una sola vez (registro en la tabla `migraciones`).

## Tests

```bash
npm test
```
