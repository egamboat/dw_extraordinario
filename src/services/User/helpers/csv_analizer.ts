import { CSVInfo } from "../csv_types";

export const analyzeCSV = async (fileUrl: string): Promise<CSVInfo | null> => {
    try {
        const response = await fetch(fileUrl);
        const text = await response.text();

        const rows = text.split("\n");
        const headers = rows[0]?.split(",") || [];
        const rowCount = rows.length - 1; // Excluye la cabecera

        return {
            columns: headers,
            rowCount,
            previewRows: rows.slice(1, 6).map(row => row.split(",")) // Vista previa de 5 filas
        };
    } catch (error) {
        console.error("Error al analizar el CSV:", error);
        return null;
    }
};
