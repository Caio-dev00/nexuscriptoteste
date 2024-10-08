import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../schema/validationSchema';
import Input from '../components/input';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { UseAuth } from '../context/authContext';

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = UseAuth()

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setApiError(null)
    try {
      const response = await axios.post('https://backendnexus-026855c96a67.herokuapp.com/users/login', data);
      const token = response.data.token
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        login(token);
        navigate('/');
        toast.success("login successfull!")
      } else {
        setApiError('Token não recebido'); 
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch(error: any) {
      if (error.response && error.response.data) {
        setApiError(error.response.data.message || 'Login error')
      } else {
        setApiError('Erro trying to connect to server')
      }
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="email"
            placeholder="Enter your email"
            name="email"
            register={register}
            error={errors.email?.message}
          />

          <Input
            type="password"
            placeholder="Enter your password"
            name="password"
            register={register}
            error={errors.password?.message}
          />

          {apiError && <p className="text-red-500">{apiError}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 mt-4"
          >
            {isLoading ? "Loading" : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
