# Sistema de Investigación Criminal — Estado de Integración y Guía para Prompts
**Fecha:** Domingo 8 de noviembre de 2026  
**Autores:** Equipo de Desarrollo (A, B, C, D)  
**Rama base de integración:** `develop`

---

## 1. Estado Actual del Proyecto y Avance de Rebanadas

- **Integrante A (Fundación, Auth y Admin):** Entregó arquitectura base, esquema Prisma, autenticación JWT, middleware y panel `/admin`. *(Pendiente corrección de build en login y configuración de despliegue)*.
- **Integrante B (Casos e Imágenes):** **100 % completado y verificado**. CRUD de casos, filtros combinados con debounce, paginación, borrado lógico en cascada, subida de archivos a Supabase Storage (`POST /api/uploads`), componente `ImageUpload` real, listado `/cases`, detalle `/cases/[id]` y vistas `/cases/new` y `/cases/[id]/edit`.
- **Integrantes C (Sospechosos) y D (Evidencias):** Listos para comenzar a implementar backend y frontend sobre lo entregado por A y B.

---

## 2. Acciones Pendientes para Integrante A (Fundación y Despliegue)

1. **[URGENTE - BLOQUEA VERCEL] Prerenderizado en `frontend/app/login/page.tsx`:**
   - El hook `useSearchParams()` se está ejecutando directamente en la página sin límite de suspense.
   - **Solución requerida:** Extraer el formulario a un componente cliente interno (`LoginFormInner`) y en `export default function LoginPage()` envolverlo en `<Suspense fallback={<Spinner />}>`.
   - **Verificación:** Ejecutar `npm run build` en `frontend/` y comprobar que compile con código 0.
2. **Ignorar archivos de caché de TypeScript:**
   - Añadir `*.tsbuildinfo` a `.gitignore` y ejecutar `git rm --cached frontend/tsconfig.tsbuildinfo` para eliminarlo del repositorio.
3. **Soporte de verificación de tipos en tests:**
   - En `backend/tsconfig.json`, la carpeta `tests/` está excluida de `tsc`. Considerar un `tsconfig.test.json` o incluirla para que `npx tsc --noEmit` también revise los dobles de prueba.
4. **Soporte de fin de línea en Windows (`CRLF` vs `LF`):**
   - Para evitar que `npm run format:check` alerte sobre archivos sin modificar en entornos Windows, agregar `* text=auto eol=lf` en `.gitattributes` y `"endOfLine": "auto"` en `.prettierrc`.
5. **Configuración de dominios en `next.config.js`:**
   - Si se desea optimización de imágenes nativa de Next.js para Supabase, autorizar el dominio de Supabase en `next.config.js`. Por ahora, la Rebanada B usa `unoptimized` en `next/image` para no generar bloqueos.
6. **Integración en `/admin`:**
   - A ya puede importar y montar el componente `<CasesList />` desde `@/src/features/cases` dentro de `app/admin/page.tsx` para listar todos los casos globales con filtros y paginación.

---

## 3. Guía de Integración para Integrante C (Sospechosos)

### En Backend:
- **Validar el caso:** Importar e inyectar `PrismaCaseRepository` (`src/infrastructure/repository/prisma-case.repository.ts`).
- **Regla 3 de Negocio:** Si el caso tiene `status === 'CLOSED'`, está prohibido crear sospechosos. Debes lanzar `ConflictError('No se pueden agregar sospechosos a un caso cerrado')` (HTTP 409).
- **Regla de propiedad:** Sospechosos heredan la propiedad del caso. Un `USER` solo puede crear o editar sospechosos en casos de los que sea dueño.
- **Borrado de sospechoso:** Implementar `deactivateAndUnlinkEvidences(id)` en tu repositorio: en una transacción `$transaction`, marcar el sospechoso como `INACTIVE` y dejar en `null` el campo `suspectId` de sus evidencias asociadas.
- **Subida de fotos:** Utilizar el endpoint `POST /api/uploads` (ya operativo) enviando `folder: 'suspects'`.

### En Frontend:
- **Subida de imagen:** Usar el componente compartido `ImageUpload`:
  ```tsx
  import { ImageUpload } from '@/src/features/common/components';

  <ImageUpload
    folder="suspects"
    value={photoUrl}
    onChange={(url) => setPhotoUrl(url)}
    label="Fotografía del sospechoso"
  />
  ```
- **Sección en el detalle del caso:** Implementar `SuspectsSection` en `src/features/suspects` y exportarla en su `index.ts` con las siguientes props exactas:
  ```tsx
  export interface SuspectsSectionProps {
    caseId: string;
    isCaseClosed: boolean;
  }
  ```
  *(Cuando `isCaseClosed` sea `true`, deshabilitar o bloquear el botón de añadir sospechoso).*

---

## 4. Guía de Integración para Integrante D (Evidencias y Sistema de Diseño)

### En Backend:
- **Validar el caso y sospechoso:**
  - Validar existencia y estado del caso con `PrismaCaseRepository`. Si está `CLOSED`, responder 409 (Regla 3).
  - **Regla 4 de Negocio:** Si la evidencia incluye `suspectId`, ese sospechoso **debe pertenecer al mismo `caseId`**. Si pertenece a otro caso, responder `ValidationError` (HTTP 400).
- **Subida de imágenes forenses:** Utilizar `POST /api/uploads` con `folder: 'evidences'`.

### En Frontend:
- **Subida de imagen de evidencia:** Usar `ImageUpload` con `folder="evidences"`.
- **Sección en el detalle del caso:** Implementar `EvidencesSection` en `src/features/evidences` y exportarla en su `index.ts` con las siguientes props exactas:
  ```tsx
  export interface EvidencesSectionProps {
    caseId: string;
    isCaseClosed: boolean;
  }
  ```
  *(Cuando `isCaseClosed` sea `true`, bloquear el registro de nuevas evidencias).*
- **Sistema de diseño y layout:**
  - Al implementar el `Navbar` definitivo en `frontend/app/layout.tsx` con el botón de logout global, avisar para retirar los botones provisionales temporales que están en la cabecera de `app/cases/page.tsx`.

---

## 5. Reglas Vinculantes Obligatorias para los Prompts de los Agentes

Para que ningún agente rompa el trabajo de los demás al generar código:

1. **Prohibido tocar archivos de otros dueños:**
   - Solo A toca `prisma/`, `app.ts`, `env.ts`, `middleware.ts`, `app/layout.tsx` y configuración raíz.
   - Solo B toca `src/features/cases/`, `app/cases/` y uploads.
   - Solo C toca `src/features/suspects/`, endpoints de sospechosos y componentes de feedback (`Modal`, `ConfirmDialog`, `Spinner`, etc.).
   - Solo D toca `src/features/evidences/`, endpoints de evidencias, `globals.css` y componentes base de diseño (`Button`, `Input`, etc.).
2. **Cero fetch directo:** Toda llamada al backend debe realizarse a través de `httpClient` (`src/features/common/http/http-client.ts`), centralizada en `services/` y consumida mediante `hooks/`.
3. **Formato estricto de respuestas de la API:**
   - Recurso individual: `{ "data": { ... } }`
   - Listados: `{ "data": [ ... ], "pagination": { "total", "currentPage", "limit", "totalPages" } }`
   - Eliminación: Código HTTP `204` sin cuerpo (`res.status(204).send()`).
   - Errores: `{ "error": { "code": "...", "message": "...", "details": [...] } }`
4. **Protección de rutas:**
   - Backend: Todo router autenticado debe iniciar con `router.use(createAuthMiddleware(tokenService))`.
   - Frontend: Cualquier hook que consuma parámetros de URL (`useSearchParams`) debe estar contenido dentro de un `<Suspense>`.
5. **Convención de Git:**
   - Ramas de trabajo: `feat/<letra>-<tema>` (ej. `feat/c-suspects-backend`).
   - Commits pequeños con formato Conventional Commits (`feat(suspects): ...`, `test(evidences): ...`).
   - Nunca agregar con `git add .` ni `git add -A`. Añadir archivos explícitamente por su ruta.
   - No comitear nunca `.env`, `.next`, `dist` ni `tsconfig.tsbuildinfo`.
6. **Checklist antes de dar por terminada una tarea:**
   - Backend: `npx tsc --noEmit && npm run lint && npm test`
   - Frontend: `npx tsc --noEmit && npm run lint && npm run format:check`
