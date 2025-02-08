import React, { useEffect, useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react';
import { newPassword } from '../../services/Auth/AuthServices';
import { useParams, useNavigate  } from 'react-router-dom';
import { toast } from 'react-toastify';


export const NewPassword = () => {
    const { token } = useParams();
    const navigate= useNavigate();

    const [formData, setFormData] = useState({
        token: '',
        new_password: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (token) {
            setFormData((prev) => ({ ...prev, token }));
        }
    }, [token]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log(formData)
        try {
            await newPassword(formData);
            toast.success("Contraseña actualizada con éxito.");

            setTimeout(() => navigate("/auth/login"), 1500);

        } catch (err) {
            console.log("Ocurrio un error: ", err)
        }
    };

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="flex h-screen">

            <div className="w-full flex items-center justify-center px-6 lg:px-16">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-8 text-gray-800">Establecer Contraseña</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="space-y-2">
                            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                                Nueva Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "new_password"}
                                    id="new_password"
                                    name="new_password"
                                    value={formData.new_password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                        >
                            Actualizar Contraseña
                        </button>
                    </form>

                    <p className="mt-4 text-sm text-gray-500 mb-4">
                        El enlace enviado al correo electrónico tiene una duración de 10 minutos desde el momento de su envío.
                    </p>

                </div>
            </div>
        </div>
    )
}
