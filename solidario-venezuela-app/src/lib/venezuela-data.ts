export const ESTADOS_VENEZUELA = [
  'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar',
  'Carabobo', 'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón',
  'Guárico', 'La Guaira', 'Lara', 'Mérida', 'Miranda', 'Monagas',
  'Nueva Esparta', 'Portuguesa', 'Sucre', 'Táchira', 'Trujillo',
  'Yaracuy', 'Zulia', 'Dependencias Federales',
];

export const CIUDADES_POR_ESTADO: Record<string, string[]> = {
  'Amazonas': ['Puerto Ayacucho', 'San Fernando de Atabapo', 'Maroa'],
  'Anzoátegui': ['Barcelona', 'Puerto La Cruz', 'El Tigre', 'Anaco', 'Cantaura', 'Lecherías'],
  'Apure': ['San Fernando de Apure', 'Guasdualito', 'Biruaca'],
  'Aragua': ['Maracay', 'La Victoria', 'Turmero', 'Villa de Cura', 'Cagua', 'El Limón'],
  'Barinas': ['Barinas', 'Barinitas', 'Socopó', 'Ciudad Bolivia'],
  'Bolívar': ['Ciudad Bolívar', 'Puerto Ordaz', 'San Félix', 'Ciudad Guayana', 'Upata', 'Caicara del Orinoco'],
  'Carabobo': ['Valencia', 'Puerto Cabello', 'Guacara', 'Los Guayos', 'Naguanagua', 'San Diego'],
  'Cojedes': ['San Carlos', 'Tinaquillo', 'El Pao'],
  'Delta Amacuro': ['Tucupita', 'Barrancas del Orinoco'],
  'Distrito Capital': ['Caracas'],
  'Falcón': ['Coro', 'Punto Fijo', 'La Vela de Coro', 'Chichiriviche'],
  'Guárico': ['San Juan de los Morros', 'Calabozo', 'Valle de la Pascua', 'El Sombrero'],
  'La Guaira': ['La Guaira', 'Macuto', 'Catia La Mar', 'Caraballeda', 'Naiguatá'],
  'Lara': ['Barquisimeto', 'Carora', 'El Tocuyo', 'Quíbor', 'Cabudare'],
  'Mérida': ['Mérida', 'El Vigía', 'Tovar', 'Ejido', 'Lagunillas'],
  'Miranda': ['Los Teques', 'Guarenas', 'Guatire', 'Ocumare del Tuy', 'Petare', 'Higuerote', 'Charallave'],
  'Monagas': ['Maturín', 'Caripito', 'Punta de Mata', 'Temblador'],
  'Nueva Esparta': ['La Asunción', 'Porlamar', 'Pampatar', 'Juan Griego'],
  'Portuguesa': ['Guanare', 'Acarigua', 'Araure', 'Biscucuy'],
  'Sucre': ['Cumaná', 'Carúpano', 'Güiria', 'Cariaco'],
  'Táchira': ['San Cristóbal', 'Táriba', 'La Fría', 'Rubio', 'Ureña', 'San Antonio del Táchira'],
  'Trujillo': ['Valera', 'Trujillo', 'Boconó', 'Pampán'],
  'Yaracuy': ['San Felipe', 'Yaritagua', 'Chivacoa', 'Nirgua'],
  'Zulia': ['Maracaibo', 'Cabimas', 'Ciudad Ojeda', 'Machiques', 'San Francisco', 'Lagunillas'],
  'Dependencias Federales': ['Gran Roque', 'La Tortuga'],
};

export const PREFIJOS_MOVIL = ['0412', '0414', '0416', '0422', '0424', '0426'];

export const GENEROS = ['Masculino', 'Femenino', 'Prefiero no decir'];

export const ESTADOS_BUSQUEDA = [
  { label: 'En búsqueda', value: 'buscando' },
  { label: 'Encontrado/a', value: 'encontrado' },
  { label: 'Caso cerrado', value: 'descartado' },
];

export const TIPOS_CENTRO = [
  'Refugio', 'Comedor Popular', 'Centro Médico', 'Asesoría Legal',
  'Centro Educativo', 'Otros',
];
