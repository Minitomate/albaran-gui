import Airtable from 'airtable';
import type { Albaran } from '../types';
import { mockAlbaranes } from '../data/mockData';

const API_KEY = import.meta.env.VITE_AIRTABLE_TOKEN;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME;

const isConfigured = API_KEY && BASE_ID && TABLE_NAME && API_KEY !== 'your_airtable_token_here';

if (!isConfigured) {
    console.warn('Airtable configuration missing or invalid. Using mock data.');
}

const base = isConfigured ? new Airtable({ apiKey: API_KEY }).base(BASE_ID) : null;

// Mock in-memory storage for fallback
let localAlbaranes = [...mockAlbaranes];

export const airtableService = {
    async getAll(): Promise<Albaran[]> {
        if (!isConfigured || !base) {
            console.log('Returning mock data');
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return localAlbaranes;
        }

        try {
            const records = await base(TABLE_NAME).select({
                sort: [{ field: 'fecha_emision', direction: 'desc' }]
            }).all();

            return records.map(record => ({
                id: record.id,
                numero_albaran: record.get('numero_albaran') as string,
                fecha_emision: record.get('fecha_emision') as string,
                cliente_nombre: record.get('cliente_nombre') as string,
                cliente_cif_nif: record.get('cliente_cif_nif') as string,
                cliente_direccion: record.get('cliente_direccion') as string,
                proveedor_nombre: record.get('proveedor_nombre') as string,
                proveedor_cif_nif: record.get('proveedor_cif_nif') as string,
                proveedor_direccion: record.get('proveedor_direccion') as string,
                productos: (JSON.parse(record.get('productos') as string || '[]') as any[]).map(p => ({
                    ...p,
                    cantidad: Number(p.cantidad) || 0,
                    precio_unitario: Number(p.precio_unitario) || 0,
                    importe_linea: Number(p.importe_linea) || 0
                })),
                observaciones: (record.get('observaciones') as string) || '',
                importe_total: Number(record.get('importe_total')) || 0,
                firma: (record.get('firma') as string) || '',
            }));
        } catch (error) {
            console.error('Error fetching albaranes from Airtable:', error);
            throw error;
        }
    },

    async create(albaran: Omit<Albaran, 'id'>): Promise<Albaran> {
        if (!isConfigured || !base) {
            const newAlbaran = { ...albaran, id: crypto.randomUUID() };
            localAlbaranes.unshift(newAlbaran);
            await new Promise(resolve => setTimeout(resolve, 500));
            return newAlbaran;
        }

        try {
            const records = await base(TABLE_NAME).create([
                {
                    fields: {
                        numero_albaran: albaran.numero_albaran,
                        fecha_emision: albaran.fecha_emision,
                        cliente_nombre: albaran.cliente_nombre,
                        cliente_cif_nif: albaran.cliente_cif_nif,
                        cliente_direccion: albaran.cliente_direccion,
                        proveedor_nombre: albaran.proveedor_nombre,
                        proveedor_cif_nif: albaran.proveedor_cif_nif,
                        proveedor_direccion: albaran.proveedor_direccion,
                        productos: JSON.stringify(albaran.productos),
                        observaciones: albaran.observaciones,
                        importe_total: Number(albaran.importe_total),
                        firma: albaran.firma,
                    }
                }
            ], { typecast: true });

            const record = records[0];
            return { ...albaran, id: record.id };
        } catch (error) {
            console.error('Error creating albaran in Airtable:', error);
            throw error;
        }
    },

    async update(id: string, albaran: Partial<Albaran>): Promise<void> {
        if (!isConfigured || !base) {
            localAlbaranes = localAlbaranes.map(a => a.id === id ? { ...a, ...albaran } : a);
            await new Promise(resolve => setTimeout(resolve, 500));
            return;
        }

        try {
            const fields: any = { ...albaran };
            delete fields.id; // Don't send ID to Airtable

            if (fields.productos) {
                fields.productos = JSON.stringify(fields.productos);
            }

            if (fields.importe_total !== undefined) {
                fields.importe_total = Number(fields.importe_total);
            }

            await base(TABLE_NAME).update([
                {
                    id,
                    fields
                }
            ], { typecast: true });
        } catch (error) {
            console.error('Error updating albaran in Airtable:', error);
            throw error;
        }
    },

    async delete(id: string): Promise<void> {
        if (!isConfigured || !base) {
            localAlbaranes = localAlbaranes.filter(a => a.id !== id);
            await new Promise(resolve => setTimeout(resolve, 500));
            return;
        }

        try {
            await base(TABLE_NAME).destroy([id]);
        } catch (error) {
            console.error('Error deleting albaran from Airtable:', error);
            throw error;
        }
    }
};
