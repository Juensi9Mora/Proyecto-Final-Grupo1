/* CLASE CANCHA */
export class Cancha {
    constructor(nombre, pais, ciudad, categoria, moneda, valor, imagen, activa = true) {
        this.nombre = nombre;
        this.pais = pais;
        this.ciudad = ciudad;
        this.categoria = categoria;
        this.moneda = moneda;
        this.valor = valor;
        this.imagen = imagen;
        this.activa = activa;
    }
}