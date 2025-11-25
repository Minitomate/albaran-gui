import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AlbaranList from './components/AlbaranList';
import AlbaranForm from './components/AlbaranForm';
import AlbaranDetail from './components/AlbaranDetail';
import Dashboard from './components/Dashboard';
import { mockAlbaranes } from './data/mockData';
import type { Albaran } from './types';

// Edit Wrapper Component
const EditWrapper: React.FC<{ albaranes: Albaran[]; onUpdate: (data: Albaran) => void }> = ({ albaranes, onUpdate }) => {
    const { id } = useParams<{ id: string }>();
    const albaran = albaranes.find(a => a.id === id);

    if (!albaran) return <Navigate to="/albaranes" />;

    return <AlbaranForm initialData={albaran} onSubmit={onUpdate} />;
};

function App() {
    const [albaranes, setAlbaranes] = useState<Albaran[]>(mockAlbaranes);

    const handleCreate = (newAlbaran: Albaran) => {
        setAlbaranes(prev => [newAlbaran, ...prev]);
    };

    const handleUpdate = (updatedAlbaran: Albaran) => {
        setAlbaranes(prev => prev.map(a => a.id === updatedAlbaran.id ? updatedAlbaran : a));
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este albarán?')) {
            setAlbaranes(prev => prev.filter(a => a.id !== id));
        }
    };

    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard albaranes={albaranes} />} />
                    <Route path="/albaranes" element={<AlbaranList albaranes={albaranes} onDelete={handleDelete} />} />
                    <Route path="/albaranes/new" element={<AlbaranForm onSubmit={handleCreate} />} />
                    <Route path="/albaranes/:id" element={<AlbaranDetail albaranes={albaranes} />} />
                    <Route path="/albaranes/:id/edit" element={
                        <EditWrapper albaranes={albaranes} onUpdate={handleUpdate} />
                    } />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
