import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Mi Sitio
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:text-gray-300">
              Inicio
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-gray-300">
              Acerca de
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-gray-300">
              Contacto
            </Link>
          </li>
          <li>
            <Link href="/login" className="hover:text-gray-300">
              Iniciar Sesión
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

