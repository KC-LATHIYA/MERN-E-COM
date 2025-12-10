import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginuserMutation } from '../utils/authAPI';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const Signin = () => {

    const formSchems = z.object({
        email: z.string().email("Invalid Email"),
        password: z.string().min(6, "Password must be 6 characters")
    })

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(formSchems) });
    const [backendError, setBackendError] = useState("");
    const [Loginuser] = useLoginuserMutation();
    const user = useSelector((state) => state.authSlice.user);
    const isAuthenticated = useSelector((state) => state.authSlice.isAuthenticated);
    const navigate = useNavigate();

    const signin = async (data) => {
        try {
            setBackendError("");
            await Loginuser(data).unwrap();
        } catch (error) {
            setBackendError(error?.data?.message);
            console.log(backendError);
        }
    };

    useEffect(() => {
        if (isAuthenticated && user?.role === "customer") {
            navigate("/profile");
        }
        if (isAuthenticated && user?.role === "admin") {
            navigate("/admin/dashboard");
        }
    }, [isAuthenticated, user, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <Link
                        to="/signup"
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                    >
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit(signin)}>

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
                                    placeholder="Enter your password"
                                />
                                {errors.password?.message && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password?.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-lg"
                            >
                                Sign in
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

export default Signin;