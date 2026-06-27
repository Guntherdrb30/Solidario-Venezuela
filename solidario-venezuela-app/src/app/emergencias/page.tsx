import Link from 'next/link';

const EMERGENCIAS = [
  {
    categoria: 'Emergencias nacionales',
    color: 'red',
    numeros: [
      { nombre: 'Emergencias generales',        numero: '911',           nota: 'Línea principal de emergencias' },
      { nombre: 'Cuerpo de Bomberos',            numero: '171',           nota: 'Incendios y rescates' },
      { nombre: 'Cruz Roja Venezolana',          numero: '0212-709-5555', nota: 'Ayuda humanitaria y rescate' },
      { nombre: 'Defensa Civil',                 numero: '0800-333-3672', nota: 'Desastres y emergencias civiles' },
      { nombre: 'Protección Civil',              numero: '0800-0224444',  nota: 'Coordinación de emergencias' },
      { nombre: 'CICPC',                         numero: '0800-242720',   nota: 'Denuncias e investigación' },
    ],
  },
  {
    categoria: 'Salud',
    color: 'blue',
    numeros: [
      { nombre: 'IVSS — Seguro Social',          numero: '0800-100-4877', nota: 'Atención médica' },
      { nombre: 'Ministerio de Salud',           numero: '0800-SALUD-YA', nota: 'Orientación sanitaria' },
      { nombre: 'Línea antisuicidio',            numero: '0800-0090006',  nota: 'Apoyo en crisis emocionales' },
    ],
  },
  {
    categoria: 'Ayuda internacional',
    color: 'green',
    numeros: [
      { nombre: 'Cruz Roja Internacional (CICR)', numero: '+58 212 263-0655', nota: 'Personas desaparecidas y DIV' },
      { nombre: 'ACNUR Venezuela',               numero: '+58 212 285-6655', nota: 'Refugiados y desplazados' },
      { nombre: 'UNICEF Venezuela',              numero: '+58 212 286-7111', nota: 'Niños y adolescentes' },
    ],
  },
  {
    categoria: 'Servicios públicos',
    color: 'yellow',
    numeros: [
      { nombre: 'CORPOELEC',                     numero: '0800-266-7352',  nota: 'Fallas eléctricas' },
      { nombre: 'Hidrocapital / Aguas',          numero: '0800-443-6227',  nota: 'Agua potable' },
      { nombre: 'Gas / PDVSA',                   numero: '0800-473-8672',  nota: 'Emergencias de gas' },
    ],
  },
];

const COLOR: Record<string, { header: string; badge: string; icon: string }> = {
  red:    { header: 'bg-red-600',    badge: 'bg-red-50 border-red-200 text-red-800',     icon: '🚨' },
  blue:   { header: 'bg-blue-600',   badge: 'bg-blue-50 border-blue-200 text-blue-800',  icon: '🏥' },
  green:  { header: 'bg-green-700',  badge: 'bg-green-50 border-green-200 text-green-800', icon: '🌍' },
  yellow: { header: 'bg-yellow-600', badge: 'bg-yellow-50 border-yellow-200 text-yellow-800', icon: '⚡' },
};

export default function EmergenciasPage() {
  return (
    <main className="min-h-screen bg-[#f8f7f2]">
      <div className="bg-red-600 py-10 px-5 text-center">
        <p className="text-red-200 text-sm font-medium uppercase tracking-widest mb-2">Solidario Venezuela</p>
        <h1 className="text-3xl font-bold text-white">🆘 Números de emergencia</h1>
        <p className="mt-2 text-red-100">Guarda estos números — pueden salvar una vida</p>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-8 space-y-6">
        {EMERGENCIAS.map(grupo => {
          const c = COLOR[grupo.color];
          return (
            <div key={grupo.categoria} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className={`${c.header} px-5 py-3 flex items-center gap-2`}>
                <span className="text-xl">{c.icon}</span>
                <h2 className="text-base font-bold text-white">{grupo.categoria}</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {grupo.numeros.map(n => (
                  <div key={n.numero} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{n.nombre}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.nota}</p>
                    </div>
                    <a href={`tel:${n.numero.replace(/\s/g, '')}`}
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-bold ${c.badge} hover:opacity-80`}>
                      📞 {n.numero}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="rounded-2xl bg-[#17221c] p-5 text-center">
          <p className="text-[#f0d963] font-semibold mb-1">¿Conoces a alguien desaparecido?</p>
          <p className="text-[#a8c4b0] text-sm mb-4">Regístralo en la plataforma para que su familia pueda encontrarlo</p>
          <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-[#1f7a4d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#17663f]">
            Ir a Solidario Venezuela
          </Link>
        </div>
      </div>
    </main>
  );
}
