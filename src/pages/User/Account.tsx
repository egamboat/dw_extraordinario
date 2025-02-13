import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Button, Modal } from '@mui/material';
import { fetchUserData, updateUserData } from '../../services/User/Account';
import { UserData } from '../../services/User/types';
// import { useUserContext } from '../../services/User/context/UserContext';
import EditUserModal from '../../componets/User/EditUserModal';


export const Account = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [incompleteData, setIncompleteData] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<Partial<UserData>>({});

    useEffect(() => {
        const getUserData = async () => {
            try {
                const data = await fetchUserData();
                setUserData(data);

                if (!data.first_name || !data.last_name || !data.username || !data.email) {
                    setIncompleteData(true);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getUserData();
    }, []);


    const handleOpenModal = () => {
        if (userData) {
            setFormData({
                first_name: userData.first_name,
                last_name: userData.last_name,
                username: userData.username,
                email: userData.email,
            });
        }
        setOpen(true);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async () => {
        try {
            await updateUserData(formData);
            const updatedData = await fetchUserData(); // Recargar datos actualizados
            setUserData(updatedData);
            setIncompleteData(false);
            setOpen(false);
        } catch (err) {
            setError('Error al actualizar el usuario');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '2rem',
                    color: '#1a365d',
                    letterSpacing: '0.1em',
                }}>
                    Perfil
                </Typography>
                <Button variant="contained" sx={{ backgroundColor: "#b77ee0" }} onClick={handleOpenModal}>
                    Editar Perfil
                </Button>
            </Box>

            {incompleteData && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Hay datos incompletos en tu perfil. Por favor, actualízalos.
                </Alert>
            )}

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
                        <p className="mt-1 text-lg text-gray-900">{userData?.first_name || 'No especificado'} {userData?.last_name || ''}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Nombre de Usuario</h3>
                        <p className="mt-1 text-lg text-gray-900">{userData?.username || 'No especificado'}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Correo Electrónico</h3>
                        <p className="mt-1 text-lg text-gray-900">{userData?.email || 'No especificado'}</p>
                    </div>
                </div>
            )}
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, p: 4, borderRadius: 2,
                }}>
                    <EditUserModal
                        open={open}
                        handleClose={() => setOpen(false)}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        formData={formData}
                    />
                </Box>
            </Modal>
        </Box>

    );
};
