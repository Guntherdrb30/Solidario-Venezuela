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

  await sql`
    CREATE TABLE IF NOT EXISTS avistamientos (
      id SERIAL PRIMARY KEY,
      persona_id INTEGER NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
      fecha DATE,
      lugar VARCHAR(200) NOT NULL,
      descripcion TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Add lat/lng columns if they don't exist yet (idempotent)
  await sql`ALTER TABLE personas ADD COLUMN IF NOT EXISTS latitud DOUBLE PRECISION`;
  await sql`ALTER TABLE personas ADD COLUMN IF NOT EXISTS longitud DOUBLE PRECISION`;
  await sql`ALTER TABLE centros_ayuda ADD COLUMN IF NOT EXISTS latitud DOUBLE PRECISION`;
  await sql`ALTER TABLE centros_ayuda ADD COLUMN IF NOT EXISTS longitud DOUBLE PRECISION`;

  await sql`
    CREATE TABLE IF NOT EXISTS solicitudes_rescate (
      id SERIAL PRIMARY KEY,
      tipo_emergencia VARCHAR(50) NOT NULL,
      estado VARCHAR(50) NOT NULL,
      ciudad VARCHAR(100) NOT NULL,
      direccion TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      personas_involucradas INTEGER,
      contacto_nombre VARCHAR(100),
      contacto_telefono VARCHAR(20),
      latitud DOUBLE PRECISION,
      longitud DOUBLE PRECISION,
      estado_solicitud VARCHAR(20) DEFAULT 'activa',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS danos_estructurales (
      id SERIAL PRIMARY KEY,
      tipo_inmueble VARCHAR(50) NOT NULL,
      severidad VARCHAR(20) NOT NULL,
      estado VARCHAR(50) NOT NULL,
      ciudad VARCHAR(100) NOT NULL,
      direccion TEXT NOT NULL,
      descripcion TEXT,
      foto_url TEXT,
      personas_afectadas INTEGER,
      contacto_nombre VARCHAR(100),
      contacto_telefono VARCHAR(20),
      latitud DOUBLE PRECISION,
      longitud DOUBLE PRECISION,
      estado_peritaje VARCHAR(20) DEFAULT 'pendiente',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS peritos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      profesion VARCHAR(100) NOT NULL,
      numero_colegiado VARCHAR(50),
      estado VARCHAR(50) NOT NULL,
      ciudad VARCHAR(100) NOT NULL,
      telefono VARCHAR(20),
      email VARCHAR(200),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS donaciones (
      id SERIAL PRIMARY KEY,
      tipo VARCHAR(20) NOT NULL DEFAULT 'dinero',
      monto NUMERIC(12,2),
      moneda VARCHAR(10) DEFAULT 'USD',
      descripcion_especie TEXT,
      categoria VARCHAR(50) NOT NULL,
      proposito TEXT NOT NULL,
      donante_nombre VARCHAR(150) NOT NULL,
      donante_empresa VARCHAR(200),
      donante_telefono VARCHAR(30),
      donante_email VARCHAR(200),
      donante_pais VARCHAR(100) NOT NULL,
      organizacion_id INTEGER,
      estado VARCHAR(20) DEFAULT 'disponible',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS organizaciones (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(200) NOT NULL,
      tipo VARCHAR(50) NOT NULL,
      descripcion TEXT NOT NULL,
      areas TEXT,
      contacto_nombre VARCHAR(150) NOT NULL,
      telefono VARCHAR(30),
      email VARCHAR(200),
      website VARCHAR(300),
      estado VARCHAR(50),
      ciudad VARCHAR(100),
      pais_sede VARCHAR(100) NOT NULL DEFAULT 'Venezuela',
      rif VARCHAR(20),
      verificada BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE organizaciones ADD COLUMN IF NOT EXISTS latitud DOUBLE PRECISION`;
  await sql`ALTER TABLE organizaciones ADD COLUMN IF NOT EXISTS longitud DOUBLE PRECISION`;
  await sql`ALTER TABLE organizaciones ADD COLUMN IF NOT EXISTS direccion TEXT`;

  await sql`
    CREATE TABLE IF NOT EXISTS api_tokens (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(200) NOT NULL,
      token VARCHAR(100) NOT NULL UNIQUE,
      dominio VARCHAR(300) NOT NULL,
      activo BOOLEAN DEFAULT TRUE,
      usos INTEGER DEFAULT 0,
      ultimo_uso TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      accion VARCHAR(100) NOT NULL,
      tabla VARCHAR(50) NOT NULL,
      record_id INTEGER,
      ip VARCHAR(100),
      user_agent TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  return Response.json({ ok: true, message: 'Tablas creadas correctamente' });
}
