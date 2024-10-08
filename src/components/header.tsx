import { Link, useNavigate  } from "react-router-dom";
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { UseAuth } from "../context/authContext";

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = UseAuth()

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <header className="bg-gray-800 text-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-blue-300 transition duration-300">
            Nexus Investimentos
          </Link>
        </div>

        <nav className="flex items-center space-x-6">
          <Link
            to="/favorites"
            className="hover:text-blue-300 transition duration-300"
          >
            Favorites
          </Link>
          <Link
            to="/conversion-history"
            className="hover:text-blue-300 transition duration-300"
          >
            Conversion History
          </Link>
          {!isLoggedIn ? (
          <>
            <Link to="/login" className="hover:underline">Sign in</Link>
          </>
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
