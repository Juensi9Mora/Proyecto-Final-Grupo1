/* CLASE CANCHA */
export class Cancha {
    constructor(nombre, pais, ciudad, categoria, moneda, valor, imagen, balon, detalle, activa = true, subcategoria = "", direccion = "") {
        this.nombre = nombre;
        this.pais = pais;
        this.ciudad = ciudad;
        this.categoria = categoria;
        this.subcategoria = categoria === "Fútbol" ? subcategoria: "";
        this.moneda = moneda;
        this.valor = valor;
        this.imagen = imagen;
        this.balon = balon;
        this.detalle = detalle;
        this.direccion = direccion;
        this.activa = activa;
    }
}