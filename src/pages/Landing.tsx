import React, { useEffect, useState } from "react";

export const Landing = () => {
  const [logged, setLogged] = useState(false)

  useEffect(() => {

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("username");

    if (token && user) {
      setLogged(true)
    }
  }, []);
  return (
    <>
      <div className="bg-gray-100 min-h-screen" style={{
        backgroundImage: "url('src/data/img//background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "repeat"
      }}>

        {/* Navbar */}
        <nav className="bg-purple-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <span className="text-xl font-bold font-mono">Data Glifos</span>
            <div className="space-x-4">
              <a href="/guide" className="hover:text-purple-200 cursor-pointer font-bold">Guía</a>

              {!logged && (
                <a href="/auth/login" className="hover:text-purple-200 cursor-pointer font-bold">Iniciar Sesión</a>
              )}
              {logged && (
                <a href="/user/" className="hover:text-purple-200 cursor-pointer font-bold">Inicio</a>
              )}
            </div>
          </div>
        </nav>

        <main className="container mx-auto m-4 lg:m-10 p-0">
          <div className="flex flex-col lg:flex-row items-center lg:justify-between h-full mt-4">

            {/* Izquierda */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold font-mono text-[#0d0922] mb-8">
                Data Glifos
              </h1>
              <h3 className="text-xl font-bold font-mono text-gray-800 mb-2">
                Convierte tus datos en visualizaciones 3D interactivas
              </h3>
              <p className="text-[#323232] mb-6 text-xl sm:text-lg font-mono">
                Carga tu archivo CSV y explora patrones de datos con glifos en un entorno tridimensional.
              </p>

              <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 mt-8">
                <a
                  href="/auth/login"
                  className="bg-purple-600 text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold 
                 hover:bg-purple-700 transition duration-300 shadow-lg hover:shadow-xl mx-4"
                >
                  Probar
                </a>
                <a
                  href="/guide"
                  className="bg-purple-600 text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold 
                 hover:bg-purple-700 transition duration-300 shadow-lg hover:shadow-xl mx-4"
                >
                  ¿Cómo usar?
                </a>
              </div>
            </div>

            {/* Derecha */}
            <div className="w-full lg:w-1/2 flex justify-center my-4 lg:mt-0">
              <div className="overflow-hidden shadow-xl">
                <img
                  src="src/data/img/glifo.png"
                  alt="Uso de la app"
                  className="w-full max-w-sm sm:max-w-md lg:max-w-lg object-cover"
                />
              </div>
            </div>
          </div>
        </main>

      </div>
    </>
  )
}
