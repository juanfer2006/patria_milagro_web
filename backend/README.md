# Sistema de Investigación Criminal &mdash; API Backend

> Proyecto de Aula: Desarrollo Web Full-Stack &amp; Paradigmas de Programación (Semestre 2026-2)  
> Estilo Visual y Temático: **Expediente Forense Noir**

---

## 1. Descripción del Proyecto

API REST construida con **Node.js 20, Express, TypeScript estricto, Prisma ORM y PostgreSQL**. Proporciona el núcleo de dominio, persistencia en base de datos relacional, seguridad JWT, administración de identidades y la gestión de investigaciones criminales ficticias estructurada en tres recursos principales:
- **Casos criminales**: Apertura formal (`CR-0001`), cronología, fotografía de la escena y estados procesales (`OPEN`, `IN_PROGRESS`, `CLOSED`).
- **Sospechosos / Personas de interés**: Fichas delictivas, nivel de sospecha (0-100), alias y fotografías periciales.
- **Evidencias materiales y peritaje**: Clasificación tipificada (`PHYSICAL`, `DIGITAL`, `DOCUMENT`, `TESTIMONY`, `FORENSIC`), escala de relevancia probatoria (1 a 5), registro fotográfico en almacenamiento binario (Supabase Storage) y vinculación a sospechosos del caso.

---

## 2. Enlaces de Despliegue

> Los enlaces definitivos de despliegue son configurados por el equipo en producción:
- **Backend en Producción (Render)**: `https://[COMPLETAR_POR_EL_EQUIPO].onrender.com`
- **Ruta de Verificación de Salud (Health Check)**: `https://[COMPLETAR_POR_EL_EQUIPO].onrender.com/api/health`
- **Frontend en Producción (Vercel)**: `https://[COMPLETAR_POR_EL_EQUIPO].vercel.app`

---

## 3. Reparto de Trabajo (Equipo de 4 Integrantes)

| Integrante | Rol | Responsabilidades Principales |
| :--- | :--- | :--- |
| **Juan Fernando Castañeda Agudelo** | **A (Líder / Infra)** | **Fundación y arquitectura en 4 capas, autenticación JWT, usuarios admin, migraciones Prisma, seed oficial, políticas de acceso y despliegue.** |
| **Juan Esteban Vallejo Hincapié** | **B** | **Módulo de Casos (`/api/cases`), subida de archivos binarios a Supabase Storage (`/api/uploads`), detalle de expediente e integración de imágenes.** |
| **Camilo Gutiérrez Castañeda** | **C** | **Módulo de Sospechosos (`/api/suspects`), componentes de retroalimentación modal/confirmación y estados de interfaz.** |
| **José Daniel Morales Villegas** | **D** | **Módulo de Evidencias de punta a punta (`/api/evidences`), Landing Page pericial, sistema de diseño noir, variables CSS, componentes UI base, Navbar y Footer.** |

---

## 4. Credenciales de Prueba Oficiales (Seed)

El seed genera cuentas idempotentes bajo el dominio reservado `.test` para pruebas académicas y sustentación final:

| Rol | Correo Electrónico | Contraseña | Permisos y Alcance |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@forense.test` | `Admin2026!` | Comisario: acceso total a todos los casos, sospechosos, evidencias y panel de usuarios. |
| **USER** | `detective@forense.test` | `Detective2026!` | Detective: acceso exclusivo a sus propios casos y a las evidencias/sospechosos vinculados a ellos. |

---

## 5. Variables de Entorno (`.env.example`)

Configurar en el archivo `.env` local (este archivo **NUNCA** se incluye en el control de versiones):

```env
# Entorno y Puerto
NODE_ENV=development
PORT=4000

# Conexión PostgreSQL (Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Autenticación JWT (Obligatoria, sin valor por defecto en código)
JWT_SECRET="clave_secreta_jwt_de_alta_entropia_minimo_32_caracteres"
JWT_EXPIRES_IN=1d

# CORS (Origen del Frontend cliente)
CORS_ORIGIN=http://localhost:3000

# Almacenamiento de Imágenes (Supabase Storage)
SUPABASE_URL="https://[PROJECT_REF].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="tu_supabase_service_role_key"
SUPABASE_BUCKET=case-images
```

---

## 6. Endpoints y Convenciones de la API

Todas las rutas privadas exigen cabecera `Authorization: Bearer <token>`. Las respuestas siguen las convenciones vinculantes:
- Recurso individual: `{ "data": { ... } }`
- Listado paginado: `{ "data": [ ... ], "pagination": { "total", "currentPage", "limit", "totalPages" } }`
- Errores estandarizados: `{ "error": { "code": "...", "message": "...", "details": [ ... ] } }`
- Eliminación lógica (soft delete): HTTP `204 No Content` sin cuerpo de respuesta.

### Resumen de Rutas de Evidencias (`/api/evidences` - Rebanada D)

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/evidences` | Autenticado | Listado paginado con filtros (`caseId`, `suspectId`, `type`, `q`). Aislamiento: `USER` solo consulta evidencias de sus propios casos. |
| `POST` | `/api/evidences` | Autenticado | Fijación de nueva evidencia. Valida que el caso no esté cerrado (Regla 3: 409), que el sospechoso pertenezca al caso (Regla 4: 400), relevancia (1-5) y fecha no futura. |
| `GET` | `/api/evidences/:id` | Autenticado | Consulta detallada de una evidencia activa por su UUID. |
| `PUT` | `/api/evidences/:id` | Autenticado | Modificación de campos probatorios (el `caseId` permanece inmutable). Valida que nuevo sospechoso pertenezca al caso. Permitido en casos cerrados. |
| `DELETE` | `/api/evidences/:id` | Autenticado | Desactivación lógica (`state: INACTIVE`) de la evidencia. Responde 204. |

---

## 7. Instalación y Ejecución Local

1. Acceder a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instalar dependencias exactas:
   ```bash
   npm ci
   ```
3. Generar el cliente de Prisma:
   ```bash
   npm run prisma:generate
   ```
4. Ejecutar migraciones y poblar la base de datos con el seed:
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```
5. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
6. Ejecutar la suite completa de pruebas unitarias:
   ```bash
   npm test
   ```

---

## 8. Guía Paso a Paso de Despliegue en Producción

### A. Configuración en Supabase (Base de Datos & Storage)
1. Iniciar sesión en [Supabase Console](https://supabase.com).
2. Crear un nuevo proyecto (ej. `criminal-investigation-prod`).
3. En **Project Settings > Database**, copiar:
   - **Connection String (Transaction Pooler - puerto 6543)** para `DATABASE_URL`.
   - **Connection String (Direct - puerto 5432)** para `DIRECT_URL`.
4. En **Storage > Buckets**:
   - Crear un nuevo bucket llamado `case-images`.
   - Marcar el bucket como **Public**.
   - Crear las políticas (Policies) para permitir lectura pública y subida autenticada.
5. En **Project Settings > API**, copiar la `Project URL` y la llave `service_role` (para `SUPABASE_SERVICE_ROLE_KEY`).

### B. Despliegue en Render (Web Service)
1. En [Render Dashboard](https://dashboard.render.com), seleccionar **New > Web Service**.
2. Conectar el repositorio de GitHub y seleccionar la rama `main` (o `develop`).
3. Configurar los siguientes parámetros:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**:
     ```bash
     npm ci && npx prisma generate && npx prisma migrate deploy && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
4. En **Environment Variables**, agregar las variables listadas en la sección 5:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `DATABASE_URL`: *(Valor del pooler de Supabase)*
   - `DIRECT_URL`: *(Valor directo de Supabase)*
   - `JWT_SECRET`: *(Generar un hash seguro aleatorio)*
   - `JWT_EXPIRES_IN`: `1d`
   - `CORS_ORIGIN`: *(URL asignada por Vercel al frontend)*
   - `SUPABASE_URL`: *(URL de Supabase)*
   - `SUPABASE_SERVICE_ROLE_KEY`: *(Llave service_role de Supabase)*
   - `SUPABASE_BUCKET`: `case-images`
5. Ejecutar el seed una vez en Render:
   - Ir a la pestaña **Shell** del servicio en Render y ejecutar:
     ```bash
     npm run prisma:seed
     ```

### C. Despertar el Servicio de Render antes de la Sustentación
Debido a que el plan gratuito de Render suspende los servicios inactivos después de 15 minutos, se debe despertar la API antes de la demo:
1. Abrir en el navegador la ruta de salud:
   `https://[COMPLETAR_POR_EL_EQUIPO].onrender.com/api/health`
2. Esperar aproximadamente 30 a 50 segundos hasta recibir la respuesta:
   ```json
   {
     "status": "ok",
     "service": "Sistema de Investigación Criminal API",
     "timestamp": "2026-11-08T..."
   }
   ```
3. Una vez responda con HTTP 200, la API permanecerá activa para la sustentación.
