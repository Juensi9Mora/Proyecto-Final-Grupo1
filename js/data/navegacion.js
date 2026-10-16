export const menuPrincipal = [
  { id: 'index',            texto: 'Inicio',    href: 'index.html' },
  { id: 'nosotros',         texto: 'Nosotros',  href: 'pages/nosotros.html' },
  { id: 'catalogo-canchas', texto: 'Deportes',  href: 'pages/catalogo-canchas.html' },
  { id: 'contacto',         texto: 'Contacto',  href: 'pages/contacto.html' },
];

export const footerColumnas = [
  {
    titulo: 'Únete a Mi Cancha',
    links: [
      { texto: 'Regístrate como socio', href: '#' },
      { texto: 'Beneficios', href: '#' },
      { texto: 'Portal de socio', href: '#' },
    ],
  },
  {
    titulo: 'Acerca de',
    links: [
      { texto: 'Nosotros', href: 'pages/nosotros.html', interno: true },
      { texto: 'Preguntas frecuentes', href: '#' },
      { texto: 'Términos y condiciones', href: '#' },
      { texto: 'Política de privacidad', href: '#' },
    ],
  },
];

export const contacto = {
  ubicacion: 'Bogotá, Colombia - Lima, Perú',
  telefonos: [
    { texto: '+57 315 265 415', href: 'tel:+57315265415' },
    { texto: '+51 986 516 576', href: 'tel:+51986516576' },
  ],
  correo: 'micancha@micancha.col',
};