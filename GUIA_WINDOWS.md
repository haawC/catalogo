# Guía paso a paso para Windows (PowerShell)

Todos los comandos se escriben en **PowerShell**, uno por línea y pulsando Enter. Si un comando falla, revisa "Problemas frecuentes" al final.

---

## Paso 1 — Instalar los programas

La forma más rápida es con `winget`, que ya viene en Windows 10/11. Abre el menú Inicio, escribe `PowerShell`, clic derecho → **Ejecutar como administrador**, y pega:

```powershell
winget install --id Git.Git -e
winget install --id OpenJS.NodeJS.LTS -e
winget install --id Docker.DockerDesktop -e
winget install --id Microsoft.VisualStudioCode -e
```

Si prefieres instaladores manuales:
- Git: https://git-scm.com/download/win
- Node.js LTS: https://nodejs.org (botón "LTS")
- Docker Desktop: https://www.docker.com/products/docker-desktop
- VS Code: https://code.visualstudio.com

**Reinicia el equipo** después de instalar Docker Desktop (lo necesita para activar WSL2).

Al terminar, **cierra esa ventana de PowerShell y abre una nueva sin administrador** (los programas recién instalados solo se reconocen en terminales nuevas) y comprueba:

```powershell
git --version
node --version
npm --version
docker --version
```

Cada línea debe responder con una versión; `node` debe ser v20 o superior.

---

## Paso 2 — Descargar el proyecto

```powershell
cd $HOME\Documents
git clone https://github.com/haawC/catalogo.git
cd catalogo
```

Ya estás "dentro" del proyecto. Para ver los archivos: `dir`.

---

## Paso 3 — Levantar MySQL con Docker

Abre **Docker Desktop** desde el menú Inicio y espera a que abajo a la izquierda diga **Engine running**. Después, en PowerShell:

```powershell
docker run -d --name catalogo-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=catalogo -p 3306:3306 mysql:8
```

La primera vez descarga MySQL 8 (unos minutos). Comprueba que quedó encendido:

```powershell
docker ps
```

Debe aparecer `catalogo-mysql` con estado `Up`. Espera unos 20 segundos antes de continuar: MySQL tarda en aceptar conexiones.

Para más adelante:

```powershell
docker stop catalogo-mysql     # apagar la base de datos
docker start catalogo-mysql    # encenderla otra vez (conserva los datos)
docker rm -f catalogo-mysql    # borrarla por completo
```

---

## Paso 4 — Crear el archivo `.env`

```powershell
Copy-Item .env.example .env
code .env
```

Con Docker no necesitas cambiar nada (usuario `root`, contraseña `root`, base `catalogo`). Si usas un MySQL propio, ajusta `DB_USER` y `DB_PASSWORD`.

---

## Paso 5 — Instalar dependencias

```powershell
npm install
```

Tarda 1-2 minutos. Los avisos `warn` son normales; solo importan los `ERR!`.

> Si aparece el error rojo *"No se puede cargar el archivo npm.ps1 ... ejecución de scripts está deshabilitada"*, ejecuta una sola vez:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```
> Confirma con `S` y repite `npm install`.

---

## Paso 6 — Crear las tablas y datos de ejemplo

```powershell
npm run migrate
npm run seed
```

`migrate` debe terminar con `Migraciones al dia.` y `seed` con `Insertados 10 materiales.`

---

## Paso 7 — Arrancar el sitio

```powershell
npm run dev
```

Cuando veas `Catalogo escuchando en http://localhost:3000`, abre en el navegador:

- Catálogo público: http://localhost:3000 (6 materiales al azar; pulsa F5 y cambian)
- Panel: http://localhost:3000/admin → usuario `admin`, contraseña `admin123`

Para detenerlo: `Ctrl + C` en PowerShell. Si Windows muestra el aviso del Firewall, permite el acceso en redes privadas.

Con `npm run dev` el servidor se reinicia solo al guardar archivos.

---

## Paso 8 — Editar el código

```powershell
code .
```

| Quiero cambiar... | Archivo |
| --- | --- |
| Colores y estilos | `public/css/estilos.css` |
| Página principal / ficha | `views/index.ejs`, `views/material.ejs` |
| Pantallas del panel | `views/admin/*.ejs` |
| Cabecera y pie | `views/partials/head.ejs`, `views/partials/foot.ejs` |
| Rutas (URLs) | `src/routes/publico.js`, `src/routes/admin.js` |
| Consultas SQL (el `LIMIT 6` aleatorio) | `src/db/materiales.js` |
| Validación del formulario | `src/validacion.js` |
| Nuevas columnas en la BD | nuevo archivo en `migrations/` + `npm run migrate` |

Guarda y recarga el navegador. Para verificar que nada se rompió: `npm test`.

---

## Paso 9 — Subir tus cambios

```powershell
git add .
git commit -m "Describe tu cambio"
git push
```

`.env` y `node_modules` nunca se suben (están en `.gitignore`).

---

## Rutina diaria

```powershell
docker start catalogo-mysql
cd $HOME\Documents\catalogo
npm run dev
```

---

## Problemas frecuentes en Windows

| Mensaje | Solución |
| --- | --- |
| `npm : No se puede cargar el archivo ... npm.ps1` | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` y reintenta. |
| `'npm' no se reconoce como un comando` | Cierra PowerShell y ábrelo de nuevo; si sigue, reinstala Node.js. |
| `error during connect: ... docker_engine` | Docker Desktop no está abierto o no terminó de arrancar. |
| `ECONNREFUSED 127.0.0.1:3306` | El contenedor está apagado: `docker start catalogo-mysql` y espera 20 s. |
| `Bind for 0.0.0.0:3306 failed: port is already allocated` | Ya hay un MySQL en ese puerto: usa `-p 3307:3306` al crear el contenedor y pon `DB_PORT=3307` en `.env`. |
| `ER_NO_SUCH_TABLE ... materiales` | Falta `npm run migrate`. |
| `EADDRINUSE :::3000` | Cambia `PORT=3001` en `.env` y abre http://localhost:3001 |
| Docker pide habilitar WSL2 | Ejecuta `wsl --install` como administrador y reinicia. |
| Las imágenes de ejemplo salen en blanco | Son URLs externas de internet; sustitúyelas por las tuyas desde el panel. |
