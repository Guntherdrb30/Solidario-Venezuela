const BASE = 'https://solidario-venezuela.vercel.app';

const endpoints = [
  {
    group: 'Personas desaparecidas',
    color: 'green',
    items: [
      {
        method: 'GET', path: '/api/personas',
        desc: 'Lista personas. Soporta ?q=nombre&estado=Caracas',
        example: `${BASE}/api/personas?estado=Miranda`,
        response: '[{ "id": 1, "nombre": "Juan", "apellido": "Pérez", "estado_busqueda": "buscando", ... }]',
      },
      {
        method: 'POST', path: '/api/personas',
        desc: 'Registra una persona desaparecida.',
        body: '{ "nombre": "Juan", "apellido": "Pérez", "estado": "Miranda", "ciudad": "Caracas", "descripcion": "..." }',
        response: '{ "id": 5, ... }',
      },
    ],
  },
  {
    group: 'Centros de ayuda',
    color: 'blue',
    items: [
      {
        method: 'GET', path: '/api/centros',
        desc: 'Lista centros. Soporta ?q=nombre&estado=Zulia',
        example: `${BASE}/api/centros`,
        response: '[{ "id": 1, "nombre": "Centro El Calvario", "tipo": "Albergue", ... }]',
      },
      {
        method: 'POST', path: '/api/centros',
        desc: 'Registra un centro de ayuda.',
        body: '{ "nombre": "...", "tipo": "Albergue", "estado": "Mérida", "ciudad": "Mérida", "direccion": "..." }',
        response: '{ "id": 3, ... }',
      },
    ],
  },
  {
    group: 'Voluntarios',
    color: 'purple',
    items: [
      {
        method: 'GET', path: '/api/voluntarios',
        desc: 'Lista voluntarios. Soporta ?q=habilidad&estado=Lara',
        example: `${BASE}/api/voluntarios`,
        response: '[{ "id": 1, "nombre": "María", "habilidad": "medico", "ciudad": "Barquisimeto", ... }]',
      },
      {
        method: 'POST', path: '/api/voluntarios',
        desc: 'Registra un voluntario.',
        body: '{ "nombre": "...", "habilidad": "medico", "estado": "Lara", "ciudad": "Barquisimeto" }',
        response: '{ "id": 2, ... }',
      },
    ],
  },
  {
    group: 'Solicitudes de rescate',
    color: 'red',
    items: [
      {
        method: 'GET', path: '/api/rescate',
        desc: 'Lista solicitudes activas. Soporta ?q=texto&estado=Aragua',
        example: `${BASE}/api/rescate`,
        response: '[{ "id": 1, "tipo_emergencia": "derrumbe", "estado_solicitud": "activa", ... }]',
      },
      {
        method: 'POST', path: '/api/rescate',
        desc: 'Crea una solicitud de rescate.',
        body: '{ "tipo_emergencia": "derrumbe", "estado": "Aragua", "ciudad": "Maracay", "direccion": "...", "descripcion": "..." }',
        response: '{ "id": 1, ... }',
      },
    ],
  },
  {
    group: 'Daños estructurales',
    color: 'orange',
    items: [
      {
        method: 'GET', path: '/api/danos',
        desc: 'Lista reportes de daños. Soporta ?q=texto&estado=Carabobo',
        example: `${BASE}/api/danos`,
        response: '[{ "id": 1, "tipo_inmueble": "vivienda", "severidad": "grave", "estado_peritaje": "pendiente", ... }]',
      },
      {
        method: 'POST', path: '/api/danos',
        desc: 'Reporta un daño estructural.',
        body: '{ "tipo_inmueble": "vivienda", "severidad": "grave", "estado": "Carabobo", "ciudad": "Valencia", "direccion": "..." }',
        response: '{ "id": 2, ... }',
      },
    ],
  },
  {
    group: 'Peritos voluntarios',
    color: 'blue',
    items: [
      {
        method: 'GET', path: '/api/peritos',
        desc: 'Lista peritos. Soporta ?q=profesion&estado=Miranda',
        example: `${BASE}/api/peritos`,
        response: '[{ "id": 1, "nombre": "Carlos", "profesion": "Ingeniero Civil", "ciudad": "Caracas", ... }]',
      },
      {
        method: 'POST', path: '/api/peritos',
        desc: 'Registra un perito voluntario.',
        body: '{ "nombre": "Carlos López", "profesion": "Ingeniero Civil", "estado": "Miranda", "ciudad": "Caracas", "telefono": "04121234567" }',
        response: '{ "id": 3, ... }',
      },
    ],
  },
  {
    group: 'Estadísticas',
    color: 'gray',
    items: [
      {
        method: 'GET', path: '/api/stats',
        desc: 'Conteo global de todos los registros.',
        example: `${BASE}/api/stats`,
        response: '{ "personas": 142, "buscando": 98, "encontrado": 44, "centros": 23, "voluntarios": 67, "denuncias": 12 }',
      },
    ],
  },
];

const METHOD_CLS: Record<string, string> = {
  GET: 'bg-green-100 text-green-800',
  POST: 'bg-blue-100 text-blue-800',
};

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-[#f8f7f2]">
      <div className="bg-[#17221c] py-12 px-5">
        <div className="mx-auto max-w-4xl">
          <p className="text-[#f0d963] text-sm font-medium uppercase tracking-widest mb-2">Solidario Venezuela</p>
          <h1 className="text-3xl font-bold text-white mb-3">API Pública</h1>
          <p className="text-[#a8c4b0]">
            Todos los datos son de acceso libre. Puedes consultar los endpoints GET sin autenticación.
            Licencia MIT — libre para uso humanitario, académico y colaborativo.
          </p>
          <div className="mt-4 flex gap-3 flex-wrap">
            <a href="https://github.com/guntherdelrosario/solidario-venezuela"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-sm text-white hover:bg-white/20">
              GitHub — Código fuente
            </a>
            <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-sm text-white">
              Base URL: <code className="font-mono text-[#f0d963]">{BASE}</code>
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-10 space-y-10">
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm font-semibold text-blue-800 mb-1">CORS habilitado</p>
          <p className="text-sm text-blue-700">
            Todos los endpoints responden con <code className="bg-blue-100 px-1 rounded">Access-Control-Allow-Origin: *</code>.
            Puedes hacer fetch desde cualquier dominio.
          </p>
          <pre className="mt-3 bg-blue-900 text-green-300 rounded-lg p-3 text-xs overflow-x-auto">{`fetch('${BASE}/api/personas?estado=Miranda')
  .then(r => r.json())
  .then(data => console.log(data))`}</pre>
        </div>

        {endpoints.map(group => (
          <section key={group.group}>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">{group.group}</h2>
            <div className="space-y-4">
              {group.items.map(ep => (
                <div key={ep.path + ep.method} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${METHOD_CLS[ep.method]}`}>{ep.method}</span>
                    <code className="text-sm font-mono text-gray-800">{ep.path}</code>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-sm text-gray-700">{ep.desc}</p>
                    {ep.example && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">Ejemplo</p>
                        <a href={ep.example} target="_blank" rel="noopener noreferrer"
                          className="text-xs font-mono text-[#1f7a4d] underline break-all">{ep.example}</a>
                      </div>
                    )}
                    {ep.body && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">Body (JSON)</p>
                        <pre className="bg-gray-900 text-green-300 rounded-lg p-3 text-xs overflow-x-auto">{ep.body}</pre>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">Respuesta</p>
                      <pre className="bg-gray-900 text-green-300 rounded-lg p-3 text-xs overflow-x-auto">{ep.response}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="rounded-xl bg-gray-50 border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Licencia</h3>
          <p className="text-sm text-gray-600">
            Código bajo licencia <strong>MIT</strong>. Libre para usar, modificar y distribuir.
            Los datos son propiedad de los ciudadanos que los reportan — úsalos solo para fines humanitarios.
          </p>
        </div>
      </div>
    </main>
  );
}
