import { UserData } from "./types";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

export const fetchUserData = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch(`${API_BASE_URL}users/details/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario');
        }

        const data = await response.json();
        return data;

    } catch (error: any) {
        console.error("Error en fetchUserData:", error.message);
        throw error;
    }
};

export const updateUserData = async (updatedData: Partial<UserData>) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch(`${API_BASE_URL}users/update/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar los datos del usuario');
        }

        return await response.json();
    } catch (error: any) {
        console.error("Error en updateUserData:", error.message);
        throw error;
    }
};
