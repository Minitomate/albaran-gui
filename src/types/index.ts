export interface Producto {
    codigo: string;
    descripcion: string;
    cantidad: number;
    unidad: string;
    precio_unitario: number;
    importe_linea: number;
}

export interface Albaran {
    id: string;
    numero_albaran: string;
    fecha_emision: string;
    proveedor_nombre: string;
    proveedor_cif_nif: string;
    proveedor_direccion: string;
    cliente_nombre: string;
    cliente_cif_nif: string;
    cliente_direccion: string;
    productos: Producto[];
    importe_total: number;
    firma: string;
    observaciones: string;
}
