# GUIA DE TRABAJO

## Overview
Esta guia es para poder orientar a los desarrolladores el flujo de trabajo para la integración del proyecto.
Principalmente contamos con 2 ramas base
1. Development
2. Main

## Development
Esta rama está orientada para el desarrollo de tareas y pruebas antes de agregarlo al producto final.
Los desarrolladores tendrán que crear sus ramas basadas en esta para poder realizar el proceso de **integración**

## Main
Está es la rama produción y se usará unicamente para las presentaciones del proyecto. Todo lo que se integre aca tendrá que estar debidamente probado en **Development**

![Flujo de trabajo en repositorio](Diagramas/git_workflow_springboot.svg)

## Flujo del Proceso

### 1. Creación de la rama de trabajo
```bash
git checkout Development
git pull origin Development
git checkout -b KS-feature-description
```

### 2. Desarrollo y regular Rebasing

* El desarrollador debe trabajar en su rama creada para el respectivo task que se le asignó
* Ejecuten un rebase cada día o cuando se le informé que la rama **Development** fue actualizada

```bash
git fetch origin
git rebase -i origin/Development
```

* Cree commits constantemente con mensajes claros para tener conocimiento de lo desarrollado
```bash
git commit -m "KS-feature-description: implement user authentication"
```

### 3. Push & Create Pull Request

```bash
git push origin feature/JIRA-123-feature-description
```

* Crear un Pull Request hacia **Development**
* Agregue detalles sobre lo que se hizo para ese ticket

---

## Arquitectura del Frontend

El frontend es una plataforma **multi-tenant** compuesta por tres aplicaciones Next.js independientes y un Gateway que las expone bajo una sola URL.

```
IP EC2:80
      │
   Gateway  (Express – enrutador)
      ├──  /                →  Cliente      (app compradores)
      ├──  /admin/**        →  Admin        (app administración)
      └──  /comerciante/**  →  Comerciante  (app comerciantes)
```

### Servicios

| Directorio     | Puerto interno | Ruta pública        | Variable de entorno del backend   |
|----------------|----------------|---------------------|-----------------------------------|
| `Cliente/`     | 3002           | `/`                 | `NEXT_PUBLIC_API_URL`             |
| `Admin/`       | 3001           | `/admin`            | `NEXT_PUBLIC_API_URL`             |
| `Comerciante/` | 3003           | `/comerciante`      | `NEXT_PUBLIC_API_BASE_URL`        |
| `Gateway/`     | 3000 (público) | —                   | —                                 |

- Las tres apps Next.js **nunca son accesibles desde el exterior** — solo el Gateway expone el puerto 80.
- La comunicación entre el Gateway y las apps ocurre a través de la red interna de Docker (`kingstore`).
- Admin y Comerciante tienen configurado `basePath` en su `next.config.js`, por lo que Next.js ya maneja internamente el prefijo de ruta.
- `NEXT_PUBLIC_*` son variables **de build time**: quedan horneadas en el bundle de JavaScript. Cambiarlas en `.env` sin reconstruir la imagen no tiene efecto.

---

## Despliegue con Docker

Las imágenes están publicadas en Docker Hub bajo el usuario `bryanpisco`. El servidor EC2 **no necesita el código fuente ni compilar nada** — solo necesita el archivo `docker-compose.yml` y el archivo `.env` con los secretos del backend.

### Datos del servidor

| Campo | Valor |
|-------|-------|
| IP EC2 | `52.205.138.95` |
| URL frontend | `http://52.205.138.95` |
| URL backend | `http://52.205.138.95:8080` |
| Conexión SSH | `ssh -i "ingesoft_key.pem" ubuntu@ec2-52-205-138-95.compute-1.amazonaws.com` |

### Requisitos en el servidor
- Docker >= 24
- Docker Compose >= 2.20

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER   # requiere re-login para tomar efecto
```

---

### Primer despliegue en el servidor (solo una vez)

**1. Copiar el `docker-compose.yml` al servidor:**
```bash
scp -i "ingesoft_key.pem" \
    docker-compose.yml \
    ubuntu@ec2-52-205-138-95.compute-1.amazonaws.com:~/docker-compose.yml
```

**2. Conectarse al servidor y crear el archivo `.env`:**
```bash
ssh -i "ingesoft_key.pem" ubuntu@ec2-52-205-138-95.compute-1.amazonaws.com

cat > .env << 'EOF'
JASYPT_ENCRYPTOR_PASSWORD=kingstore-secret-key-2024
JWT_SECRET=kingstore-secret-key-ingesoft-2026
SPRING_DATASOURCE_PASSWORD=<password_de_rds>
EOF
```

**3. Levantar todos los servicios:**
```bash
docker compose pull        # descarga todas las imágenes desde Docker Hub
docker compose up -d       # levanta los contenedores en segundo plano
docker compose ps          # verifica que todos estén "Up"
```

---

### Publicar nueva versión (tras cada cambio de código)

Ejecutar desde la raíz del proyecto frontend (`/Frontend`). La variable `API_URL` define la URL del backend que quedará horneada en cada imagen.

```bash
cd /ruta/al/repo/Frontend

API_URL=http://52.205.138.95:8080
```

**Cliente** (usa `NEXT_PUBLIC_API_URL`):
```bash
docker build --build-arg NEXT_PUBLIC_API_URL=$API_URL \
  -t bryanpisco/kingstore-cliente:latest ./Cliente
docker push bryanpisco/kingstore-cliente:latest
```

**Admin** (usa `NEXT_PUBLIC_API_URL`):
```bash
docker build --build-arg NEXT_PUBLIC_API_URL=$API_URL \
  -t bryanpisco/kingstore-admin:latest ./Admin
docker push bryanpisco/kingstore-admin:latest
```

**Comerciante** (usa `NEXT_PUBLIC_API_BASE_URL`):
```bash
docker build --build-arg NEXT_PUBLIC_API_BASE_URL=$API_URL \
  -t bryanpisco/kingstore-comerciante:latest ./Comerciante
docker push bryanpisco/kingstore-comerciante:latest
```

**Gateway** (no necesita build args):
```bash
docker build -t bryanpisco/kingstore-gateway:latest ./Gateway
docker push bryanpisco/kingstore-gateway:latest
```

**Actualizar el servidor tras el push:**
```bash
ssh -i "ingesoft_key.pem" ubuntu@ec2-52-205-138-95.compute-1.amazonaws.com

docker compose pull          # descarga las imágenes nuevas
docker compose up -d         # reinicia los contenedores con las imágenes nuevas
docker compose ps            # verificar que todos estén "Up"
```

---

### Actualizar un solo servicio

Si solo cambiaste un servicio, no es necesario reconstruir todo:

```bash
# Ejemplo: solo cambió Admin
docker build --build-arg NEXT_PUBLIC_API_URL=$API_URL \
  -t bryanpisco/kingstore-admin:latest ./Admin
docker push bryanpisco/kingstore-admin:latest

# En el servidor:
docker compose pull admin
docker compose up -d admin
```

---

### Ver logs

```bash
# Todos los servicios en tiempo real (Ctrl+C para salir)
docker compose logs -f

# Un servicio específico
docker compose logs gateway -f
docker compose logs admin -f
docker compose logs cliente -f
docker compose logs comerciante -f
docker compose logs backend -f

# Últimas N líneas sin seguir
docker compose logs admin --tail=50
```

---

### Apagar los servicios

**Opción 1 — Detener un servicio específico (el resto sigue corriendo):**
```bash
docker compose stop admin
docker compose stop cliente
docker compose stop comerciante
docker compose stop gateway
docker compose stop backend
```

**Opción 2 — Detener todos los servicios (sin eliminar contenedores):**
```bash
docker compose stop
```
> Los contenedores quedan detenidos. Se pueden volver a iniciar con `docker compose start`.

**Opción 3 — Apagar y eliminar los contenedores:**
```bash
docker compose down
```
> Las imágenes Docker y los datos en RDS se conservan. Para volver a levantar: `docker compose up -d`.

**Opción 4 — Apagar, eliminar contenedores e imágenes (limpieza total):**
```bash
docker compose down --rmi all
```
> Fuerza re-descarga de todas las imágenes en el próximo despliegue.

---

### Comandos útiles

```bash
# Ver estado de todos los contenedores
docker compose ps

# Reiniciar un servicio sin reconstruir
docker compose restart admin

# Ver uso de recursos (CPU, RAM) de los contenedores
docker stats

# Verificar que las páginas responden
curl http://52.205.138.95/            # Cliente
curl http://52.205.138.95/admin       # Admin
curl http://52.205.138.95/comerciante # Comerciante
curl http://52.205.138.95:8080        # Backend
```

---

### Puertos y red

| Servicio      | Puerto expuesto al exterior | Puerto interno Docker |
|---------------|-----------------------------|-----------------------|
| Gateway       | 80                          | 3000                  |
| Backend       | 8080                        | 8080                  |
| Admin         | ninguno                     | 3001                  |
| Cliente       | ninguno                     | 3002                  |
| Comerciante   | ninguno                     | 3003                  |

Asegúrate de que el **Security Group** de la EC2 tenga reglas de entrada:
- HTTP → Puerto 80 → Origen: `0.0.0.0/0`
- TCP personalizado → Puerto 8080 → Origen: `0.0.0.0/0`
- SSH → Puerto 22 → Origen: tu IP
