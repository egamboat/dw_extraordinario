import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Typography, Box, Modal } from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    Add as AddIcon
} from '@mui/icons-material';

import { deleteFile, LoadFiles } from '../../services/User/Home';
import { useUserContext } from '../../services/User/context/UserContext';
import { CSVFile } from '../../services/User/csv_types';
import { toast } from 'react-toastify';
import UploadModal from '../../componets/User/UploadModal';


export const HomeDashboard = () => {
    const { token } = useUserContext()
    const [files, setFiles] = useState<CSVFile[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const fetchFiles = async () => {
        try {
            const data = await LoadFiles(token);
            setFiles(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (fileId: number) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este archivo?")) return;

        try {
            await deleteFile(token, fileId);
            setFiles(files.filter(file => file.id !== fileId));
        } catch (error) {
            console.error("Error eliminando archivo:", error);
            toast.error("No se pudo eliminar el archivo.");
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [])

    const handleEdit = (id: number) => {
        console.log('Editar archivo:', id);
    };

    const handleOpen = (id: number) => {
        console.log('Abrir archivo:', id);
    };

    const handleFileUploaded = (newFile: CSVFile) => {
        setFiles([...files, newFile]);
        toast.success("Archivo subido correctamente.");
    };

    return (
        <>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" sx={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '2rem',
                        color: '#1a365d',
                        letterSpacing: '0.1em',
                    }}>
                        Mis Archivos
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setShowModal(true)}
                        sx={{ backgroundColor: "#b77ee0" }}
                    >
                        Agregar Archivo
                    </Button>
                </Box>

                <TableContainer component={Paper} sx={{ mt: 5 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '1.1rem' }}>
                                    Nombre
                                </TableCell>

                                <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '1.1rem' }}>
                                    Fecha
                                </TableCell>

                                <TableCell align="center" sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '1.1rem' }}>
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {files.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ fontStyle: 'italic', color: 'gray', py: 3 }}>
                                        {loading ? "Actualmente no cuenta con archivos disponibles, puede probar a subir uno." : "Cargando..."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                files.map((file: any) => (
                                    <TableRow key={file.id}>
                                        <TableCell>{file.name}</TableCell>

                                        <TableCell>
                                            {new Date(file.uploaded_at).toLocaleDateString()} {new Date(file.uploaded_at).toLocaleTimeString()}
                                        </TableCell>

                                        <TableCell align="center">
                                            <IconButton color="primary" onClick={() => handleOpen(file.id)} title="Abrir">
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton color="primary" onClick={() => handleEdit(file.id)} title="Editar">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(file.id)} title="Eliminar">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 500,
                    p: 4,
                    borderRadius: 2,
                }}>
                    <UploadModal
                        token={token}
                        onClose={() => setShowModal(false)}
                        onFileUploaded={handleFileUploaded}
                    />
                </Box>
            </Modal>
        </>
    );
};