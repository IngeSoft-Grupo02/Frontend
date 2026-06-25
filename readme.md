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

El frontend se despliega automáticamente en EC2 mediante GitHub Actions al hacer push a `main`. No se requiere Docker Hub ni intervención manual en el servidor.

```text
push a main
     │
GitHub Actions
     ├── next build (con NEXT_PUBLIC_* bakeadas)
     ├── docker build        → imagen local (sin registry)
     ├── docker save | gzip | scp → frontend-image.tar.gz al EC2
     └── ssh: docker load + compose up
                    │
              EC2:80 (Next.js)
                    │
              EC2:8080 (Spring Boot)
                    │
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

### Requisitos

- Docker instalado en el servidor EC2.
- Secrets y variables configurados en el repositorio de GitHub.

---

### Configuración inicial (solo una vez)

#### Servidor

```bash
ssh -i "kingstore_key.pem" ubuntu@ec2-100-57-218-181.compute-1.amazonaws.com
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu
```

Cerrar la sesión y volver a entrar para aplicar el grupo `docker`.

#### Secrets y variables en GitHub

**GitHub → IngeSoft-Grupo02/Frontend → Settings → Environments → production**

**Secrets:**

| Secret | Descripción |
|--------|-------------|
| `EC2_HOST` | IP del servidor (`100.57.218.181`) |
| `EC2_USER` | Usuario SSH (`ubuntu`) |
| `EC2_SSH_KEY` | Contenido completo del archivo `kingstore_key.pem` |
| `EC2_KNOWN_HOSTS` | Output de `ssh-keyscan 100.57.218.181` |

**Variables:**

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `http://100.57.218.181:8080` |
| `NEXT_PUBLIC_API_BASE_URL` | `http://100.57.218.181:8080` |
| `NEXT_PUBLIC_STORE_LOGO_UPLOAD_MODE` | `api` |
| `NEXT_PUBLIC_MERCHANT_STORE_SYNC_MODE` | `auto` |

> Las variables `NEXT_PUBLIC_*` quedan bakeadas dentro de la imagen durante el build en GitHub Actions. Si cambia la URL del backend, se debe volver a desplegar.

---

### Publicar nueva versión

Solo hace falta hacer merge a `main`. El workflow `.github/workflows/frontend-cd.yml` se activa automáticamente y:

1. Construye la imagen Next.js con las variables de producción
2. La transfiere al EC2 vía SSH/SCP
3. Levanta el contenedor con `docker-compose.production.yml`
4. Verifica que `http://100.57.218.181/admin/login` responda con 200

Puedes seguir el progreso en la pestaña **Actions** del repositorio en GitHub.

Para desplegar desde una rama específica sin hacer merge a `main`:

**GitHub → Actions → Frontend CD → Run workflow → selecciona la rama → Run workflow**

---

### Ver logs del frontend en el servidor

```bash
ssh -i "kingstore_key.pem" ubuntu@ec2-100-57-218-181.compute-1.amazonaws.com
cd ~/kingstore/frontend

# Últimas 50 líneas
docker compose -f docker-compose.production.yml logs frontend --tail=50

# En tiempo real (Ctrl+C para salir)
docker compose -f docker-compose.production.yml logs frontend -f
```

---

### Detener el frontend

```bash
ssh -i "kingstore_key.pem" ubuntu@ec2-100-57-218-181.compute-1.amazonaws.com
cd ~/kingstore/frontend
```

**Detener el contenedor (se puede reiniciar):**
```bash
docker compose -f docker-compose.production.yml stop
```

**Detener y eliminar el contenedor:**
```bash
docker compose -f docker-compose.production.yml down
```

**Apagar y limpiar la imagen (el próximo CD la reconstruye):**
```bash
docker compose -f docker-compose.production.yml down --rmi all
```

> Los datos en RDS no se eliminan en ningún caso. Solo se detiene el contenedor.

---

### Apagar el servidor EC2 para ahorrar créditos

Detener los contenedores Docker **no detiene el cobro de EC2** — la instancia sigue corriendo y consumiendo créditos. Para pausar completamente el servidor:

**Desde la consola de AWS:**
1. Ir a **EC2 → Instances**
2. Seleccionar la instancia `100.57.218.181`
3. **Instance State → Stop instance**

> **Stop** conserva el disco EBS (mínimo costo). **Terminate** elimina la instancia y todos sus datos permanentemente.

Al volver a iniciarla (**Start instance**), la IP elástica `100.57.218.181` se mantiene — no hay que reconfigurar nada.

**Desde la CLI de AWS (opcional):**
```bash
# Obtener el instance ID primero
aws ec2 describe-instances --filters "Name=ip-address,Values=100.57.218.181" \
  --query "Reservations[0].Instances[0].InstanceId" --output text

# Detener
aws ec2 stop-instances --instance-ids <instance-id>

# Iniciar
aws ec2 start-instances --instance-ids <instance-id>
```

---

### GitHub Actions — consumo de minutos

Los workflows **solo se ejecutan cuando se hace push a `main` o se disparan manualmente**. No corren de forma continua ni en segundo plano.

| Plan de GitHub | Minutos gratuitos/mes |
|---------------|----------------------|
| Repositorio público | Ilimitados |
| Free (privado) | 2 000 min |
| Team (privado) | 3 000 min |

Cada deploy del frontend tarda aproximadamente **8–12 minutos** (build de Next.js). Si el repositorio es público, no hay costo.

---

### Security Group de AWS

| Tipo | Puerto | Origen |
|------|--------|--------|
| HTTP | `80` | `0.0.0.0/0` |
| TCP | `8080` | `0.0.0.0/0` |
| SSH | `22` | `0.0.0.0/0` (requerido para GitHub Actions) |

---

### Diagnóstico rápido

| Problema | Revisión |
|----------|----------|
| El frontend no abre | `docker compose -f docker-compose.production.yml ps` y `logs frontend` |
| Admin o Comerciante no inician sesión | Verificar URL del backend, CORS y estado del backend |
| Sigue mostrando versión vieja | Volver a disparar el workflow en GitHub Actions |
| El puerto 80 no responde | Security Group de EC2 y que el contenedor esté `Up` |
| El backend no responde | Ver logs en `~/kingstore/backend/` y verificar secrets en GitHub |
