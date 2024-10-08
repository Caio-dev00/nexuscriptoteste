import { useState, useEffect } from 'react';
import axios from 'axios';

interface Favorite {
  _id: string;
  cryptocurrencyId: string;
  user: string;
  name: string;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Você precisa estar logado para ver seus favoritos.');
          return;
        }

        const response = await axios.get<Favorite[]>('https://backendnexus-026855c96a67.herokuapp.com/favorites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFavorites(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('Erro ao buscar favoritos:', error);
        setError(error.response?.data?.message || 'Erro ao carregar favoritos.');
      }
    };

    fetchFavorites();
  }, []);

  const handleDeleteFavorite = async (favoriteId: string) => {
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Você precisa estar logado para remover um favorito.');
      return;
    }

    try {
      // Aqui você vai passar o userId também se precisar no backend
      const userId = JSON.parse(atob(token.split('.')[1])).id;

      await axios.delete('https://backendnexus-026855c96a67.herokuapp.com/favorites/delete', {
        data: { userId, favoriteId },
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Favorito removido com sucesso!');
      // Atualiza a lista de favoritos após a remoção
      setFavorites((prevFavorites) => prevFavorites.filter(favorite => favorite._id !== favoriteId));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Erro ao remover favorito:', error);
      setError(error.response?.data?.message || 'Erro ao remover favorito.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Criptomoedas Favoritas</h1>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {favorites.length === 0 ? (
        <p className="text-gray-600">Nenhuma criptomoeda favorita encontrada.</p>
      ) : (
        <ul className="bg-white p-4 rounded-lg shadow-md max-w-md w-full">
          {favorites.map((favorite) => (
            <li key={favorite._id} className="p-2 border-b border-gray-200 flex justify-between items-center">
              <span className="font-semibold">{favorite.name}</span>
              <button
                onClick={() => handleDeleteFavorite(favorite._id)}
                className="ml-4 p-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
