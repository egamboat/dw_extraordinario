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
            throw new Error(data.message || "Error en el registro");
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
            throw new Error("Credenciales incorrectas");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        return data;
    } catch (error: any) {
        throw new Error(error.message || "Error de conexión");
    }
};