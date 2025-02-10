import React from 'react'

interface NavbarPublicProps {
  logged: boolean;
  onLanding: boolean;
}

export const NavbarPublic: React.FC<NavbarPublicProps> = ({ logged, onLanding }) => {
  return (
    <>
      <nav className="bg-purple-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-xl font-bold font-mono">Data Glifos</span>
          <div className="space-x-4">
            {onLanding && (
              <a href="/guide" className="hover:text-purple-200 cursor-pointer font-bold">Guía</a>
            )}

            {!logged && (
              <a href="/auth/login" className="hover:text-purple-200 cursor-pointer font-bold">Iniciar Sesión</a>
            )}
            {logged && (
              <a href="/user/" className="hover:text-purple-200 cursor-pointer font-bold">Inicio</a>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
