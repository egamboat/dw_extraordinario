// const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

// export const LoadFiles = async ({ token }: string): Promise<any> => {
//     try {
//         const response = await fetch(`${API_BASE_URL}api/csv_files/`, {
//             method: "GET",
//             headers: {
//                 "Authorization": `Token ${token}`,
//                 "Content-Type": "application/json",
//             },
//         });

//         if (!response.ok) {
//             throw new Error("Ocurrió un error al establecer la nueva contraseña.");
//         }

//         return await response.json();
//     } catch (error) {
//         throw new Error(error instanceof Error ? error.message : "Error de conexión");
//     }
// };
