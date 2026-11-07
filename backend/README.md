# Sistema de Investigación Criminal &mdash; API Backend (Fundación y Auth)

> Proyecto de Aula: Desarrollo Web Full-Stack &amp; Paradigmas de Programación (Semestre 2026-2)  
> Estilo: **Expediente Forense Noir**

---

## 1. Descripción del Proyecto

API REST construida con **Node.js 20, Express, TypeScript estricto, Prisma ORM y PostgreSQL**. Proporciona el núcleo de dominio, persistencia, seguridad JWT y administración de usuarios para la gestión ficticia de investigaciones criminales (casos, sospechosos y evidencias fotográficas con Supabase Storage).

---

## 2. Enlaces de Despliegue

- **Backend en Producción (Render)**: `https://sistema-investigacion-backend.onrender.com`
- **Health Check**: `https://sistema-investigacion-backend.onrender.com/api/health`
- **Frontend en Producción (Vercel)**: `https://sistema-investigacion-frontend.vercel.app`

---

## 3. Reparto de Trabajo (Equipo de 4 Integrantes)

| Integrante | Rol | Responsabilidades Principales |
| :--- | :--- | :--- |
| **Juan Fernando Castañeda Agudelo** | **A (Líder / Infra)** | **Fundación de arquitectura (4 capas), autenticación JWT, usuarios admin, migraciones, seed, políticas de seguridad y despliegue.** |
| Juan Esteban Vallejo Hincapié | B | Módulo de Casos, subida de archivos/imágenes a Supabase Storage y detalle de caso. |
| Camilo Gutiérrez Castañeda | C | Módulo de Sospechosos, componentes modales/confirmación y retroalimentación. |
| José Daniel Morales Villegas | D | Módulo de Evidencias, Landing Page, sistema de diseño y componentes UI base. |

---

## 4. Credenciales de Prueba Oficiales (Seed)

El seed genera cuentas idempotentes con dominio reservado `.test` para pruebas y sustentación:

| Rol | Correo Electrónico | Contraseña |
| :--- | :--- | :--- |
| **ADMIN** | `admin@forense.test` | `Admin2026!` |
| **USER** | `detective@forense.test` | `Detective2026!` |

---

## 5. Variables de Entorno (`.env.example`)

Configurar en el archivo `.env` local (nunca comitear `.env` al repositorio):

```env
# Entorno y Puerto
NODE_ENV=development
PORT=4000

# PostgreSQL Supabase
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Autenticación JWT (Obligatoria, sin default en código)
JWT_SECRET="clave_secreta_jwt_de_al_menos_32_caracteres"
JWT_EXPIRES_IN=1d

# CORS (Origen permitido del Frontend)
CORS_ORIGIN=http://localhost:3000

# Supabase Storage para Imágenes
SUPABASE_URL="https://[PROJECT_REF].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="tu_supabase_service_role_key"
SUPABASE_BUCKET=case-images
```

---

## 6. Instalación y Ejecución Local

1. Clonar el repositorio y acceder a la carpeta:
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
4. Ejecutar migraciones y poblar la base de datos:
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```
5. Iniciar en modo desarrollo:
   ```bash
   npm run dev
   ```
6. Ejecutar pruebas unitarias:
   ```bash
   npm test
   ```

---

## 7. Guía Paso a Paso de Despliegue en Producción

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
   `https://sistema-investigacion-backend.onrender.com/api/health`
2. Esperar aproximadamente 30 a 50 segundos hasta recibir la respuesta:
   ```json
   {
     "status": "ok",
     "service": "Sistema de Investigación Criminal API",
     "timestamp": "2026-11-07T..."
   }
   ```
3. Una vez responda con HTTP 200, la API permanecerá activa para la sustentación.
