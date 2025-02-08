import React from "react";

export const Landing = () => {

  return (
    <>
      <div className="bg-gradient-to-b from-gray-100 to-purple-100">
        {/* Navbar */}
        <nav className="bg-purple-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <span className="text-xl font-bold">Data Glifos</span>
            <div className="space-x-4">
              <a href="/auth/login" className="hover:text-purple-200 cursor-pointer">Iniciar Sesión</a>
              <a href="/app.html" className="hover:text-purple-200 cursor-pointer">Inicio</a>
              {/* <a href="#" className="hover:text-purple-200">Contacto</a> */}
            </div>
          </div>
        </nav>

        {/* Main Content Section */}
        <main className="container mx-auto px-8" style={{ height: 'calc(100vh - 64px)' }}>
          <div className="h-full flex items-center">
            {/* Left Content */}
            <div className="flex-1 pr-8">
              <div className="max-w-xl">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">
                  Bienvenido a nuestro Visor
                </h1>
                <p className="text-gray-600 mb-8 text-lg">
                  Explora y analiza datos de manera intuitiva con nuestra herramienta de visualización.
                  Usa archivos de tipo CSV.
                </p>
                <a
                  href="/app.html"
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold 
                         hover:bg-purple-700 transition-colors duration-300 
                         shadow-lg hover:shadow-xl cursor-pointer inline-block"
                >
                  Probar
                </a>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="flex-1 flex items-center justify-center">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img
                  src="src/data/img/ejecutandose.jpeg"
                  alt="Uso de la app"
                  className="w-full h-auto max-w-lg object-cover"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
