# Gateway local

Reverse proxy minimo (Express + `http-proxy-middleware`) que expone las 3 apps
de Next.js (`Cliente`, `Admin`, `Comerciante`) bajo un solo puerto, para poder
navegar entre ellas como si fueran una sola aplicacion en entorno local.

No reemplaza Docker/Nginx ni el gateway de produccion: es solo una herramienta
de desarrollo local. Cualquier configuracion de Docker futura debe ser aditiva
y separada de estos scripts.

## Arquitectura

```
                 ┌──────────────────────┐
 localhost:3000  │       Gateway         │
  (este proxy)   │  (Express + proxy)   │
                 └──────────┬────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
 Cliente (3002)        Admin (3001)        Comerciante (3003)
   sin basePath        basePath /admin     basePath /comerciante
```

| Ruta externa (gateway, puerto 3000) | App         | Puerto interno | basePath        |
| ------------------------------------ | ----------- | --------------- | ---------------- |
| `/` (todo lo que no sea /admin o /comerciante) | Cliente     | 3002             | (ninguno)         |
| `/admin/**`                           | Admin       | 3001             | `/admin`          |
| `/comerciante/**`                     | Comerciante | 3003             | `/comerciante`    |

Como Admin y Comerciante ya tienen configurado `basePath`, sus propios
assets (`/admin/_next/...`, `/comerciante/_next/...`) ya incluyen el
prefijo correcto, por lo que el proxy reenvia la ruta completa sin
necesidad de reescribirla. Cliente no tiene `basePath`, por lo que sus
assets (`/_next/...`) caen en la regla "todo lo demas".

## Como ejecutar

Desde la raiz del repo `Frontend`:

```bash
pnpm install            # solo la primera vez (instala concurrently en la raiz)
pnpm dev:gateway
```

Esto levanta en paralelo:

- Cliente en `http://localhost:3002`
- Admin en `http://localhost:3001/admin`
- Comerciante en `http://localhost:3003/comerciante`
- Gateway en `http://localhost:3000`

Y permite acceder a todo desde:

- `http://localhost:3000/` -> Cliente
- `http://localhost:3000/admin` -> Admin
- `http://localhost:3000/comerciante` -> Comerciante

## Scripts disponibles (raiz del repo)

- `pnpm dev:cliente` - levanta solo Cliente (puerto 3002)
- `pnpm dev:admin` - levanta solo Admin (puerto 3001)
- `pnpm dev:comerciante` - levanta solo Comerciante (puerto 3003)
- `pnpm dev:gateway-server` - levanta solo el proceso del gateway (puerto 3000), asumiendo que las 3 apps ya estan corriendo
- `pnpm dev:gateway` - levanta las 3 apps + el gateway con `concurrently`

## Ejecutar el gateway solo

```bash
cd Gateway
pnpm install   # solo la primera vez
pnpm dev
```

Variables de entorno opcionales (con valores por defecto):

- `GATEWAY_PORT` (default `3000`)
- `CLIENTE_TARGET` (default `http://localhost:3002`)
- `ADMIN_TARGET` (default `http://localhost:3001`)
- `COMERCIANTE_TARGET` (default `http://localhost:3003`)

## Notas / limitaciones conocidas

- El proxy de websockets (usado por el HMR de Next.js en modo dev) se enruta
  segun el prefijo de la URL (`/admin`, `/comerciante`, resto -> Cliente).
  Si el hot-reload de alguna app no refresca correctamente a traves del
  gateway, se puede seguir trabajando contra su puerto interno directamente
  (3001, 3002 o 3003) y usar el gateway solo para navegacion integrada.
