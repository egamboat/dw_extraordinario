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
import { CSVFile } from '../../services/User/types';
import { toast } from 'react-toastify';
import UploadModal from '../../componets/User/UploadModal';
import EditModal from '../../componets/User/EditCsvModal';
import { DownloadCloudIcon } from 'lucide-react';
import CSVModal from '../../componets/User/InfoCsvModal';
import { analyzeCSV } from '../../services/User/helpers/csv_analizer';


export const HomeDashboard = () => {
    const { token } = useUserContext()
    const [files, setFiles] = useState<CSVFile[]>([]);
    const [file, setFile] = useState<CSVFile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalCSV, setShowModalCSV] = useState(false);
    const [csvInfo, setCsvInfo] = useState<any>(null);

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
            localStorage.setItem("csv_name", data.name);

            const analyzedData = await analyzeCSV(data.file);
            if (analyzedData) {
                setFile(data);
                setCsvInfo(analyzedData);
                setShowModalCSV(true);
            } else {
                toast.error("Error al analizar el CSV.");
            }
        } catch {
            toast.error("Ocurrió un error al cargar el archivo, inténtelo de nuevo.")
        }
    };

    const handleConfirm = () => {
        setShowModalCSV(false);
        toast.warning("El archivo se abrirá en una nueva pestaña.");
        window.open("/app.html", "_blank");
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
        link.setAttribute('download', '');
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
                                        {loading ? "Cargando..." : "Actualmente no cuenta con archivos disponibles, puede probar a subir uno."}
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

            {file && csvInfo && (
                <Modal open={showModalCSV} onClose={() => setShowModalCSV(false)}>
                    <Box sx={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, p: 4, borderRadius: 2,
                    }}>
                        <CSVModal
                            isOpen={showModalCSV}
                            onClose={() => setShowModalCSV(false)}
                            onConfirm={handleConfirm}
                            fileName={file.name}
                            description={file.description}
                            rowCount={csvInfo.rowCount}
                            columns={csvInfo.columns}
                            previewRows={csvInfo.previewRows}
                        />
                    </Box>
                </Modal>

            )}
        </>
    );
};