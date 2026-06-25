# GUIA DE TRABAJO

## Overview
Esta guia es para poder orientar a los desarrolladores el flujo de trabajo para la integración del proyecto.
El repositorio debe mantenerse con dos ramas permanentes:
1. `main`
2. `development`

El resto de ramas deben ser temporales. Una vez que el Pull Request sea aprobado y fusionado, la rama temporal debe eliminarse tanto en remoto como en local.

## `main`
`main` es la rama de producción. Solo debe recibir cambios estables, probados y listos para presentación o despliegue final.

Reglas:
- No trabajar directamente sobre `main`.
- No subir commits directos a `main`.
- Integrar a `main` únicamente desde `development`, mediante Pull Request aprobado.
- Mantener `main` como la versión más estable del frontend.

## `development`
`development` es la rama de integración. Todo cambio nuevo debe pasar primero por esta rama antes de llegar a producción.

Reglas:
- Todas las ramas de trabajo deben crearse desde `development`.
- Todo cambio debe entrar a `development` mediante Pull Request.
- `development` debe estar protegida contra pushes directos.
- Los Pull Requests hacia `development` solo deben ser aprobados y fusionados por `@ChillLiz`.
- Después de fusionar un Pull Request, eliminar la rama temporal usada para ese cambio.

## Ramas temporales
Usar ramas temporales para features, fixes, pruebas o ajustes puntuales.

Convención recomendada:
```bash
feature/descripcion-corta
fix/descripcion-corta
hotfix/descripcion-corta
chore/descripcion-corta
```

Ejemplos:
```bash
feature/catalogo-cliente
fix/contraste-tema-cliente
hotfix/login-admin
chore/docker-compose
```

## Protección requerida en GitHub
Configurar una regla de protección para `development` con estas opciones:
- Require a pull request before merging.
- Require approvals.
- Require review from Code Owners.
- Require status checks to pass: `Frontend CI`.
- Do not allow bypassing the above settings.
- Block force pushes.
- Block deletions.

El archivo `.github/CODEOWNERS` define a `@ChillLiz` como responsable del código. Con la opción **Require review from Code Owners**, GitHub exigirá su aprobación para poder fusionar cambios en `development`.

## Integración continua
El repositorio usa GitHub Actions para validar automáticamente que el frontend compile antes de permitir que un cambio entre a una rama protegida.

El workflow se encuentra en:
```text
.github/workflows/frontend-ci.yml
```

El status check que debe quedar como obligatorio en GitHub es:
```text
Frontend CI
```

### Cuándo se ejecuta
`Frontend CI` se ejecuta automáticamente en estos casos:
- Cuando se abre o actualiza un Pull Request hacia `development`.
- Cuando se abre o actualiza un Pull Request hacia `main`.
- Cuando hay un push a `development` o `main`.

### Qué valida
El workflow valida la aplicación Next.js unificada:

| Paso | Validación |
|------|------------|
| Instalación | Ejecuta `pnpm install --frozen-lockfile`. |
| Typecheck | Ejecuta `tsc --noEmit` mediante `pnpm run lint`. |
| Build | Ejecuta `next build` mediante `pnpm run build`. |

Si cualquiera de estos pasos falla, el Pull Request no debe fusionarse hasta corregir el error.

### Cómo debe configurarse la protección de `development`
Sí, es necesario ajustar la protección de `development` para que use la integración continua.

En GitHub:
1. Ir a `Settings -> Branches` o `Settings -> Rules -> Rulesets`.
2. Editar la regla que protege `development`.
3. Activar **Require a pull request before merging**.
4. Activar **Require approvals**.
5. Activar **Require review from Code Owners**.
6. Activar **Require status checks to pass**.
7. Seleccionar el check **Frontend CI**.
8. Activar **Require branches to be up to date before merging** si aparece disponible.
9. Bloquear force pushes y eliminación de rama.
10. Guardar los cambios.

Con esta configuración, GitHub solo permitirá fusionar un Pull Request hacia `development` cuando:
- El PR tenga la aprobación requerida.
- `@ChillLiz` apruebe como Code Owner.
- El check `Frontend CI` termine en verde.
- La rama temporal esté actualizada con `development`, si se activó la opción de ramas actualizadas.

### Qué hacer si falla
Cuando `Frontend CI` falla:
1. Abrir el Pull Request.
2. Entrar al check fallido `Frontend CI`.
3. Revisar cuál paso falló: instalación, typecheck o build.
4. Corregir el error en la misma rama temporal.
5. Hacer push nuevamente para que GitHub Actions vuelva a ejecutar el workflow.

## Flujo recomendado
Todo cambio debe seguir este recorrido:
```text
development -> rama temporal -> Pull Request a development -> pruebas -> aprobación de @ChillLiz -> merge -> eliminar rama temporal
```

Cuando `development` esté estable y lista para producción:
```text
development -> Pull Request a main -> pruebas finales -> merge a main
```

![Flujo de trabajo en repositorio](Diagramas/git_workflow_springboot.svg)

## Flujo del Proceso

### 1. Creación de la rama de trabajo
```bash
git checkout development
git pull origin development
git checkout -b feature/descripcion-corta
```

### 2. Desarrollo y regular Rebasing

* El desarrollador debe trabajar en su rama temporal para el task asignado.
* Ejecutar un rebase cada día o cuando se informe que `development` fue actualizada.

```bash
git fetch origin
git rebase origin/development
```

* Crear commits constantes con mensajes claros.
```bash
git commit -m "feature: implement user authentication"
```

### 3. Push & Create Pull Request

```bash
git push origin feature/descripcion-corta
```

* Crear un Pull Request hacia `development`.
* Agregar detalles sobre lo que se hizo para ese ticket.
* Esperar aprobación de `@ChillLiz`.
* Después del merge, eliminar la rama temporal.

---

## Arquitectura del Frontend

El frontend ahora es una sola aplicación Next.js. Los módulos que antes estaban separados en varias apps se unificaron como rutas dentro del mismo proyecto.

```text
app/
  (cliente)/                 -> rutas públicas del cliente
  admin/                     -> panel administrativo
  comerciante/               -> panel del comerciante

domains/
  cliente/                   -> componentes, vistas, contexto y API del cliente
  admin/                     -> componentes, contexto y API del administrador
  comerciante/               -> componentes, contexto y API del comerciante
```

### Rutas principales

| Ruta | Módulo |
|------|--------|
| `/` | Cliente |
| `/admin` | Administración |
| `/admin/login` | Login administrativo |
| `/comerciante` | Redirección al login del comerciante |
| `/comerciante/login` | Login del comerciante |
| `/comerciante/dashboard` | Panel del comerciante |
| `/recuperacion` | Recuperación de contraseña del cliente |
| `/admin/recuperar-contrasena` | Recuperación de contraseña del administrador |
| `/comerciante/recovery` | Recuperación de contraseña del comerciante |

El frontend se despliega como un único proceso Next.js y un único contenedor Docker. Ya no se usa un gateway Express ni tres apps Next separadas.

### Variables de entorno

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_API_URL` | URL pública del backend usada por Cliente y Admin |
| `NEXT_PUBLIC_API_BASE_URL` | URL pública del backend usada por Comerciante |
| `NEXT_PUBLIC_STORE_LOGO_UPLOAD_MODE` | Modo de carga de logos de tienda |
| `NEXT_PUBLIC_MERCHANT_STORE_SYNC_MODE` | Modo de sincronización del módulo comerciante |

Las variables `NEXT_PUBLIC_*` quedan incluidas en el bundle del navegador durante el build. Si cambia la URL del backend, se debe reconstruir la imagen del frontend.

### Recuperación de contraseña

Los tres tipos de usuario comparten la API de recuperación ubicada en `domains/auth`. Cada pantalla solicita el correo al backend, recibe el enlace por Gmail y valida el token antes de permitir una nueva contraseña.

El frontend solo necesita que `NEXT_PUBLIC_API_URL` o `NEXT_PUBLIC_API_BASE_URL` apunte al backend. La cuenta Gmail y su contraseña de aplicación se configuran únicamente en el backend; nunca deben incluirse en variables `NEXT_PUBLIC_*`.

La nueva contraseña debe tener entre 8 y 72 caracteres e incluir mayúscula, minúscula, número y símbolo. Los enlaces caducan en 30 minutos por defecto y solo pueden utilizarse una vez.

## Despliegue con Docker

La imagen del frontend se construye en la máquina local del desarrollador y se sube a Docker Hub. El servidor EC2 solo descarga la imagen ya compilada — no instala Node.js ni compila nada, lo que evita problemas de espacio en disco.

```text
Internet :80
    |
    v
kingstore-frontend :3000
    |-- /                  Cliente
    |-- /admin             Administración
    `-- /comerciante       Comerciante
             |
             v
  kingstore-backend :8080
             |
             v
       AWS RDS MySQL
```

### Datos del servidor

| Campo | Valor |
|-------|-------|
| IP EC2 | `100.57.218.181` |
| Frontend | `http://100.57.218.181/` |
| Admin | `http://100.57.218.181/admin` |
| Comerciante | `http://100.57.218.181/comerciante/login` |
| Backend | `http://100.57.218.181:8080` |
| Conexión SSH | `ssh -i "kingstore_key.pem" ubuntu@ec2-100-57-218-181.compute-1.amazonaws.com` |

### Imágenes en Docker Hub

| Servicio | Imagen |
|----------|--------|
| Frontend | `bryanpisco/kingstore-frontend:latest` |
| Backend | `bryanpisco/kingstore-backend:latest` |

### Requisitos

- Docker Desktop en la máquina local para construir y publicar la imagen.
- Docker Engine `24` y Docker Compose v2 en el servidor EC2.

---

### Primer despliegue en el servidor (solo una vez)

**1. Preparar el servidor:**

```bash
ssh -i "kingstore_key.pem" ubuntu@ec2-100-57-218-181.compute-1.amazonaws.com

sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker "$USER"
```

Cerrar la sesión SSH y volver a entrar para aplicar el grupo `docker`.

**2. Crear el `docker-compose.yml`:**

```bash
cat > docker-compose.yml << 'EOF'
services:
  frontend:
    image: bryanpisco/kingstore-frontend:latest
    ports:
      - "80:3000"
    environment:
      PORT: "3000"
      HOSTNAME: "0.0.0.0"
    restart: unless-stopped
    depends_on:
      - backend

  backend:
    image: bryanpisco/kingstore-backend:latest
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: "prod"
      JASYPT_ENCRYPTOR_PASSWORD: "${JASYPT_ENCRYPTOR_PASSWORD}"
      JWT_SECRET: "${JWT_SECRET}"
      SPRING_DATASOURCE_PASSWORD: "${SPRING_DATASOURCE_PASSWORD}"
    restart: unless-stopped
EOF
```

**3. Crear el `.env` con los secretos del backend:**

```bash
cat > .env << 'EOF'
JASYPT_ENCRYPTOR_PASSWORD=kingstore-secret-key-2024
JWT_SECRET=kingstore-secret-key-ingesoft-2026
SPRING_DATASOURCE_PASSWORD=<password_rds>
EOF
```

> Las variables `NEXT_PUBLIC_*` no van en el `.env` del servidor — quedan bakeadas dentro de la imagen durante el build local.

**4. Levantar los servicios:**

```bash
docker compose pull
docker compose up -d
docker compose ps
```

---

### Publicar cambios del frontend

Ejecutar desde la raíz del proyecto (`/Frontend`) en tu máquina local:

**1. Construir la imagen con las variables de producción:**

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://100.57.218.181:8080 \
  --build-arg NEXT_PUBLIC_API_BASE_URL=http://100.57.218.181:8080 \
  --build-arg NEXT_PUBLIC_STORE_LOGO_UPLOAD_MODE=local \
  --build-arg NEXT_PUBLIC_MERCHANT_STORE_SYNC_MODE=local \
  -t bryanpisco/kingstore-frontend:latest .
```

**2. Subir la imagen a Docker Hub:**

```bash
docker push bryanpisco/kingstore-frontend:latest
```

**3. Actualizar el servidor:**

```bash
ssh -i "kingstore_key.pem" ubuntu@ec2-100-57-218-181.compute-1.amazonaws.com

docker compose pull frontend
docker compose up -d frontend
docker compose logs --tail=50 frontend
```

---

### Publicar cambios del backend

```bash
# En el repo del backend: compilar y publicar
cd ../Backend
./mvnw clean package -DskipTests
docker build -t bryanpisco/kingstore-backend:latest .
docker push bryanpisco/kingstore-backend:latest

# En el servidor: actualizar
ssh -i "kingstore_key.pem" ubuntu@ec2-100-57-218-181.compute-1.amazonaws.com
docker compose pull backend
docker compose up -d backend
docker compose logs --tail=50 backend
```

---

### Ver logs

```bash
# Frontend en tiempo real
docker compose logs -f frontend

# Backend en tiempo real
docker compose logs -f backend

# Últimas 50 líneas de todos los servicios
docker compose logs --tail=50
```

---

### Detener los servicios

**Detener solo el frontend (el backend sigue corriendo):**
```bash
docker compose stop frontend
```

**Detener solo el backend:**
```bash
docker compose stop backend
```

**Detener todos los servicios (los contenedores se conservan):**
```bash
docker compose stop
```

**Detener y eliminar los contenedores:**
```bash
docker compose down
```

**Detener, eliminar contenedores y limpiar imágenes (fuerza re-descarga en el próximo despliegue):**
```bash
docker compose down --rmi all
```

> Los datos en RDS no se eliminan en ningún caso. Solo se detienen los contenedores.

---

### Security Group de AWS

| Tipo | Puerto | Origen |
|------|--------|--------|
| HTTP | `80` | `0.0.0.0/0` |
| TCP | `8080` | `0.0.0.0/0` |
| SSH | `22` | tu IP |

---

### Diagnóstico rápido

| Problema | Revisión |
|----------|----------|
| El frontend no abre | `docker compose ps` y `docker compose logs frontend` |
| Admin o Comerciante no inician sesión | Verificar URL del backend, CORS y estado del backend |
| Sigue mostrando versión vieja | Reconstruir y pushear la imagen, luego `docker compose pull frontend && docker compose up -d frontend` |
| El puerto 80 no responde | Security Group de EC2 y que el contenedor esté `Up` |
| El backend no responde | `docker compose logs backend` y verificar variables de entorno en `.env` |
