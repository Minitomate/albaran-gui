import type { Albaran } from '../types';

export const mockAlbaranes: Albaran[] = [
    {
        id: "unique_id_1",
        numero_albaran: "ALB-2024-001",
        fecha_emision: "2024-11-25",
        proveedor_nombre: "Mi Empresa S.L.",
        proveedor_cif_nif: "B12345678",
        proveedor_direccion: "Calle Industria 1, Madrid",
        cliente_nombre: "Cliente Ejemplo S.A.",
        cliente_cif_nif: "A98765432",
        cliente_direccion: "Av. Comercial 22, Barcelona",
        productos: [
            {
                codigo: "PROD-001",
                descripcion: "Servicio de Consultoría",
                cantidad: 10,
                unidad: "horas",
                precio_unitario: 50.00,
                importe_linea: 500.00
            }
        ],
        importe_total: 500.00,
        firma: "",
        observaciones: "Entrega parcial"
    },
    {
        id: "unique_id_2",
        numero_albaran: "ALB-2024-002",
        fecha_emision: "2024-11-26",
        proveedor_nombre: "Mi Empresa S.L.",
        proveedor_cif_nif: "B12345678",
        proveedor_direccion: "Calle Industria 1, Madrid",
        cliente_nombre: "Tech Solutions Ltd.",
        cliente_cif_nif: "B87654321",
        cliente_direccion: "Parque Tecnológico 5, Valencia",
        productos: [
            {
                codigo: "HW-001",
                descripcion: "Monitor 27 pulgadas",
                cantidad: 2,
                unidad: "unidades",
                precio_unitario: 200.00,
                importe_linea: 400.00
            },
            {
                codigo: "HW-002",
                descripcion: "Teclado Mecánico",
                cantidad: 2,
                unidad: "unidades",
                precio_unitario: 80.00,
                importe_linea: 160.00
            }
        ],
        importe_total: 560.00,
        firma: "Juan Pérez",
        observaciones: "Entregar en recepción"
    },
    {
        id: "unique_id_3",
        numero_albaran: "ALB-2024-003",
        fecha_emision: "2024-11-27",
        proveedor_nombre: "Mi Empresa S.L.",
        proveedor_cif_nif: "B12345678",
        proveedor_direccion: "Calle Industria 1, Madrid",
        cliente_nombre: "Restaurante El Buen Sabor",
        cliente_cif_nif: "B11223344",
        cliente_direccion: "Plaza Mayor 10, Sevilla",
        productos: [
            {
                codigo: "SERV-005",
                descripcion: "Mantenimiento Web Mensual",
                cantidad: 1,
                unidad: "mes",
                precio_unitario: 150.00,
                importe_linea: 150.00
            }
        ],
        importe_total: 150.00,
        firma: "",
        observaciones: ""
    },
    {
        id: "unique_id_4",
        numero_albaran: "ALB-2024-004",
        fecha_emision: "2024-11-28",
        proveedor_nombre: "Mi Empresa S.L.",
        proveedor_cif_nif: "B12345678",
        proveedor_direccion: "Calle Industria 1, Madrid",
        cliente_nombre: "Construcciones Rápidas",
        cliente_cif_nif: "A55667788",
        cliente_direccion: "Polígono Norte 3, Bilbao",
        productos: [
            {
                codigo: "MAT-010",
                descripcion: "Licencia Software CAD",
                cantidad: 5,
                unidad: "licencias",
                precio_unitario: 300.00,
                importe_linea: 1500.00
            }
        ],
        importe_total: 1500.00,
        firma: "Ana García",
        observaciones: "Licencias anuales"
    },
    {
        id: "unique_id_5",
        numero_albaran: "ALB-2024-005",
        fecha_emision: "2024-11-29",
        proveedor_nombre: "Mi Empresa S.L.",
        proveedor_cif_nif: "B12345678",
        proveedor_direccion: "Calle Industria 1, Madrid",
        cliente_nombre: "Librería Central",
        cliente_cif_nif: "E99887766",
        cliente_direccion: "Calle Mayor 45, Zaragoza",
        productos: [
            {
                codigo: "SERV-002",
                descripcion: "Instalación Red Local",
                cantidad: 8,
                unidad: "horas",
                precio_unitario: 45.00,
                importe_linea: 360.00
            },
            {
                codigo: "MAT-005",
                descripcion: "Cable UTP Cat6",
                cantidad: 100,
                unidad: "metros",
                precio_unitario: 0.50,
                importe_linea: 50.00
            }
        ],
        importe_total: 410.00,
        firma: "",
        observaciones: "Pendiente de revisar conexión"
    }
];
