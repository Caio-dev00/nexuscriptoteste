import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  type: string;
  placeholder: string;
  name: keyof T & Path<T>;
  register: UseFormRegister<T>
  error?: string;
}

export default function Input<T extends FieldValues>({ name, placeholder, register, type, error }: InputProps<T>) {
  return (
    <div>
        <input
        className="block w-full rounded-md border-2 border-gray-400 mb-2 py-3 px-2 text-gray-600 md:text-sm"
        type={type}
        {...register(name)}
        id={name as string}
        placeholder={placeholder}
      />
      {error && <p className='my-1 text-red-500'>{error}</p>}
    </div>
  )
}