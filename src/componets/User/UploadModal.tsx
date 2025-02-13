import React, { useState } from "react";
import { uploadFile } from "../../services/User/Home";
import { CSVFile } from "../../services/User/csv_types";

interface UploadModalProps {
    token: string | null;
    onClose: () => void;
    onFileUploaded: (newFile: CSVFile) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ token, onClose, onFileUploaded }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert("Por favor selecciona un archivo.");

        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("file", file);

        try {
            const newFile = await uploadFile(token, formData);
            onFileUploaded(newFile);
            onClose();
        } catch (err) {
            alert("Error al subir archivo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4 font-mono">Subir Archivo</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <textarea
                        placeholder="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        required
                        className="w-full p-2 border border-gray-300 rounded cursor-pointer"
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                        >
                            {loading ? "Subiendo..." : "Subir"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadModal;
