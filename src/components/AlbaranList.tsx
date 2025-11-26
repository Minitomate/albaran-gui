import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Edit, Trash2, Plus, Download } from 'lucide-react';
import type { Albaran } from '../types';

interface AlbaranListProps {
    albaranes: Albaran[];
    onDelete: (id: string) => void;
}

const AlbaranList: React.FC<AlbaranListProps> = ({ albaranes, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAlbaranes = albaranes.filter(albaran =>
        (albaran.numero_albaran || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (albaran.cliente_nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (albaran.proveedor_nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToCSV = () => {
        const headers = ['Número', 'Fecha', 'Cliente', 'CIF Cliente', 'Proveedor', 'CIF Proveedor', 'Importe Total', 'Observaciones'];
        const csvContent = [
            headers.join(','),
            ...filteredAlbaranes.map(a => [
                a.numero_albaran,
                a.fecha_emision,
                `"${a.cliente_nombre}"`,
                a.cliente_cif_nif,
                `"${a.proveedor_nombre}"`,
                a.proveedor_cif_nif,
                a.importe_total,
                `"${a.observaciones.replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `albaranes_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Albaranes</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestiona tus notas de entrega</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={exportToCSV}
                        className="inline-flex items-center justify-center px-4 py-2 bg-white text-gray-700 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar CSV
                    </button>
                    <Link
                        to="/albaranes/new"
                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Albarán
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar por número, cliente o proveedor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Número</th>
                                <th className="px-6 py-3 font-semibold">Fecha</th>
                                <th className="px-6 py-3 font-semibold">Cliente</th>
                                <th className="px-6 py-3 font-semibold">Importe</th>
                                <th className="px-6 py-3 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredAlbaranes.length > 0 ? (
                                filteredAlbaranes.map((albaran) => (
                                    <tr key={albaran.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {albaran.numero_albaran}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {albaran.fecha_emision}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="font-medium text-gray-900">{albaran.cliente_nombre}</div>
                                            <div className="text-xs text-gray-500">{albaran.cliente_cif_nif}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {albaran.importe_total.toFixed(2)} €
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/albaranes/${albaran.id}`}
                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    to={`/albaranes/${albaran.id}/edit`}
                                                    className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => onDelete(albaran.id)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No se encontraron albaranes que coincidan con tu búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
                    <span>Mostrando {filteredAlbaranes.length} registros</span>
                </div>
            </div>
        </div>
    );
};

export default AlbaranList;
