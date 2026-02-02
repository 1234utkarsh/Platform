import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


const signupSchema=z.object({
  firstName:z.string().min(3,"Minimum character should be 3"),
  emailId:z.string().email("Invalid Email"),
  password:z.string().min(8,"Password is too weak")
});

function Signup(){
  const {register,handleSubmit,formState:{errors},}=useForm({resolver:zodResolver(signupSchema)});

  const onSubmit=(data)=>{
    console.log(data);
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-95 p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join us and start your journey 🚀
        </p>

        {/* Name */}
        <div className="mb-4">
          <input
            {...register("firstName")}
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-lg 
            bg-white text-gray-800 
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <input
            {...register("emailId")}
            placeholder="Email Address"
            className="w-full p-3 border border-gray-300 rounded-lg 
            bg-white text-gray-800 
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.emailId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.emailId.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg 
            bg-white text-gray-800 
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg 
          font-semibold text-lg
          hover:bg-indigo-700 transition duration-300"
        >
          Sign Up
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <span className="text-indigo-600 font-medium cursor-pointer">
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup