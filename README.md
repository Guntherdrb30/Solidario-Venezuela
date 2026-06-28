# Solidario Venezuela 🇻🇪

**Plataforma humanitaria de respuesta al terremoto en Venezuela.**  
Conecta a familias que buscan personas desaparecidas, centros de ayuda, voluntarios, brigadas de rescate y peritos que ofrecen evaluación estructural gratuita.

🌐 **[solidario-venezuela.vercel.app](https://solidario-venezuela.vercel.app)**  
📖 **[API pública →](https://solidario-venezuela.vercel.app/api-docs)**

---

## ¿Qué puedes hacer con esta plataforma?

| Sección | Para quién | ¿Qué permite? |
|---|---|---|
| 👤 **Personas** | Familias afectadas | Registrar y buscar personas desaparecidas, reportar avistamientos |
| 🏠 **Centros** | Organizaciones | Publicar centros de albergue, acopio de alimentos, ropa y medicinas |
| 🙋 **Voluntarios** | Ciudadanos | Registrarse como voluntario con habilidades específicas |
| 🆘 **Rescate** | Afectados | Solicitar rescate con tipo de emergencia y ubicación GPS |
| 🏚️ **Daños** | Damnificados | Reportar daños estructurales y solicitar peritaje gratuito |
| 👷 **Peritos** | Ingenieros/Arquitectos | Registrarse como perito voluntario para evaluar inmuebles |
| 🚨 **Denuncias** | Ciudadanos | Reportar anomalías de forma completamente anónima |
| 📢 **Avisos** | Organizaciones | Panel de administración para publicar avisos oficiales |

---

## API pública y abierta

Todos los datos son de acceso libre. Cualquier plataforma, app o desarrollador puede consultar los endpoints **sin autenticación**.

**Base URL:** `https://solidario-venezuela.vercel.app`

### Endpoints disponibles

```
GET  /api/personas       ?q=nombre&estado=Miranda
GET  /api/centros        ?q=nombre&estado=Zulia
GET  /api/voluntarios    ?q=habilidad&estado=Lara
GET  /api/rescate        ?q=texto&estado=Aragua
GET  /api/danos          ?q=texto&estado=Carabobo
GET  /api/peritos        ?q=profesion&estado=Miranda
GET  /api/stats          (conteos globales)

POST /api/personas       (registrar persona desaparecida)
POST /api/centros        (registrar centro de ayuda)
POST /api/voluntarios    (registrarse como voluntario)
POST /api/rescate        (solicitar rescate)
POST /api/danos          (reportar daño estructural)
POST /api/peritos        (registrarse como perito)
```

CORS habilitado — puedes hacer `fetch` desde cualquier dominio:

```javascript
fetch('https://solidario-venezuela.vercel.app/api/personas?estado=Miranda')
  .then(r => r.json())
  .then(data => console.log(data))
```

> Documentación completa con ejemplos: **[/api-docs](https://solidario-venezuela.vercel.app/api-docs)**

---

## Colaborar con otras plataformas

Este proyecto nació para ser **federado** — si tu organización tiene una plataforma propia de respuesta humanitaria, puedes:

- **Consumir nuestros datos** vía API pública para mostrarlos en tu plataforma
- **Enviarnos datos** haciendo POST a nuestros endpoints para que aparezcan aquí también
- **Hacer un fork** y montar tu propia instancia regional o temática
- **Contribuir código** con Pull Requests

---

## Stack tecnológico

- **Frontend:** Next.js 16 (App Router) + Tailwind CSS v4
- **Backend:** Next.js Route Handlers (serverless)
- **Base de datos:** PostgreSQL en [Neon](https://neon.tech) (serverless)
- **Almacenamiento:** Vercel Blob (fotos)
- **Deploy:** Vercel

---

## Ejecutar localmente

```bash
git clone https://github.com/Guntherdrb30/Solidario-Venezuela.git
cd Solidario-Venezuela/solidario-venezuela-app
npm install
```

Crea un archivo `.env.local`:

```env
POSTGRES_URL=tu_url_de_neon
BLOB_READ_WRITE_TOKEN=tu_token_de_vercel_blob
ADMIN_SECRET=tu_clave_secreta
```

```bash
npm run dev
# Abre http://localhost:3000
# Luego corre la migración: POST http://localhost:3000/api/db/migrate
```

---

## Variables de entorno necesarias (Vercel)

| Variable | Descripción |
|---|---|
| `POSTGRES_URL` | URL de conexión a base de datos Neon PostgreSQL |
| `BLOB_READ_WRITE_TOKEN` | Token de Vercel Blob para subir fotos |
| `ADMIN_SECRET` | Clave secreta para el panel de administración `/admin` |

---

## Licencia

**MIT** — Libre para usar, modificar y distribuir.  
Los datos pertenecen a los ciudadanos que los reportan. Úsalos solo para fines humanitarios.

---

Desarrollado con solidaridad. Para el pueblo venezolano. 🇻🇪
