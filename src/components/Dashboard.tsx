import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    FileText,
    DollarSign,
    Calendar,
    ArrowUpRight,
    Package
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import type { Albaran } from '../types';

interface DashboardProps {
    albaranes: Albaran[];
}

const Dashboard: React.FC<DashboardProps> = ({ albaranes }) => {
    // Calculate stats
    const stats = useMemo(() => {
        const totalAlbaranes = albaranes.length;
        const totalImporte = albaranes.reduce((sum, a) => sum + a.importe_total, 0);
        const uniqueClients = new Set(albaranes.map(a => a.cliente_nombre)).size;
        const totalProducts = albaranes.reduce((sum, a) => sum + a.productos.length, 0);

        return [
            {
                label: 'Total Facturado',
                value: `${totalImporte.toFixed(2)} €`,
                icon: DollarSign,
                gradient: 'from-blue-500 to-blue-600',
                trend: '+12.5%',
                trendUp: true
            },
            {
                label: 'Albaranes Emitidos',
                value: totalAlbaranes,
                icon: FileText,
                gradient: 'from-purple-500 to-purple-600',
                trend: '+4',
                trendUp: true
            },
            {
                label: 'Clientes Activos',
                value: uniqueClients,
                icon: Users,
                gradient: 'from-emerald-500 to-emerald-600',
                trend: '+2',
                trendUp: true
            },
            {
                label: 'Productos Movidos',
                value: totalProducts,
                icon: Package,
                gradient: 'from-amber-500 to-amber-600',
                trend: '+15%',
                trendUp: true
            },
        ];
    }, [albaranes]);

    const [period, setPeriod] = React.useState('all');

    // Prepare chart data (Revenue by Month/Day/Albaran)
    const chartData = useMemo(() => {
        const now = new Date();
        const data: Record<string, number> = {};
        let filteredAlbaranes = albaranes;

        // Filter based on period
        if (period !== 'all') {
            const cutoffDate = new Date();
            switch (period) {
                case '1d':
                    cutoffDate.setHours(0, 0, 0, 0); // Start of today
                    break;
                case '1w':
                    cutoffDate.setDate(now.getDate() - 7);
                    break;
                case '1m':
                    cutoffDate.setMonth(now.getMonth() - 1);
                    break;
                case '3m':
                    cutoffDate.setMonth(now.getMonth() - 3);
                    break;
                case '6m':
                    cutoffDate.setMonth(now.getMonth() - 6);
                    break;
                case 'year':
                    cutoffDate.setMonth(0, 1); // Start of current year
                    cutoffDate.setHours(0, 0, 0, 0);
                    break;
            }

            filteredAlbaranes = albaranes.filter(a => new Date(a.fecha_emision) >= cutoffDate);
        }

        // Grouping logic
        if (period === '1d') {
            // For 1 day, since we don't have time, we map individual albaranes
            // This shows the sequence of albaranes for the day
            return filteredAlbaranes.map(a => ({
                name: a.numero_albaran,
                amount: a.importe_total
            })).reverse(); // Show in chronological order if list is desc
        } else if (['1w', '1m'].includes(period)) {
            // Group by Day
            filteredAlbaranes.forEach(a => {
                const date = new Date(a.fecha_emision);
                const day = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
                data[day] = (data[day] || 0) + a.importe_total;
            });
            // Sort by date
            return Object.entries(data)
                .sort((a, b) => {
                    const [d1, m1] = a[0].split('/');
                    const [d2, m2] = b[0].split('/');
                    // Simple sort assuming same year for 1m/1w roughly
                    return new Date(now.getFullYear(), parseInt(m1) - 1, parseInt(d1)).getTime() -
                        new Date(now.getFullYear(), parseInt(m2) - 1, parseInt(d2)).getTime();
                })
                .map(([name, amount]) => ({ name, amount }));
        } else {
            // Group by Month (default for longer periods and 'all')
            filteredAlbaranes.forEach(a => {
                const date = new Date(a.fecha_emision);
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                data[key] = (data[key] || 0) + a.importe_total;
            });

            return Object.entries(data)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([key, amount]) => {
                    const [year, month] = key.split('-');
                    const date = new Date(parseInt(year), parseInt(month) - 1);
                    return {
                        name: date.toLocaleString('es-ES', { month: 'short', year: '2-digit' }),
                        amount
                    };
                });
        }
    }, [albaranes, period]);

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                    >
                        Descargar Reporte
                    </button>
                    <Link
                        to="/albaranes/new"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 cursor-pointer"
                    >
                        Nuevo Albarán
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />

                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg shadow-blue-100`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    <ArrowUpRight className="w-3 h-3" />
                                    {stat.trend}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Evolución de Facturación</h2>
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="text-sm border-gray-200 rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Todo</option>
                            <option value="1d">Último día</option>
                            <option value="1w">Última semana</option>
                            <option value="1m">Último mes</option>
                            <option value="3m">Últimos 3 meses</option>
                            <option value="6m">Últimos 6 meses</option>
                            <option value="year">Este año</option>
                        </select>
                    </div>
                    <div className="h-80 w-full" style={{ minHeight: '320px' }}>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="99%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        tickFormatter={(value) => `${value}€`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorAmount)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <FileText className="w-12 h-12 mb-2 opacity-20" />
                                <p>No hay datos para el periodo seleccionado</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Actividad Reciente</h2>
                        <Link to="/albaranes" className="text-sm text-blue-600 font-medium hover:text-blue-700">Ver todo</Link>
                    </div>
                    <div className="space-y-6">
                        {albaranes.slice(0, 5).map((albaran, i) => (
                            <Link key={albaran.id} to={`/albaranes/${albaran.id}`} className="flex items-center gap-4 group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100">
                                        {albaran.numero_albaran.split('-')[1] || 'ALB'}
                                    </div>
                                    {i === 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                        {albaran.cliente_nombre}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {albaran.numero_albaran} • {albaran.fecha_emision}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">{albaran.importe_total.toFixed(2)} €</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        Completado
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
