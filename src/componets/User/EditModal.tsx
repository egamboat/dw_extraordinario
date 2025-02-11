import React, { useState, useEffect } from "react";
import { updateFile } from "../../services/User/Home";
import { CSVFile } from "../../services/User/csv_types";

interface EditModalProps {

    token: string | null;
    onClose: () => void;
    onFileUpdate: (newFile: CSVFile) => void;
    file: CSVFile | null;
}

const EditModal: React.FC<EditModalProps> = ({ token, onClose, onFileUpdate, file }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    // Cargar datos del archivo si estamos editando
    useEffect(() => {
        if (file) {
            setName(file.name);
            setDescription(file.description || "");
        } else {
            setName("");
            setDescription("");
        }
    }, [file]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);

        if (selectedFile) {
            formData.append("file", selectedFile);
        }
        try {
            const updatedFile = await updateFile(token, formData, file.id);
            onFileUpdate(updatedFile);
            onClose();
        } catch (err) {
            alert("Error al actualizar archivo");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">
                    {file ? "Editar Archivo" : "Subir Archivo"}
                </h2>
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
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="w-full p-2 border border-gray-300 rounded cursor-pointer"
                    />
                    <p className="italic font-medium">Si sube un archivo nuevo se reemplazará el anterior.</p>
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
                            {loading ? "Guardando..." : file ? "Guardar Cambios" : "Subir"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal;
