import { CSVFile } from "./types";
const API_BASE_URL = import.meta.env.VITE_APP_API_URL;


export const uploadFile = async (token: string | null, formData: FormData): Promise<CSVFile> => {
    try {
        const response = await fetch(`${API_BASE_URL}api/csv_files/`, {
            method: "POST",
            headers: {
                "Authorization": `Token ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json(); // Retorna el archivo creado
    } catch (error) {
        console.error("Error al subir archivo:", error);
        throw new Error(error instanceof Error ? error.message : "Error de conexión");
    }
};


export const loadFiles = async (token: string | null): Promise<CSVFile[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}api/csv_files/`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json(); // Retorna un array
    } catch (error) {
        console.error("Error al cargar archivos:", error);
        throw new Error(error instanceof Error ? error.message : "Error de conexión");
    }
};

export const deleteFile = async (token: string | null, fileId: number): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}api/csv_files/${fileId}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error al eliminar archivo:", error);
        throw new Error(error instanceof Error ? error.message : "Error de conexión");
    }
};

export const loadFile = async (token: string | null, fileId: number): Promise<CSVFile> => {
    try {
        const response = await fetch(`${API_BASE_URL}api/csv_files/${fileId}/`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json()
        console.log(data)
        return data;
    } catch (error) {
        console.error("Error al eliminar archivo:", error);
        throw new Error(error instanceof Error ? error.message : "Error de conexión");
    }
};


export const updateFile = async (token: string | null, formData: FormData, fileId: number | null): Promise<CSVFile> => {
    try {
        const response = await fetch(`${API_BASE_URL}api/csv_files/${fileId}/`, {
            method: "PATCH",
            headers: {
                "Authorization": `Token ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json(); // Retorna el archivo creado
    } catch (error) {
        console.error("Error al subir archivo:", error);
        throw new Error(error instanceof Error ? error.message : "Error de conexión");
    }
};