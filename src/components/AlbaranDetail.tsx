import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Edit } from 'lucide-react';
import type { Albaran } from '../types';

interface AlbaranDetailProps {
    albaranes: Albaran[];
}

const AlbaranDetail: React.FC<AlbaranDetailProps> = ({ albaranes }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const albaran = albaranes.find(a => a.id === id);

    if (!albaran) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Albarán no encontrado</h2>
                <Link to="/albaranes" className="text-blue-600 hover:underline mt-4 inline-block">
                    Volver al listado
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8 print:hidden">
                <button
                    onClick={() => navigate('/albaranes')}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                </button>
                <div className="flex gap-3">
                    <Link
                        to={`/albaranes/${albaran.id}/edit`}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimir
                    </button>
                </div>
            </div>

            <div className="bg-white p-8 shadow-lg rounded-xl print:shadow-none print:p-0" id="printable-area">
                {/* Header */}
                <div className="flex justify-between items-start mb-12 border-b pb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">ALBARÁN</h1>
                        <p className="text-gray-500">Nº: <span className="font-mono font-medium text-gray-900">{albaran.numero_albaran}</span></p>
                        <p className="text-gray-500">Fecha: <span className="font-medium text-gray-900">{albaran.fecha_emision}</span></p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-lg font-bold text-gray-900">{albaran.proveedor_nombre}</h2>
                        <p className="text-gray-600 text-sm">{albaran.proveedor_direccion}</p>
                        <p className="text-gray-600 text-sm">CIF/NIF: {albaran.proveedor_cif_nif}</p>
                    </div>
                </div>

                {/* Client Info */}
                <div className="mb-12 bg-gray-50 p-6 rounded-lg print:bg-transparent print:p-0 print:border print:border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Cliente</h3>
                    <div className="text-gray-900">
                        <p className="font-bold text-lg">{albaran.cliente_nombre}</p>
                        <p>{albaran.cliente_direccion}</p>
                        <p>CIF/NIF: {albaran.cliente_cif_nif}</p>
                    </div>
                </div>

                {/* Products Table */}
                <div className="mb-12">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b-2 border-gray-200 print:bg-gray-100">
                            <tr>
                                <th className="px-4 py-3">Código</th>
                                <th className="px-4 py-3">Descripción</th>
                                <th className="px-4 py-3 text-right">Cant.</th>
                                <th className="px-4 py-3 text-right">Precio Unit.</th>
                                <th className="px-4 py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {albaran.productos.map((producto, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3 font-mono text-gray-600">{producto.codigo}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{producto.descripcion}</td>
                                    <td className="px-4 py-3 text-right">{producto.cantidad} {producto.unidad}</td>
                                    <td className="px-4 py-3 text-right">{producto.precio_unitario.toFixed(2)} €</td>
                                    <td className="px-4 py-3 text-right font-semibold">{producto.importe_linea.toFixed(2)} €</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-gray-200">
                                <td colSpan={4} className="px-4 py-4 text-right font-bold text-gray-900 text-lg">Total</td>
                                <td className="px-4 py-4 text-right font-bold text-blue-600 text-lg">{albaran.importe_total.toFixed(2)} €</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Footer Info */}
                <div className="grid grid-cols-2 gap-12 pt-8 border-t border-gray-200">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Observaciones</h3>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{albaran.observaciones || '-'}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-8">Firma / Conforme</h3>
                        <div className="border-b border-gray-300 pb-2">
                            <p className="text-gray-900 font-script text-xl italic">{albaran.firma}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlbaranDetail;
