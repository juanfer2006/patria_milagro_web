# Sistema de Investigación Criminal &mdash; Frontend Noir

> Proyecto de Aula: Desarrollo Web Full-Stack &amp; Paradigmas de Programación (Semestre 2026-2)  
> Identidad Visual: **Expediente Forense Noir**

---

## 1. Descripción del Proyecto

Aplicación web desarrollada con **Next.js 14 (App Router), React 18, TypeScript estricto y Tailwind CSS**. Presenta una interfaz inmersiva basada en la estética de expedientes forenses confidenciales, con tipografías temáticas (`Special Elite`, `IBM Plex Sans`, `IBM Plex Mono`), paleta cromática noir (Tinta `#0E1013`, Grafito `#181B20`, Papel `#E8E1D0`, Rojo Evidencia `#B3262E` y Ámbar Alerta `#D9A441`), alternador de tema claro/oscuro (`ThemeToggle`), autenticación JWT mediante cookies seguras (`cr_token`), protección centralizada con Middleware de Next.js, cliente HTTP desacoplado y componentes accesibles y reutilizables.

---

## 2. Enlaces de Despliegue

> Los enlaces definitivos de producción son configurados por el equipo:
- **Frontend en Producción (Vercel)**: `https://[COMPLETAR_POR_EL_EQUIPO].vercel.app`
- **Backend API (Render)**: `https://[COMPLETAR_POR_EL_EQUIPO].onrender.com/api`

---

## 3. Reparto de Trabajo (Equipo de 4 Integrantes)

| Integrante | Rol | Aportes Principales |
| :--- | :--- | :--- |
| **Juan Fernando Castañeda Agudelo** | **A (Líder / Infra)** | **Fundación del frontend (Next.js App Router, cliente HTTP centralizado, AuthProvider, useAuth, middleware.ts, páginas de Login, Registro, Not Found y Panel de Administración de Usuarios).** |
| **Juan Esteban Vallejo Hincapié** | **B** | **Vistas de casos (`/cases`, `/cases/new`, `/cases/[id]`, `/cases/[id]/edit`), componente ImageUpload e integración de imágenes en el detalle.** |
| **Camilo Gutiérrez Castañeda** | **C** | **Componentes de retroalimentación modal y diálogos (`Modal`, `ConfirmDialog`, `Spinner`, `EmptyState`, `ErrorState`) y sección de sospechosos.** |
| **José Daniel Morales Villegas** | **D** | **Módulo de Evidencias de punta a punta (`EvidencesSection`), Landing Page pericial, tokens de diseño y variables CSS, componentes UI base (`Button`, `Input`, `Select`, `Textarea`, `FormField`, `Pagination`), Navbar con ThemeToggle y Footer forense.** |

---

## 4. Credenciales de Prueba Oficiales (Seed)

Para la sustentación y pruebas del sistema, se utilizan las cuentas creadas por el seed oficial de la base de datos:

| Rol | Correo de Acceso | Contraseña | Alcance en la Interfaz |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@forense.test` | `Admin2026!` | Acceso a todos los expedientes criminales, panel administrativo `/admin` y gestión de usuarios. |
| **USER** | `detective@forense.test` | `Detective2026!` | Acceso exclusivo a expedientes propios, creación de evidencias y vinculación de personas de interés. |

---

## 5. Variables de Entorno (`.env.example`)

Crear un archivo `.env.local` en la raíz de la carpeta `frontend`:

```env
# URL base de la API sin el prefijo /api (el cliente HTTP lo añade en cada solicitud)
NEXT_PUBLIC_API_HOST=http://localhost:4000
```

En el entorno de producción (Vercel), configurar:
```env
NEXT_PUBLIC_API_HOST=https://[COMPLETAR_POR_EL_EQUIPO].onrender.com
```

---

## 6. Sistema de Diseño Forense Noir y Componentes UI Base (Rebanada D)

La identidad gráfica y visual de toda la aplicación fue construida bajo la dirección de la Rebanada D:
- **Tokens de Diseño y Variables CSS**: Definidos en `app/globals.css` para modo oscuro por defecto y modo claro ("Papel Forense") mediante el atributo `data-theme="light"` en el elemento raíz `<html>`.
- **Tipografías Google Fonts**: `Special Elite` (títulos y sellos procesales), `IBM Plex Sans` (cuerpo de texto e interfaces) e `IBM Plex Mono` (códigos como `CR-0001`, fechas y metadatos).
- **Componentes Base Reutilizables**:
  - `Button`: Variantes `primary`, `secondary`, `danger` y `ghost`, con soporte para estado de carga (`loading`).
  - `Input`, `Select`, `Textarea`: Con `label` obligatorio, `error`, `hint`, anillos de foco visibles y atributos de accesibilidad (`aria-describedby`, `aria-invalid`).
  - `FormField`: Contenedor estilizado para campos de formulario.
  - `Pagination`: Paginación numérica accesible por teclado y con estados deshabilitados.
  - `ThemeToggle`: Alternador persistente entre el modo "Expediente Noir" y "Papel Forense".
  - `Navbar`: Barra de navegación forense con control de sesión reactivo (`useAuth`), sellos confidenciales y menú móvil adaptable.
  - `Footer`: Pie institucional pericial con notas de uso académico y derechos.

---

## 7. Módulo de Evidencias Forenses (`src/features/evidences/` - Rebanada D)

- **`EvidencesSection`**: Sección integrada en la vista de detalle del expediente (`/cases/[id]`). Gestiona la cadena de custodia con los cuatro estados visuales (cargando con `Spinner`, error con `ErrorState` y reintento, vacío con `EmptyState` y listado pericial con `EvidenceCard`).
- **Control de Casos Cerrados (Regla 3)**: Deshabilita la creación de evidencias con aviso explicativo cuando el caso está `CLOSED`, manteniendo habilitada la consulta, edición y eliminación de las evidencias existentes.
- **Formulario Pericial (`EvidenceFormModal`)**: Permite tipificar la evidencia (`Física`, `Digital`, `Documento`, `Testimonio`, `Forense`), definir relevancia (1 a 5), fijar fecha no futura y adjuntar fotografía a través del componente `ImageUpload`.
- **Eliminación Segura**: Confirmación obligatoria con `ConfirmDialog` antes del borrado lógico.

---

## 8. Instalación y Ejecución Local

1. Acceder a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instalar dependencias exactas:
   ```bash
   npm ci
   ```
3. Iniciar el servidor de desarrollo en Next.js:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador: [http://localhost:3000](http://localhost:3000)

---

## 9. Despliegue en Vercel

1. Importar el repositorio en el panel de [Vercel](https://vercel.com).
2. Seleccionar el subdirectorio raíz: `frontend`.
3. Framework Preset: **Next.js**.
4. Configurar la variable de entorno:
   - `NEXT_PUBLIC_API_HOST`: `https://[COMPLETAR_POR_EL_EQUIPO].onrender.com`
5. Desplegar el proyecto.
6. Copiar el dominio asignado por Vercel y actualizar la variable `CORS_ORIGIN` en el panel de Render del backend.
