const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

export const registerUser = async (userData: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}users/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.detail || data.message || "Error en el registro";
            throw new Error(errorMessage);
        }

        return data;
    } catch (error: any) {
        throw new Error(error.message || "Error de conexión");
    }
};


export const loginUser = async (userData: { username: string; password: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}users/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });


        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Credenciales incorrectas");
        }

        const data = await response.json();
        localStorage.setItem("username", data.username);
        localStorage.setItem("token", data.token);
        return data;
    } catch (error: any) {
        throw new Error(error.message || "Error de conexión");
    }
};

export const resetPassword = async (userData: { email: string }): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE_URL}users/password-reset/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error("No se encontró el correo electrónico o está incorrecto.");
        }

        return await response.json();
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Error de conexión");
    }
};


export const newPassword = async (userData: { token: string; new_password: string }): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE_URL}users/password-reset/confirm/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error("Ocurrió un error al establecer la nueva contraseña.");
        }

        return await response.json();
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Error de conexión");
    }
};

export const logoutUser = async () => {
    try {
        const token = localStorage.getItem("token"); // Obtener el token almacenado

        if (!token) {
            throw new Error("No hay usuario autenticado");
        }

        const response = await fetch(`${API_BASE_URL}users/logout/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            },
        });

        if (!response.ok) {
            throw new Error("Error al cerrar sesión");
        }

        localStorage.clear();

        return { message: "Sesión cerrada exitosamente" };
    } catch (error: any) {
        throw new Error(error.message || "Error al cerrar sesión");
    }
};
