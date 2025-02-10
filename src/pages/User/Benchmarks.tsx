import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Typography, Box } from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon
} from '@mui/icons-material';

export const Benchmarks = () => {

  const files: any = [
    // { id: 1, name: "documento1.pdf", date: "2024-02-09" },
    // { id: 2, name: "imagen.jpg", date: "2024-02-08" },
    // { id: 3, name: "reporte.xlsx", date: "2024-02-07" }
  ];

  const handleDelete = (id: number) => {
    console.log('Borrar archivo:', id);
  };

  const handleEdit = (id: number) => {
    console.log('Editar archivo:', id);
  };

  const handleOpen = (id: number) => {
    console.log('Abrir archivo:', id);
  };

  const handleAddFile = () => {
    console.log('HAcer un benchmark');
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
          Benchmarks: Resultados
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddFile}
        >
          Hacer BenchMark
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
                  Actualmente no cuenta con archivos disponibles, puede probar a subir uno.
                </TableCell>
              </TableRow>
            ) : (
              files.map((file: any) => (
                <TableRow key={file.id}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{new Date(file.date).toLocaleDateString()}</TableCell>
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
  );
}
