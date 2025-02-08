import React, { useState } from "react";
import { toast } from 'react-toastify';
import { resetPassword } from "../../services/Auth/AuthServices";

interface ResetPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose }) => {

    const [email, setEmail] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Por favor ingresa un correo válido.");
            return;
        }

        try {
            await resetPassword({ email });
            toast.success("Se envió el correo de manera correcta.");
            onClose();
        } catch (err:any) {

            const errorMessage = err.message || "Error al enviar el correo.";
            toast.error(errorMessage);
            console.error("Ocurrió un error:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Restablecer Contraseña</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Ingresa tu correo electrónico para recibir un enlace de recuperación, en el enlace podrás ingresar y colocar tu nueva contraseña.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer"
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordModal;
