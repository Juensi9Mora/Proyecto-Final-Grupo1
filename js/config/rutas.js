const estaEnPages = window.location.pathname.includes('/pages/');
export const BASE = estaEnPages ? '../' : './';

export const ruta = (path) => `${BASE}${path}`;

export const paginaActual = () => {
  const archivo = window.location.pathname.split('/').pop();
  return archivo ? archivo.replace('.html', '') : 'index';
};