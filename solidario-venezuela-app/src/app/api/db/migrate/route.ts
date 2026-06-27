import { getSql } from '@/lib/db';

export async function POST() {
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS personas (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      apellido VARCHAR(100) NOT NULL,
      cedula_tipo CHAR(1),
      cedula_numero VARCHAR(12),
      fecha_nacimiento DATE,
      genero VARCHAR(20),
      estado VARCHAR(50) NOT NULL,
      ciudad VARCHAR(100) NOT NULL,
      telefono VARCHAR(20),
      email VARCHAR(200),
      foto_url TEXT,
      ultima_vez_fecha DATE,
      ultima_vez_lugar TEXT,
      descripcion TEXT,
      estado_busqueda VARCHAR(20) DEFAULT 'buscando',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS centros_ayuda (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(200) NOT NULL,
      tipo VARCHAR(50),
      estado VARCHAR(50) NOT NULL,
      ciudad VARCHAR(100) NOT NULL,
      direccion TEXT,
      telefono VARCHAR(20),
      email VARCHAR(200),
      horario VARCHAR(200),
      descripcion TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS denuncias (
      id SERIAL PRIMARY KEY,
      tipo VARCHAR(50) NOT NULL,
      estado VARCHAR(50) NOT NULL,
      ciudad VARCHAR(100) NOT NULL,
      descripcion TEXT NOT NULL,
      fecha_hecho DATE,
      latitud DOUBLE PRECISION,
      longitud DOUBLE PRECISION,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS voluntarios (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      habilidad VARCHAR(100) NOT NULL,
      estado VARCHAR(50) NOT NULL,
      ciudad VARCHAR(100) NOT NULL,
      telefono VARCHAR(20),
      disponibilidad VARCHAR(200),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS avisos (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(200) NOT NULL,
      contenido TEXT NOT NULL,
      tipo VARCHAR(20) DEFAULT 'info',
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE centros_ayuda ADD COLUMN IF NOT EXISTS necesidades TEXT`;
  await sql`ALTER TABLE centros_ayuda ADD COLUMN IF NOT EXISTS disponible TEXT`;

  // Add lat/lng columns if they don't exist yet (idempotent)
  await sql`ALTER TABLE personas ADD COLUMN IF NOT EXISTS latitud DOUBLE PRECISION`;
  await sql`ALTER TABLE personas ADD COLUMN IF NOT EXISTS longitud DOUBLE PRECISION`;
  await sql`ALTER TABLE centros_ayuda ADD COLUMN IF NOT EXISTS latitud DOUBLE PRECISION`;
  await sql`ALTER TABLE centros_ayuda ADD COLUMN IF NOT EXISTS longitud DOUBLE PRECISION`;

  return Response.json({ ok: true, message: 'Tablas creadas correctamente' });
}
