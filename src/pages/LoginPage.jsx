import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useFormWithValidation } from '../hooks/useFormWithValidation';
import { loginSchema } from '../utils/schemas';
import { FaGoogle } from 'react-icons/fa';

const FormInput = ({ label, name, type = 'text', register, error, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">
            {label}
        </label>
        <input
            id={name}
            type={type}
            className={`w-full px-4 py-2.5 text-sm bg-white rounded-lg border ${error ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors`}
            {...register(name)}
            {...props}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
);

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';
    const { login, isAuthenticated, isLoading } = useAuthStore();
    const { register, handleSubmit, formState: { errors } } = useFormWithValidation(loginSchema);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const onSubmit = async (data) => {
        setFormError('');
        const success = await login(data);
        if (!success) {
            setFormError('Login failed. Please check your email and password.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl border border-gray-200/80 shadow-sm">
                <div>
                    <p className="text-center text-sm text-gray-500">Home - Log In</p>
                    <h2 className="mt-4 text-center text-4xl font-bold text-gray-900">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
                            Create Account
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {formError && (
                        <div className="bg-red-100 text-red-600 p-3 rounded-md text-sm">
                            {formError}
                        </div>
                    )}
                    <FormInput label="Email *" name="email" type="email" register={register} error={errors.email} placeholder="Your email" />
                    <FormInput label="Password *" name="password" type="password" register={register} error={errors.password} placeholder="Your password" />

                    <div className="flex items-center justify-end">
                        <div className="text-sm">
                            <a href="#" className="font-medium text-primary hover:text-primary-dark">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
                        >
                            {isLoading ? 'Logging In...' : 'Log In'}
                        </button>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="w-full border-t border-gray-200"></div>
                        <span className="flex-shrink-0 px-2 text-sm text-gray-500 bg-white">OR</span>
                        <div className="w-full border-t border-gray-200"></div>
                    </div>

                    <div>
                        <button
                            type="button"
                            disabled // Not implemented yet
                            className="group relative w-full flex items-center justify-center py-3 px-4 border border-gray-300 text-sm font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <FaGoogle className="mr-3" />
                            Continue with Google
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}