import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2 } from 'lucide-react';
import type { Albaran, Producto } from '../types';

interface AlbaranFormProps {
    initialData?: Albaran;
    onSubmit: (data: Albaran) => void;
}

const emptyProducto: Producto = {
    codigo: '',
    descripcion: '',
    cantidad: 1,
    unidad: 'unidades',
    precio_unitario: 0,
    importe_linea: 0
};

const emptyAlbaran: Albaran = {
    id: '',
    numero_albaran: '',
    fecha_emision: new Date().toISOString().split('T')[0],
    proveedor_nombre: '',
    proveedor_cif_nif: '',
    proveedor_direccion: '',
    cliente_nombre: '',
    cliente_cif_nif: '',
    cliente_direccion: '',
    productos: [],
    importe_total: 0,
    firma: '',
    observaciones: ''
};

const AlbaranForm: React.FC<AlbaranFormProps> = ({ initialData, onSubmit }) => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<'manual' | 'upload'>('manual');
    const [formData, setFormData] = useState<Albaran>(initialData || { ...emptyAlbaran, id: crypto.randomUUID() });

    useEffect(() => {
        // Recalculate totals whenever products change
        const total = formData.productos.reduce((sum, prod) => sum + prod.importe_linea, 0);
        setFormData(prev => ({ ...prev, importe_total: total }));
    }, [formData.productos]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProductChange = (index: number, field: keyof Producto, value: string | number) => {
        const newProductos = [...formData.productos];
        const product = { ...newProductos[index], [field]: value };

        // Recalculate line amount
        if (field === 'cantidad' || field === 'precio_unitario') {
            product.importe_linea = Number(product.cantidad) * Number(product.precio_unitario);
        }

        newProductos[index] = product;
        setFormData(prev => ({ ...prev, productos: newProductos }));
    };

    const addProduct = () => {
        setFormData(prev => ({
            ...prev,
            productos: [...prev.productos, { ...emptyProducto }]
        }));
    };

    const removeProduct = (index: number) => {
        setFormData(prev => ({
            ...prev,
            productos: prev.productos.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        navigate('/albaranes');
    };

    return (
        <div className="max-w-5xl mx-auto pb-12 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {initialData ? 'Editar Albarán' : 'Nuevo Albarán'}
                    </h1>
                    {!initialData && (
                        <div className="bg-gray-100 p-1 rounded-lg flex">
                            <button
                                type="button"
                                onClick={() => setMode('manual')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'manual'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                Manual
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode('upload')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'upload'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                Subir Foto/PDF
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/albaranes')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        {mode === 'upload' ? 'Volver' : 'Cancelar'}
                    </button>
                    {mode === 'manual' && (
                        <button
                            onClick={handleSubmit}
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Guardar Albarán
                        </button>
                    )}
                </div>
            </div>

            {mode === 'manual' ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* General Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Datos Generales</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Número Albarán</label>
                                    <input
                                        type="text"
                                        name="numero_albaran"
                                        required
                                        value={formData.numero_albaran}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Emisión</label>
                                    <input
                                        type="date"
                                        name="fecha_emision"
                                        required
                                        value={formData.fecha_emision}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Totals & Signature */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Resumen</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                                    <textarea
                                        name="observaciones"
                                        rows={3}
                                        value={formData.observaciones}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Firma</label>
                                    <input
                                        type="text"
                                        name="firma"
                                        placeholder="Nombre del firmante"
                                        value={formData.firma}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="pt-4 border-t flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Importe Total</span>
                                    <span className="text-2xl font-bold text-blue-600">{formData.importe_total.toFixed(2)} €</span>
                                </div>
                            </div>
                        </div>

                        {/* Provider Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Proveedor</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre / Razón Social</label>
                                <input
                                    type="text"
                                    name="proveedor_nombre"
                                    required
                                    value={formData.proveedor_nombre}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CIF / NIF</label>
                                <input
                                    type="text"
                                    name="proveedor_cif_nif"
                                    required
                                    value={formData.proveedor_cif_nif}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                <input
                                    type="text"
                                    name="proveedor_direccion"
                                    required
                                    value={formData.proveedor_direccion}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Client Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Cliente</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre / Razón Social</label>
                                <input
                                    type="text"
                                    name="cliente_nombre"
                                    required
                                    value={formData.cliente_nombre}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CIF / NIF</label>
                                <input
                                    type="text"
                                    name="cliente_cif_nif"
                                    required
                                    value={formData.cliente_cif_nif}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                <input
                                    type="text"
                                    name="cliente_direccion"
                                    required
                                    value={formData.cliente_direccion}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Líneas de Producto</h2>
                            <button
                                type="button"
                                onClick={addProduct}
                                className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Añadir Línea
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 w-32">Código</th>
                                        <th className="px-4 py-3">Descripción</th>
                                        <th className="px-4 py-3 w-24">Cant.</th>
                                        <th className="px-4 py-3 w-24">Unidad</th>
                                        <th className="px-4 py-3 w-32">Precio</th>
                                        <th className="px-4 py-3 w-32">Total</th>
                                        <th className="px-4 py-3 w-12"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {formData.productos.map((producto, index) => (
                                        <tr key={index}>
                                            <td className="p-2">
                                                <input
                                                    type="text"
                                                    value={producto.codigo}
                                                    onChange={(e) => handleProductChange(index, 'codigo', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                                    placeholder="COD"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="text"
                                                    value={producto.descripcion}
                                                    onChange={(e) => handleProductChange(index, 'descripcion', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                                    placeholder="Descripción del producto"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    value={producto.cantidad}
                                                    onChange={(e) => handleProductChange(index, 'cantidad', Number(e.target.value))}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="text"
                                                    value={producto.unidad}
                                                    onChange={(e) => handleProductChange(index, 'unidad', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    value={producto.precio_unitario}
                                                    onChange={(e) => handleProductChange(index, 'precio_unitario', Number(e.target.value))}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </td>
                                            <td className="p-2 font-medium text-right">
                                                {producto.importe_linea.toFixed(2)} €
                                            </td>
                                            <td className="p-2 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removeProduct(index)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {formData.productos.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500 italic">
                                                No hay productos. Añade una línea para comenzar.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[800px]">
                    <iframe
                        src="https://tally.so/r/QKKPdg?transparentBackground=1"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        title="Subir Albarán"
                    />
                </div>
            )}
        </div>
    );
};

export default AlbaranForm;
