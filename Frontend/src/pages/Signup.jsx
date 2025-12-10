import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisteruserMutation } from '../utils/authAPI';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const Signup = () => {

    const registerSchema = z.object({
        firstname: z.string().min(3, "Firstame must be at least 3 characters"),
        lastname: z.string().min(3, "Lastname must be at least 3 characters"),
        email: z.string().email("Invalid email"),
        mobileno: z.string().length(10, "Invalid mobile number"),
        password: z.string().min(6, "Password must be 6 characters"),
        confirmPassword: z.string(),
        acceptTerms: z.boolean().refine(val => val === true, { message: "You must accept the terms" })
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Password Must Match",
        path: ["confirmPassword"]
    });

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema) });
    const [backendError, setBackendError] = useState("");
    const [Registeruser] = useRegisteruserMutation();
    const navigate = useNavigate();

    const signup = async (data) => {
        try {
            setBackendError("");
            await Registeruser(data).unwrap();
            navigate("/signin");
        } catch (error) {
            setBackendError(error?.data?.message);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">

                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                        to="/signin"
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                    >
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit(signup)}>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="firstname"
                                        type="text"
                                        {...register("firstname")}
                                        className={`appearance-none block w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${errors.firstname?.message ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="First name"
                                    />
                                    {errors.firstname?.message && (
                                        <p className="mt-1 text-sm text-red-600">{errors.firstname?.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="lastname"
                                        type="text"
                                        {...register("lastname")}
                                        className={`appearance-none block w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${errors.lastname?.message ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="Last name"
                                    />
                                    {errors.lastname?.message && (
                                        <p className="mt-1 text-sm text-red-600">{errors.lastname?.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    className={`appearance-none block w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${errors.email?.message ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your email address"
                                />
                                {errors.email?.message && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="mobileno" className="block text-sm font-medium text-gray-700">
                                Mobile Number
                            </label>
                            <div className="mt-1">
                                <input
                                    id="mobileno"
                                    type="number"
                                    {...register("mobileno")}
                                    className={`appearance-none block w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${errors.mobileno?.message ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your mobile number"
                                />
                                {errors.mobileno?.message && (
                                    <p className="mt-1 text-sm text-red-600">{errors.mobileno?.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    type="password"
                                    {...register("password")}
                                    className={`appearance-none block w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${errors.password?.message ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Create a password"
                                />
                                {errors.password?.message && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password?.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    {...register("confirmPassword")}
                                    className={`appearance-none block w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${errors.confirmPassword?.message ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Confirm your password"
                                />
                                {errors.confirmPassword?.message && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword?.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="acceptTerms"
                                    type="checkbox"
                                    {...register("acceptTerms")}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="acceptTerms" className="text-gray-700">
                                    I agree to the{' '}
                                    <a href="#" className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200">
                                        Terms and Conditions
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200">
                                        Privacy Policy
                                    </a>
                                </label>
                                {errors.acceptTerms?.message && (
                                    <p className="mt-1 text-sm text-red-600">{errors.acceptTerms?.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-lg"
                            >
                                Create Account
                            </button>
                        </div>

                        {backendError && (
                            <p className="mt-1 text-sm flex justify-center text-red-600">{backendError}</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Signup;