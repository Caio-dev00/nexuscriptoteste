import { useState, useEffect } from "react";
import axios from "axios";

interface Crypto {
  id: string;
  name: string;
}

interface ConversionResult {
  userId: string;
  cryptocurrencyId: string;
  amount: number;
  convertedBrl: number;
  convertedUsd: number;
  priceInBrl: number;
  priceInUsd: number;
}

interface Favorite {
  _id: string;
  cryptocurrencyId: string;
  user: string;
  name: string;
}

const CACHE_KEY = "cryptoList";
const CACHE_EXPIRATION = 60 * 60 * 1000;

const Conversion = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [conversionResult, setConversionResult] =
    useState<ConversionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const [favoriteSuccess, setFavoriteSuccess] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoadingCryptos, setIsLoadingCryptos] = useState(true);

  const getCachedCryptos = () => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_EXPIRATION) {
        return data;
      }
    }
    return null;
  };

  useEffect(() => {
    const cachedCryptos = getCachedCryptos();
    if (cachedCryptos) {
      setCryptos(cachedCryptos);
      setIsLoadingCryptos(false);
    } else {
      const fetchCryptos = async () => {
        try {
          setIsLoadingCryptos(true);
          const response = await axios.get(
            "https://api.coingecko.com/api/v3/coins/list"
          );
          setCryptos(response.data);
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ data: response.data, timestamp: Date.now() })
          );
        } catch (error) {
          console.error("Erro ao buscar criptomoedas", error);
          setError("Erro ao buscar criptomoedas.");
        } finally {
          setIsLoadingCryptos(false);
        }
      };
      fetchCryptos();
    }
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setFavoriteError(
            "Você precisa estar logado para ver seus favoritos."
          );
          return;
        }

        const response = await axios.get<Favorite[]>(
          "https://backendnexus-026855c96a67.herokuapp.com/favorites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFavorites(response.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Erro ao buscar favoritos:", error);
        setFavoriteError(
          error.response?.data?.message || "Erro ao carregar favoritos."
        );
      }
    };

    fetchFavorites();
  }, []);

  const isFavorite = (cryptoId: string) => {
    return favorites.some((favorite) => favorite.cryptocurrencyId === cryptoId);
  };

  const handleConversion = async () => {
    setError(null);
    setConversionResult(null);

    if (!selectedCrypto || !amount) {
      setError("Por favor, selecione uma criptomoeda e insira um valor.");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Por favor, insira um valor válido.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post<ConversionResult>(
        "https://backendnexus-026855c96a67.herokuapp.com/conversion/convert",
        {
          cryptocurrencyId: selectedCrypto,
          amount: numericAmount,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      setConversionResult(response.data);
      console.log("Resultado da conversão:", response.data);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro na conversão:", error);
      setError(error.response?.data?.message || "Erro no servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToFavorites = async () => {
    setFavoriteError(null);
    setFavoriteSuccess(null);

    if (!selectedCrypto) {
      setFavoriteError(
        "Por favor, selecione uma criptomoeda para adicionar aos favoritos."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setFavoriteError(
          "Você precisa estar logado para favoritar uma criptomoeda."
        );
        return;
      }

      const userId = JSON.parse(atob(token.split(".")[1])).id;

      const response = await axios.post(
        "https://backendnexus-026855c96a67.herokuapp.com/favorites/add",
        { cryptocurrencyId: selectedCrypto, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newFavorite = response.data;

      setFavoriteSuccess("Criptomoeda adicionada aos favoritos com sucesso!");
      setFavorites((prevFavorites) => [...prevFavorites, newFavorite]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao adicionar aos favoritos:", error);
      setFavoriteError(
        error.response?.data?.message || "Erro ao favoritar a criptomoeda."
      );
    }
  };

  const handleRemoveFromFavorites = async () => {
    setFavoriteError(null);
    setFavoriteSuccess(null);

    if (!selectedCrypto) {
      setFavoriteError(
        "Por favor, selecione uma criptomoeda para remover dos favoritos."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setFavoriteError(
          "Você precisa estar logado para remover uma criptomoeda dos favoritos."
        );
        return;
      }

      const userId = JSON.parse(atob(token.split(".")[1])).id;

      const favoriteToRemove = favorites.find(
        (favorite) => favorite.cryptocurrencyId === selectedCrypto
      );
      if (!favoriteToRemove) {
        setFavoriteError("Favorito não encontrado.");
        return;
      }

      await axios.delete(
        "https://backendnexus-026855c96a67.herokuapp.com/favorites/delete",
        {
          data: { userId, favoriteId: favoriteToRemove._id },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFavoriteSuccess("Criptomoeda removida dos favoritos com sucesso!");
      setFavorites((prevFavorites) =>
        prevFavorites.filter(
          (favorite) => favorite._id !== favoriteToRemove._id
        )
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao remover dos favoritos:", error);
      setFavoriteError(
        error.response?.data?.message ||
          "Erro ao remover a criptomoeda dos favoritos."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Conversão de Criptomoedas</h1>

      {isLoadingCryptos ? (
        <div className="loader">Carregando criptomoedas...</div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center mb-4">
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Selecione uma criptomoeda</option>
              {cryptos.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name}
                </option>
              ))}
            </select>

            {selectedCrypto && !isFavorite(selectedCrypto) && (
              <button
                onClick={handleAddToFavorites}
                className="ml-4 p-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition duration-300"
              >
                Favoritar
              </button>
            )}

            {selectedCrypto && isFavorite(selectedCrypto) && (
              <button
                onClick={handleRemoveFromFavorites}
                className="ml-4 p-2 bg-red-400 text-white rounded hover:bg-red-500 transition duration-300"
              >
                Desfavoritar
              </button>
            )}
          </div>

          {favoriteError && <p className="text-red-500">{favoriteError}</p>}
          {favoriteSuccess && (
            <p className="text-green-500">{favoriteSuccess}</p>
          )}

          <input
            type="number"
            placeholder="Quantidade"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full mb-4 p-2 border border-gray-300 rounded"
          />

          <button
            onClick={handleConversion}
            className={`w-full p-3 rounded-lg text-white ${
              isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
            } transition duration-300`}
            disabled={isLoading}
          >
            {isLoading ? "Convertendo..." : "Converter"}
          </button>

          {error && <p className="mt-4 text-red-500">{error}</p>}

          {conversionResult && (
            <div className="mt-6 p-4 bg-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold">Resultado da Conversão</h2>
              <p>Convertido em BRL: {conversionResult.convertedBrl}</p>
              <p>Convertido em USD: {conversionResult.convertedUsd}</p>
              <span>
                -------------------------------------------------------
              </span>
              <p>Preço em BRL: {conversionResult.priceInBrl}</p>
              <p>Preço em USD: {conversionResult.priceInUsd}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Conversion;
