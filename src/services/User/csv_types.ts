export interface CSVFile {
    id: number;
    user: number;
    name: string;
    description: string;
    file: string; // URL del archivo
    uploaded_at: string;
}