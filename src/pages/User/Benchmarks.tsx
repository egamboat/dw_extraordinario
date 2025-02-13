import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Typography, Box, Tooltip, Modal, Alert } from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BenchmarkReport } from '../../services/User/types';
import { deleteFileBench, loadBenchmarkReports } from '../../services/User/Benchmark';
import { useUserContext } from '../../services/User/context/UserContext';
import { toast } from 'react-toastify';
import { DownloadCloudIcon } from 'lucide-react';
import { analyzeCSV } from '../../services/User/helpers/csv_analizer';
import CSVModal from '../../componets/User/InfoCsvModal';

export const Benchmarks = () => {
  const navigate = useNavigate()
  const { token } = useUserContext()
  const [files, setFiles] = useState<BenchmarkReport[]>([]);
  const [file, setFile] = useState<BenchmarkReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [csvInfo, setCsvInfo] = useState<any>(null);
  const [showModalCSV, setShowModalCSV] = useState(false);

  const fetchFiles = async () => {
    try {
      const data = await loadBenchmarkReports(token);
      setFiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId: number) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este Benchmark")) return;

    try {
      await deleteFileBench(token, fileId);
      setFiles(files.filter(file => file.id !== fileId));
    } catch (error) {
      console.error("Error eliminando archivo:", error);
      toast.error("No se pudo eliminar el archivo.");
    }
  };

  const handleOpen = async (fileId: number) => {
    try {

      const selectedFile = files.find(file => file.id === fileId);
      if (!selectedFile) {
        toast.error("No se encontró el archivo seleccionado.");
        return;
      }

      // Analizar el CSV usando la URL del archivo
      const analyzedData = await analyzeCSV(selectedFile.benchmark_file);
      if (analyzedData) {
        setFile(selectedFile);
        setCsvInfo(analyzedData);
        setShowModalCSV(true);
      } else {
        toast.error("Error al analizar el CSV.");
      }
    } catch {
      toast.error("Ocurrió un error al cargar el archivo, inténtelo de nuevo.")
    }
  };


  const handleDownload = (fileUrl: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddFile = () => {
    navigate('/user/')
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
            Benchmarks: Resultados
          </Typography>

          <Button
            variant="contained"
            sx={{ backgroundColor: "#b77ee0" }}
            startIcon={<AddIcon />}
            onClick={handleAddFile}
          >
            Hacer BenchMark
          </Button>
        </Box>

        <Alert severity="warning" sx={{ mb: 2 }}>
          Para hacer Benchmarks del rendimiento de tu máquina, deberás entrar a un archivo y presionar -Benchmark- el control de interfaz.
        </Alert>

        <TableContainer component={Paper} sx={{ mt: 5 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '1.1rem' }}>
                  Nombre
                </TableCell>

                <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '1.1rem' }}>
                  Fecha Generado
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
                    Para realizar BenchMarks debes dirigirte a archivos y seleccionar el que desees.
                  </TableCell>
                </TableRow>
              ) : (
                files.map((file: any) => (
                  <TableRow key={file.id}>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>
                      {new Date(file.generated_at).toLocaleDateString()} {new Date(file.generated_at).toLocaleTimeString()}
                    </TableCell>

                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpen(file.id)} title="Abrir">
                        <VisibilityIcon />
                      </IconButton>
                      <Tooltip title={file.benchmark_file}>
                        <IconButton onClick={() => handleDownload(file.benchmark_file)} sx={{ color: 'green' }}>
                          <DownloadCloudIcon />
                        </IconButton>
                      </Tooltip>
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
      {file && csvInfo && (
        <Modal open={showModalCSV} onClose={() => setShowModalCSV(false)}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, p: 4, borderRadius: 2,
          }}>
            <CSVModal
              isOpen={showModalCSV}
              onClose={() => setShowModalCSV(false)}
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
}
