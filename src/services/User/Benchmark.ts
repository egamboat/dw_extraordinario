import { BenchmarkReport } from "./types";
const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

export const loadBenchmarkReports = async (token: string | null): Promise<BenchmarkReport[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}api/benchmark-reports/`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json(); // Retorna un array con los benchmarks
    } catch (error) {
        console.error("Error al cargar los benchmarks:", error);
        throw new Error(error instanceof Error ? error.message : "Error de conexión");
    }
};

export const deleteFileBench = async (token: string | null, fileId: number): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}api/benchmark-reports/${fileId}/`, {
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