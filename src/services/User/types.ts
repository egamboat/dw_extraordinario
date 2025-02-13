export interface CSVFile {
    id: number;
    user: number;
    name: string;
    description: string;
    file: string; // URL del archivo
    uploaded_at: string;
}

export interface CSVInfo {
    columns: string[];
    rowCount: number;
    previewRows: string[][];
}

export interface UserData {
    email: string;
    first_name: string;
    last_name: string;
    username: string;
}

export interface BenchmarkReport {
    id: number;
    user: number;
    name: string;
    description: string;
    benchmark_file: string; // URL del archivo
    generated_at: string;
}
