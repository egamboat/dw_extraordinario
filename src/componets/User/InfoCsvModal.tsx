import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    fileName: string;
    description: string;
    rowCount: number;
    columns: string[];
    previewRows: string[][];
}

const CSVModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    fileName,
    description,
    rowCount,
    columns,
    previewRows
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 p-4">

            <div className="bg-white p-6 rounded-lg shadow-lg w-[550px]">
                <h2 className="text-lg font-bold mb-2 font-mono">Detalles del Archivo</h2>
                <p>
                    <strong className="font-mono">Nombre:</strong> {fileName}
                </p>
                <p>
                    <strong className="font-mono">Descripción:</strong> {description}
                </p>
                <p>
                    <strong className="font-mono">Filas:</strong> {rowCount}
                </p>
                <p>
                    <strong className="font-mono">Columnas:</strong> {columns.join(", ")}
                </p>
                <h3 className="font-semibold mt-3 font-mono">Vista previa:</h3>

                <div className="border border-gray-300 p-2 max-h-32 overflow-auto">
                    <pre className="text-xs">{previewRows.map(row => row.join(", ")).join("\n")}</pre>
                </div>
                <div className="mt-4 flex justify-between">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer">
                        Cerrar
                    </button>

                    {onConfirm !== undefined && (
                        <button onClick={onConfirm} className="px-4 py-2 bg-purple-500 text-white rounded cursor-pointer">
                            Ir al Visor
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CSVModal;
