# Sistema de Investigación Criminal &mdash; Frontend Noir

> Proyecto de Aula: Desarrollo Web Full-Stack &amp; Paradigmas de Programación (Semestre 2026-2)  
> Estilo Visual: **Expediente Forense Noir**

---

## 1. Descripción

Aplicación web desarrollada con **Next.js 14 (App Router), React 18, TypeScript estricto y Tailwind CSS**. Presenta una interfaz inmersiva basada en carpetas forenses confidenciales, con autenticación JWT mediante cookie segura (`cr_token`), protección centralizada con Middleware de Next.js, paneles de administración para supervisores y componentes reutilizables con soporte para estados de carga, vacío y error.

---

## 2. Enlaces de Despliegue

- **Frontend en Producción (Vercel)**: `https://sistema-investigacion-frontend.vercel.app`
- **Backend API**: `https://sistema-investigacion-backend.onrender.com/api`

---

## 3. Reparto de Trabajo (Equipo de 4 Integrantes)

| Integrante | Rol | Aportes Principales |
| :--- | :--- | :--- |
| **Juan Fernando Castañeda Agudelo** | **A (Líder / Infra)** | **Fundación del frontend (App Router, HttpClient centralizado, AuthProvider, useAuth, middleware.ts, vistas de Login, Registro, Not Found y Panel de Administración de Usuarios).** |
| Juan Esteban Vallejo Hincapié | B | Vistas de casos (`/cases`, `/cases/new`, `/cases/[id]`), ImageUpload e integración de imágenes. |
| Camilo Gutiérrez Castañeda | C | Componentes de retroalimentación (`Modal`, `ConfirmDialog`, `EmptyState`, etc.) y sección de sospechosos. |
| José Daniel Morales Villegas | D | Sistema de diseño noir, variables CSS, componentes UI base (`Button`, `Input`, `Navbar`, `Footer`) y landing page. |

---

## 4. Credenciales de Prueba Oficiales

| Rol | Correo de Acceso | Contraseña |
| :--- | :--- | :--- |
| **ADMIN** | `admin@forense.test` | `Admin2026!` |
| **USER** | `detective@forense.test` | `Detective2026!` |

---

## 5. Variables de Entorno (`.env.example`)

Crear un archivo `.env.local` en la raíz de `frontend`:

```env
# URL base de la API sin el prefijo /api (el cliente HTTP lo concatena automáticamente)
NEXT_PUBLIC_API_HOST=http://localhost:4000
```

En producción (Vercel), configurar:
```env
NEXT_PUBLIC_API_HOST=https://sistema-investigacion-backend.onrender.com
```

---

## 6. Instalación y Ejecución Local

1. Acceder a la carpeta del proyecto:
   ```bash
   cd frontend
   ```
2. Instalar dependencias exactas:
   ```bash
   npm ci
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador: [http://localhost:3000](http://localhost:3000)

---

## 7. Despliegue en Vercel

1. Importar el repositorio en el panel de [Vercel](https://vercel.com).
2. Seleccionar el subdirectorio raíz: `frontend`.
3. Framework Preset: **Next.js**.
4. Configurar la variable de entorno:
   - `NEXT_PUBLIC_API_HOST`: `https://sistema-investigacion-backend.onrender.com`
5. Desplegar el proyecto.
6. Copiar el dominio asignado por Vercel (ej. `https://sistema-investigacion-frontend.vercel.app`) y actualizar la variable `CORS_ORIGIN` en el panel de Render del backend.
