import { useState, useEffect } from 'react';
import axios from 'axios';

interface ConversionHistory {
  cryptocurrencyId: string;
  amount: number;
  convertedBrl: number;
  convertedUsd: number;
  priceInBrl: number;
  priceInUsd: number;
  createdAt: string;
}

const History = () => {
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Você precisa estar logado para ver seu histórico.');
          setIsLoading(false);
          return;
        }

        const response = await axios.get<ConversionHistory[]>(
          'https://backendnexus-026855c96a67.herokuapp.com/conversion/history',
          {
            headers: {
              Authorization: `Bearer ${token}`, // Inclui o token no header da requisição
            },
          }
        );

        setHistory(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('Erro ao buscar histórico:', error);
        setError(error.response?.data?.message || 'Erro ao buscar o histórico.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    } catch (error) {
      return 'Data inválida' + error;
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Histórico de Conversões</h1>

      {isLoading && (
        <p className="text-lg text-blue-500">Carregando...</p>
      )}

      {error && (
        <p className="text-red-500 text-lg">{error}</p>
      )}

      {!isLoading && !error && history.length === 0 && (
        <p className="text-lg text-gray-500">Você não tem nenhum histórico de conversão ainda.</p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 max-w-5xl w-full">
        {history.map((conversion, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md transition duration-300 hover:shadow-xl transform hover:scale-105"
          >
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Conversão #{index + 1}</h2>
            <p className="text-gray-700">
              <span className="font-semibold">Criptomoeda ID:</span> {conversion.cryptocurrencyId}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Quantidade:</span> {conversion.amount}
            </p>
            <p className="text-green-600 font-semibold">
              <span className="font-semibold">Convertido em BRL:</span> R$ {conversion.convertedBrl}
            </p>
            <p className="text-blue-600 font-semibold">
              <span className="font-semibold">Convertido em USD:</span> $ {conversion.convertedUsd}
            </p>
            <div className="border-t border-gray-300 mt-4 pt-4">
              <p className="text-gray-500">
                <span className="font-semibold">Preço em BRL:</span> R$ {conversion.priceInBrl}
              </p>
              <p className="text-gray-500">
                <span className="font-semibold">Preço em USD:</span> $ {conversion.priceInUsd}
              </p>
              <p className="text-gray-500 mt-2">
                <span className="font-semibold">Data da Conversão:</span> {formatDate(conversion.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
