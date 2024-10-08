import { Link, useNavigate  } from "react-router-dom";
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { UseAuth } from "../context/authContext";
import { useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = UseAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <header className="bg-gray-800 text-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-lg md:text-2xl font-bold">
          <Link to="/" className="hover:text-blue-300 transition duration-300">
            Nexus Investimentos
          </Link>
        </div>

        <div className="relative md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
            {/* Ícone de menu hamburguer */}
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
              <nav className="flex flex-col">
                <Link to="/favorites" className="px-4 py-2 hover:text-blue-300 transition duration-300">Favorites</Link>
                <Link to="/conversion-history" className="px-4 py-2 hover:text-blue-300 transition duration-300">Conversion History</Link>
                {!isLoggedIn ? (
                  <Link to="/login" className="px-4 py-2 hover:underline">Sign in</Link>
                ) : (
                  <button onClick={handleLogout} className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-500 text-white rounded-md px-3 py-1">
                    <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
                    <span>Sair</span>
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/favorites" className="hover:text-blue-300 transition duration-300">Favorites</Link>
          <Link to="/conversion-history" className="hover:text-blue-300 transition duration-300">Conversion History</Link>
          {!isLoggedIn ? (
            <Link to="/login" className="hover:underline">Sign in</Link>
          ) : (
            <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-600 hover:bg-red-500 text-white rounded-md px-3 py-1">
              <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
              <span>Sair</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
