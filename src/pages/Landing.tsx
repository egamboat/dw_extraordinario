import React from "react";
import { useNavigate } from "react-router-dom";

export const Landing = () => {

  const navigate = useNavigate()

  const goToInicio = () => {
    navigate('/inicio', {
      replace: false,
    })
  }

  return (
    <>
      <div className="bg-gradient-to-b from-gray-100 to-purple-100">
        {/* Navbar */}
        <nav className="bg-purple-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <span className="text-xl font-bold">Data Glifos</span>
            <div className="space-x-4">
              <button onClick={goToInicio} className="hover:text-purple-200 cursor-pointer">Inicio</button>
              {/* <a href="#" className="hover:text-purple-200">Contacto</a> */}
            </div>
          </div>
        </nav>

        {/* Main Content Section */}
        <main className="container mx-auto px-8" style={{ height: 'calc(100vh - 64px)' }}>
          <div className="h-full flex flex-col justify-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold text-gray-800 mb-8">
                Bienvenido a nuestro Visor
              </h1>
              <button
                className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                onClick={goToInicio}
              >
                Ir al Visor
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
