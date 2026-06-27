# Solidario Venezuela — Diseño Funcional

**Fecha:** 2026-06-27  
**Estado:** Aprobado por el usuario

---

## Objetivo

Reemplazar la landing informativa actual por una plataforma funcional para buscar personas desaparecidas/desplazadas y centros de ayuda en Venezuela. Los usuarios pueden buscar, registrar y consultar personas y centros con información completa y validada.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions) |
| Estilos | Tailwind CSS v4 |
| Base de datos | Vercel Postgres (Neon) — via `@neondatabase/serverless` |
| Almacenamiento de imágenes | Vercel Blob — via `@vercel/blob` |
| Validación | Validación nativa en Server Actions + client-side básica |

---

## Arquitectura de pantallas

```
/                → Página principal (buscador + tabs + resultados)
/personas/[id]   → Detalle de persona (futuro)
/api/personas    → GET (buscar) / POST (crear)
/api/centros     → GET (buscar) / POST (crear)
/api/upload      → POST (subir imagen a Vercel Blob)
/api/db/migrate  → POST (crear tablas — solo desarrollo)
```

---

## Base de datos — Esquema

### Tabla `personas`

| Columna | Tipo | Notas |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| nombre | VARCHAR(100) NOT NULL | |
| apellido | VARCHAR(100) NOT NULL | |
| cedula_tipo | CHAR(1) | 'V' o 'E' |
| cedula_numero | VARCHAR(12) | Solo dígitos |
| fecha_nacimiento | DATE | |
| genero | VARCHAR(20) | Masculino/Femenino/Otro |
| estado | VARCHAR(50) NOT NULL | 24 estados de Venezuela |
| ciudad | VARCHAR(100) NOT NULL | |
| telefono | VARCHAR(20) | Formato +58XXXXXXXXXX |
| email | VARCHAR(200) | |
| foto_url | TEXT | URL de Vercel Blob |
| ultima_vez_fecha | DATE | |
| ultima_vez_lugar | TEXT | |
| descripcion | TEXT | Señas particulares |
| estado_busqueda | VARCHAR(20) | 'buscando'/'encontrado'/'descartado' |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

### Tabla `centros_ayuda`

| Columna | Tipo | Notas |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| nombre | VARCHAR(200) NOT NULL | |
| tipo | VARCHAR(50) | Refugio/Comedor/Médico/Legal/Otro |
| estado | VARCHAR(50) NOT NULL | |
| ciudad | VARCHAR(100) NOT NULL | |
| direccion | TEXT | |
| telefono | VARCHAR(20) | |
| email | VARCHAR(200) | |
| horario | VARCHAR(200) | |
| descripcion | TEXT | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

---

## Página principal — Estructura

```
Header (sticky)
  Logo SV | Nav: Personas / Centros / Seguridad | [+ Agregar]

Hero search
  Título: "Busca personas o centros de ayuda en Venezuela"
  [🔍 Buscador grande — nombre, cédula, ciudad, estado...]

Tabs  [Personas]  [Centros de Ayuda]

Barra de acciones
  [+ Agregar Persona]   [+ Agregar Centro de Ayuda]

Grilla de resultados (cards)
  Foto | Nombre | Cédula | Estado/Ciudad | Fecha | Badge estado

Footer
```

---

## Formulario "Agregar Persona" — Modal

**Sección 1: Identificación**
- Nombre* (text, max 100)
- Apellido* (text, max 100)
- Cédula: [V / E] + número (validar solo dígitos, 6-8 chars)
- Fecha de nacimiento (date picker, max = hoy)
- Género (select: Masculino / Femenino / Prefiero no decir)

**Sección 2: Ubicación**
- Estado* (select: 24 estados + Dependencias Federales)
- Ciudad* (select: se puebla según el estado elegido)

**Sección 3: Contacto**
- Teléfono (formato venezolano: prefijos 0412/0414/0416/0424/0426 + 7 dígitos)
- Email (validación formato email)

**Sección 4: Foto**
- Upload de imagen (jpg/png/webp, max 5MB → Vercel Blob)

**Sección 5: Última vez visto**
- Fecha (date picker)
- Lugar (text)
- Descripción / señas particulares (textarea, max 500 chars)

**Sección 6: Estado de búsqueda**
- Estado (select: En búsqueda / Encontrado / Caso cerrado)

---

## Datos Venezuela — Estados y ciudades

Lista completa de 24 estados + Distrito Capital + Dependencias Federales.  
Cada estado tiene sus principales ciudades/municipios pre-cargados en el formulario.

Prefijos telefónicos venezolanos válidos:
- Movistar: 0414, 0424
- Digitel: 0412, 0422  
- Movilnet: 0416, 0426
- CANTV fijo: 02xx (código de área)

---

## Validaciones

**Cliente (JS):**
- Campos requeridos marcados con *
- Formato cédula: solo dígitos, 6-8 caracteres
- Teléfono: regex `/^(0414|0424|0412|0422|0416|0426|02\d{2})\d{7}$/`
- Email: regex estándar
- Imagen: tipo MIME + tamaño antes de subir

**Servidor (Server Action):**
- Re-validar todos los campos (nunca confiar solo en cliente)
- Sanitizar strings
- Verificar tipo/tamaño de imagen antes de subir a Blob

---

## Upload de imágenes — Vercel Blob

Flujo:
1. Usuario selecciona imagen en el formulario
2. Cliente hace `fetch POST /api/upload` con el archivo (FormData)
3. Server Action recibe, valida tipo/tamaño, llama `put()` de `@vercel/blob`
4. Retorna la URL pública del blob
5. URL se guarda en `foto_url` de la persona

**Requiere:** `BLOB_READ_WRITE_TOKEN` (agregar en Vercel > Storage > Blob > Tokens)

---

## Componentes nuevos a crear

```
src/components/
  SearchBar.tsx           — Buscador grande con debounce
  PersonaCard.tsx         — Card en la grilla de resultados
  CentroCard.tsx          — Card para centros de ayuda
  AgregarPersonaModal.tsx — Modal con formulario multi-sección
  AgregarCentroModal.tsx  — Modal para centros de ayuda
  TabSelector.tsx         — Tabs Personas / Centros
  VenezuelaSelects.tsx    — Selects de estado/ciudad pre-cargados
  PhoneInput.tsx          — Input con validación venezolana
  ImageUpload.tsx         — Dropzone + preview + upload

src/lib/
  db.ts                   — Cliente Neon serverless
  venezuela-data.ts       — Estados, ciudades, prefijos
  validations.ts          — Funciones de validación reutilizables

src/app/api/
  personas/route.ts       — GET + POST
  centros/route.ts        — GET + POST
  upload/route.ts         — POST (imagen a Vercel Blob)
  db/migrate/route.ts     — POST (crear tablas — dev only)
```

---

## Plan de implementación (orden)

1. Instalar dependencias: `@neondatabase/serverless`, `@vercel/blob`
2. Agregar `BLOB_READ_WRITE_TOKEN` a Vercel (manual por el usuario)
3. Crear `src/lib/db.ts` y `src/lib/venezuela-data.ts`
4. Crear route `POST /api/db/migrate` para inicializar tablas
5. Crear route `POST /api/upload` para imágenes
6. Crear routes `GET/POST /api/personas` y `/api/centros`
7. Crear componentes: SearchBar, VenezuelaSelects, ImageUpload
8. Crear modal AgregarPersonaModal con formulario completo
9. Reemplazar `page.tsx` con la nueva pantalla principal funcional
10. Actualizar SiteHeader con nueva navegación
11. Ejecutar migración y probar end-to-end
12. Commit y deploy a Vercel
