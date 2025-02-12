import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Typography, Box, Modal } from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { deleteFile, loadFiles, loadFile } from '../../services/User/Home';
import { useUserContext } from '../../services/User/context/UserContext';
import { CSVFile } from '../../services/User/csv_types';
import { toast } from 'react-toastify';
import UploadModal from '../../componets/User/UploadModal';
import EditModal from '../../componets/User/EditModal';
import { DownloadCloudIcon } from 'lucide-react';


export const HomeDashboard = () => {
    const { token } = useUserContext()
    const [files, setFiles] = useState<CSVFile[]>([]);
    const [file, setFile] = useState<CSVFile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);

    const fetchFiles = async () => {
        try {
            const data = await loadFiles(token);
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


    const handleEdit = async (fileId: number) => {
        console.log('Editar archivo:', fileId);
        try {
            const data: CSVFile = await loadFile(token, fileId);
            setFile(data);
            setShowModalEdit(true);
        } catch {
            toast.error("Ocurrió un error al cargar el archivo, inténtelo de nuevo.")
        }
    };

    const handleOpen = async (fileId: number) => {
        try {
            const data: CSVFile = await loadFile(token, fileId);
            localStorage.setItem("csv_url", data.file);
            toast.warning("El archivo se abrirá en una nueva pestaña.")

            window.open("/app.html", "_blank");
        } catch {
            toast.error("Ocurrió un error al cargar el archivo, inténtelo de nuevo.")
        }
    };

    const handleFileUploaded = (newFile: CSVFile) => {
        setFiles([...files, newFile]);
        toast.success("Archivo subido correctamente.");
    };

    const handleFileUpdated = (updatedFile: CSVFile) => {
        setFiles(files.map(f => (f.id === updatedFile.id ? updatedFile : f)));
        toast.success("Archivo actualizado correctamente.");
    };

    const handleDownload = (fileUrl: string) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', ''); // Esto sugiere la descarga sin cambiar el nombre
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        fetchFiles();
    }, [])
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
                        onClick={() => setShowModalCreate(true)}
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
                                    Fecha Subida
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
                                            <Tooltip title={file.file}>
                                                <IconButton onClick={() => handleDownload(file.file)} sx={{ color: 'green' }}>
                                                    <DownloadCloudIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Modal open={showModalCreate} onClose={() => setShowModalCreate(false)}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, p: 4, borderRadius: 2,
                }}>
                    <UploadModal
                        token={token}
                        onClose={() => { setShowModalCreate(false) }}
                        onFileUploaded={handleFileUploaded}
                    />
                </Box>
            </Modal>

            <Modal open={showModalEdit} onClose={() => setShowModalEdit(false)}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, p: 4, borderRadius: 2,
                }}>
                    <EditModal
                        token={token}
                        onClose={() => {
                            setShowModalEdit(false); setFile(null)
                        }}
                        onFileUpdate={handleFileUpdated}
                        file={file}
                    />
                </Box>
            </Modal>
        </>
    );
};