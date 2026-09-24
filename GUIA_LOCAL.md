# Guía paso a paso: correr el proyecto en tu máquina

Pensada para la primera vez. Sigue los pasos en orden; si algo falla, mira la sección "Problemas frecuentes" al final.

---

## Paso 0 — Qué vas a instalar

| Programa | Para qué sirve | Dónde se descarga |
| --- | --- | --- |
| Git | Descargar el código del repo | https://git-scm.com/downloads |
| Node.js 20 LTS o 22 LTS | Ejecutar el servidor del sitio | https://nodejs.org (botón "LTS") |
| Docker Desktop | Levantar la base de datos MySQL sin instalarla a mano | https://www.docker.com/products/docker-desktop |
| Visual Studio Code | Editar el código | https://code.visualstudio.com |

> Si ya tienes MySQL 8 instalado en tu equipo, puedes saltarte Docker (ver Paso 3, opción B).

Instálalos con las opciones por defecto (siguiente, siguiente, finalizar). Reinicia la computadora si Docker lo pide.

---

## Paso 1 — Abrir una terminal

- **Windows**: menú Inicio → escribe `PowerShell` → abre "Windows PowerShell".
- **macOS**: Cmd + Espacio → escribe `Terminal` → Enter.
- **Linux**: Ctrl + Alt + T.

Comprueba que las herramientas quedaron instaladas escribiendo (Enter después de cada línea):

```bash
git --version
node --version
npm --version
docker --version
```

Cada comando debe responder con un número de versión. `node` debe decir v20 o superior. Si alguno dice "no se reconoce el comando", cierra la terminal, ábrela de nuevo y reintenta; si sigue igual, reinstala ese programa.

---

## Paso 2 — Descargar el proyecto

Elige una carpeta donde guardar tus proyectos y clona el repo:

```bash
cd Documents
git clone https://github.com/haawC/catalogo.git
cd catalogo
```

`cd catalogo` te deja "dentro" del proyecto: todos los comandos siguientes se ejecutan ahí.
Para ver los archivos: `dir` en Windows, `ls` en macOS/Linux.

---

## Paso 3 — Levantar la base de datos MySQL

### Opción A (recomendada): con Docker

Abre Docker Desktop y espera a que diga "Engine running". Luego, en la terminal:

```bash
docker run -d --name catalogo-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=catalogo -p 3306:3306 mysql:8
```

Qué hace: descarga MySQL 8 (la primera vez tarda unos minutos), lo arranca en segundo plano con usuario `root`, contraseña `root` y una base de datos vacía llamada `catalogo`, accesible en el puerto 3306.

Verifica que está corriendo:

```bash
docker ps
```

Debes ver una línea con `catalogo-mysql` y estado `Up`. Espera ~20 segundos tras arrancarlo antes de seguir: MySQL tarda un poco en aceptar conexiones.

Comandos útiles para después:

```bash
docker stop catalogo-mysql     # apagar la base de datos
docker start catalogo-mysql    # volver a encenderla (los datos se conservan)
docker rm -f catalogo-mysql    # borrarla del todo (se pierden los datos)
```

### Opción B: con un MySQL que ya tengas instalado

Crea la base de datos y anota tu usuario y contraseña:

```sql
CREATE DATABASE catalogo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

En el Paso 4 pon tus credenciales reales en `DB_USER` y `DB_PASSWORD`.

---

## Paso 4 — Crear el archivo de configuración `.env`

El proyecto lee sus credenciales de un archivo `.env` que **no** viene en el repo (por seguridad). Cópialo de la plantilla:

```bash
# Windows PowerShell
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Ábrelo en VS Code (`code .env`) y revisa estos valores:

```
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=catalogo
SESSION_SECRET=cambia-esto
ADMIN_USER=admin
ADMIN_PASSWORD=admin123
```

Si usaste la Opción A de Docker, no tienes que cambiar nada. Con la Opción B, ajusta `DB_USER` y `DB_PASSWORD`.

---

## Paso 5 — Instalar las dependencias del proyecto

```bash
npm install
```

Descarga las librerías (Express, EJS, mysql2, etc.) dentro de la carpeta `node_modules`. Tarda 1-2 minutos la primera vez. Es normal ver algún aviso (`warn`); solo importa si aparece `ERR!`.

---

## Paso 6 — Crear las tablas y cargar datos de ejemplo

```bash
npm run migrate
```

Crea la base de datos (si no existe) y la tabla `materiales`. Debe terminar con `Migraciones al dia.`

```bash
npm run seed
```

Inserta 10 materiales de ejemplo para que el catálogo no se vea vacío. Puedes ejecutarlo varias veces, pero duplicará los datos: normalmente basta una.

---

## Paso 7 — Arrancar el sitio

```bash
npm run dev
```

Verás `Catalogo escuchando en http://localhost:3000`. Abre esa dirección en tu navegador:

- **Página pública**: http://localhost:3000 — muestra 6 materiales al azar; recarga (F5) y cambian.
- **Panel de administración**: http://localhost:3000/admin — usuario `admin`, contraseña `admin123`.

Desde el panel puedes crear, editar y eliminar materiales, y los cambios se ven al instante en la página pública.

Para detener el servidor: `Ctrl + C` en la terminal. Con `npm run dev` el servidor se reinicia solo cada vez que guardas un archivo (con `npm start` no).

---

## Paso 8 — Editar el proyecto

Abre la carpeta en VS Code:

```bash
code .
```

Dónde tocar cada cosa:

| Quiero cambiar... | Archivo |
| --- | --- |
| Colores, tipografía, tarjetas | `public/css/estilos.css` |
| Textos y HTML de la página pública | `views/index.ejs`, `views/material.ejs` |
| Pantallas del panel | `views/admin/login.ejs`, `views/admin/lista.ejs`, `views/admin/formulario.ejs` |
| Cabecera y pie comunes | `views/partials/head.ejs`, `views/partials/foot.ejs` |
| Qué URL responde qué | `src/routes/publico.js`, `src/routes/admin.js` |
| Consultas SQL (incluye el `LIMIT 6` aleatorio) | `src/db/materiales.js` |
| Reglas de validación del formulario | `src/validacion.js` |
| Columnas de la base de datos | nuevo archivo en `migrations/` (ej. `002_...sql`) y luego `npm run migrate` |

Guarda el archivo y recarga el navegador: con `npm run dev` los cambios se aplican solos.

Para comprobar que no rompiste nada:

```bash
npm test
```

---

## Paso 9 — Guardar tus cambios en GitHub

```bash
git add .
git commit -m "Describe aquí tu cambio"
git push
```

El archivo `.env` y `node_modules` están en `.gitignore`, así que nunca se suben.

---

## Cada vez que vuelvas a trabajar

```bash
docker start catalogo-mysql   # solo si usas Docker
cd Documents/catalogo
npm run dev
```

---

## Problemas frecuentes

| Mensaje / síntoma | Causa y solución |
| --- | --- |
| `ECONNREFUSED 127.0.0.1:3306` | MySQL no está corriendo. `docker start catalogo-mysql` y espera 20 s. |
| `ER_ACCESS_DENIED_ERROR` | Usuario o contraseña equivocados en `.env`. |
| `ER_NO_SUCH_TABLE: ... materiales` | Falta ejecutar `npm run migrate`. |
| `EADDRINUSE :::3000` | Otro programa usa el puerto 3000. Cambia `PORT=3001` en `.env`. |
| `Bind for 0.0.0.0:3306 failed` al crear el contenedor | Ya tienes algo en el puerto 3306: usa tu MySQL existente (Opción B) o cambia el mapeo a `-p 3307:3306` y pon `DB_PORT=3307`. |
| La página carga pero sin materiales | Faltó `npm run seed`, o todos están marcados como no disponibles en el panel. |
| Las imágenes salen en blanco | Las del ejemplo son URLs externas; si no tienes internet no cargan. Pon tus propias URLs desde el panel. |
| `'npm' no se reconoce` | Node no está instalado o la terminal es anterior a la instalación: ciérrala y ábrela de nuevo. |
