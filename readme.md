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
IP Elástica:80
      │
   Gateway  (Express – enrutador)
      ├──  /                →  Cliente      (app compradores)
      ├──  /admin/**        →  Admin        (app administración)
      └──  /comerciante/**  →  Comerciante  (app comerciantes)
```

### Servicios

| Directorio    | Puerto interno | Ruta pública       | Descripción                        |
|---------------|----------------|--------------------|------------------------------------|
| `Cliente/`    | 3002           | `/`                | Tienda para compradores            |
| `Admin/`      | 3001           | `/admin`           | Panel de administración            |
| `Comerciante/`| 3003           | `/comerciante`     | Panel de gestión de comerciantes   |
| `Gateway/`    | 3000 (público) | —                  | Reverse proxy, único punto entrada |

- Las tres apps Next.js **nunca son accesibles desde el exterior** — solo el Gateway expone el puerto 80.
- La comunicación entre el Gateway y las apps ocurre a través de la red interna de Docker (`kingstore`).
- Admin y Comerciante tienen configurado `basePath` en su `next.config.js`, por lo que Next.js ya maneja internamente el prefijo de ruta.

---

## Despliegue con Docker

### Requisitos en el servidor
- Docker >= 24
- Docker Compose >= 2.20

### Primer despliegue

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd Frontend

# 2. Construir imágenes y levantar todos los contenedores
docker compose up -d --build
```

La primera vez el build puede tardar varios minutos porque descarga dependencias y compila las tres apps Next.js.

### Actualizar después de un cambio de código

```bash
# 1. Traer los últimos cambios
git pull origin main

# 2. Reconstruir solo los servicios que cambiaron y reiniciar
docker compose up -d --build

# Si solo cambió un servicio específico (más rápido):
docker compose up -d --build admin
docker compose up -d --build cliente
docker compose up -d --build comerciante
docker compose up -d --build gateway
```

### Comandos útiles

```bash
# Ver el estado de los contenedores
docker compose ps

# Ver logs de todos los servicios en tiempo real
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f gateway
docker compose logs -f admin
docker compose logs -f cliente
docker compose logs -f comerciante

# Detener todos los contenedores (sin eliminar imágenes)
docker compose stop

# Detener y eliminar contenedores (las imágenes se conservan)
docker compose down

# Detener, eliminar contenedores E imágenes (fuerza rebuild completo)
docker compose down --rmi all
```

### Verificar que todo funciona

Desde el navegador o con `curl`:

```bash
curl http://<IP-ELASTICA>/            # debe responder la app Cliente
curl http://<IP-ELASTICA>/admin       # debe responder la app Admin
curl http://<IP-ELASTICA>/comerciante # debe responder la app Comerciante
```

### Puertos y red

| Servicio      | Puerto expuesto al exterior | Puerto interno Docker |
|---------------|-----------------------------|-----------------------|
| Gateway       | 80                          | 3000                  |
| Admin         | ninguno                     | 3001                  |
| Cliente       | ninguno                     | 3002                  |
| Comerciante   | ninguno                     | 3003                  |

Asegúrate de que el **Security Group** de la EC2 tenga una regla de entrada:
- Tipo: HTTP, Protocolo: TCP, Puerto: 80, Origen: 0.0.0.0/0
