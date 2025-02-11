import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Typography, Box } from '@mui/material';
import { useUserContext } from '../../services/User/context/UserContext';
interface UserData {
    email: string;
    name: string;
    username: string;
}

export const Account = () => {
    const userData: UserData = {
        email: 'usuario@ejemplo.com',
        name: 'Juan Pérez',
        username: 'juanperez123'
    };

    const { user } = useUserContext()
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
            </Box>

            <div className="p-6 space-y-6">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
                    <p className="mt-1 text-lg text-gray-900">{user}</p>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-500">Nombre de Usuario</h3>
                    <p className="mt-1 text-lg text-gray-900">{userData.username}</p>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-500">Correo Electrónico</h3>
                    <p className="mt-1 text-lg text-gray-900">{userData.email}</p>
                </div>
            </div>
        </Box>

    );
};