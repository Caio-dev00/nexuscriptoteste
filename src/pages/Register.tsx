import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../components/input';
import { useNavigate } from 'react-router-dom';
import { registerSchema } from '../schema/validationSchema';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)


  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setApiError(null);

    try {
      const response = await axios.post('https://backendnexus-026855c96a67.herokuapp.com/users/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword
      })

      if ( response.status === 200) {
        navigate('/login');
        toast.success("Registration successfull!")
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch(err: any) {
      setApiError(err.response?.data?.message || 'An error occurred during registration')
    } finally {
      setIsLoading(false)
      
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            placeholder="Enter your name"
            name="name"
            register={register}
            error={errors.name?.message}
          />

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

          <Input
            type="password"
            placeholder="Confirm your password"
            name="confirmPassword"
            register={register}
            error={errors.confirmPassword?.message}
          />

          {apiError && <p className='text-red-500'>{apiError}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 mt-4"
          >
            {isLoading ? "Registering..." : "Resgister"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
