import React, { useState } from 'react'
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { loginUser } from '../../services/Auth/AuthServices';
import ResetPasswordModal from '../../componets/Auth/RessetPassModal';
import { useNavigate } from 'react-router-dom';

export const Login = () => {

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showModalResset, setShowModalResset] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const data = await loginUser(formData);

            setTimeout(() => navigate("/user"), 1500);

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
            {/* Sección del formulario - lado izquierdo */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-16">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-8 text-gray-800">Iniciar Sesión</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                {/* Correo Electrónico */}
                                Usuario
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="username"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nombre de Usuario"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
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
                        <div className="flex items-center justify-between">
                            {/*

                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Recordarme
                                </label>
                            </div>
                        */}

                            <button onClick={() => setShowModalResset(true)} className="text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer ">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Iniciar Sesión
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        ¿No tienes una cuenta?{' '}
                        <a href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
                            Regístrate
                        </a>
                    </p>
                </div>
            </div>

            {/* Sección de imagen - lado derecho */}
            <div className="hidden lg:block lg:w-1/2">
                <img
                    src="src/data/img/ejecutandose2.jpeg"
                    alt="Login"
                    className="w-full h-full object-cover"
                />
            </div>
            <ResetPasswordModal isOpen={showModalResset} onClose={() => setShowModalResset(false)} />
        </div>
    )
}
