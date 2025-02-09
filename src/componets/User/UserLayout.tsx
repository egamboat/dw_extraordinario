import React, { useState } from 'react';
import { Menu, X, Home, TestTubesIcon, Users, LogOut } from 'lucide-react';

const UserLayout = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { title: 'Inicio', icon: <Home size={20} />, path: '/user/' },
    { title: 'Benchmarks', icon: <TestTubesIcon size={20} />, path: '/user/results' },
    { title: 'Cuenta', icon: <Users size={20} />, path: '/#' },
  ];

  const handleLogout = () => {
    // Aquí puedes agregar la lógica de logout
    console.log('Cerrando sesión...');
  };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30
          w-64 h-full bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 
          flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header del Sidebar */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Data Glifos</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md lg:hidden hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menú de navegación */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className="flex items-center gap-4 p-2 text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                >
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Botón de Logout */}
        <div className="border-t p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-2 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 h-full overflow-auto">
        {/* Header móvil */}
        <header className="sticky top-0 bg-white shadow-sm lg:hidden">
          <div className="flex items-center p-4">
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;