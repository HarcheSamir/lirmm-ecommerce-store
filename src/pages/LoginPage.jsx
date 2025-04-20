// src/pages/Login.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useFormWithValidation } from '../hooks/useFormWithValidation'
import { loginSchema } from '../utils/schemas'
import { FaDotCircle } from "react-icons/fa"
import { FaEye, FaEyeSlash } from "react-icons/fa"

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/dashboard'
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false) // <-- Added state for remember me

  const { login, isAuthenticated, isLoading, error } = useAuthStore()
  const [formError, setFormError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useFormWithValidation(loginSchema)

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  // Set form error from store error
  useEffect(() => {
    if (error) {
      setFormError(error)
    }
  }, [error])

  const onSubmit = async (data) => {
    setFormError('')
    const success = await login({ ...data, rememberMe }) 
    if (success) {
      navigate(from, { replace: true })
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Handler for the remember me toggle
  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked)
  }

  return (
    <div className="flex relative h-screen w-full justify-between">
      <div className=" w-full flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="flex items-center mb-8">
            {/* Changed bg-blue-500 to bg-primary */}
            <div className="bg-primary p-2 rounded-lg">
              <FaDotCircle className="text-white text-2xl" />
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-medium">Bienvenue !</h1>
              <p className="text-gray-500 text-sm">Veuillez entrer vos informations pour vous connecter.</p>
            </div>
          </div>

          {formError && (
            <div className="bg-red-100 text-red-500 p-3 rounded mb-4">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                // Changed focus:ring-blue-500 to focus:ring-primary
                className="w-full border border-gray-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className=" flex w-full text-sm font-medium text-gray-700">
                  Mot de passe

                  <div
                    type="button"
                    onClick={togglePasswordVisibility}
                    className=" ml-auto gap-2  cursor-pointer font-medium  pr-3 flex items-center text-gray-400"
                  >
                    {!showPassword ? <FaEyeSlash /> : <FaEye />}
                    hide
                  </div>

                </label>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                // Changed focus:ring-blue-500 to focus:ring-primary
                className="w-full border border-gray-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* --- Remember Me Section --- */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Label now wraps the input and visual toggle for better accessibility */}
                <label htmlFor="remember" className="flex items-center cursor-pointer">
                  <div className="relative inline-block w-10 align-middle select-none">
                    <input
                      type="checkbox"
                      id="remember"
                      className="opacity-0 absolute h-0 w-0 peer" // Added peer class
                      checked={rememberMe} // Controlled component
                      onChange={handleRememberMeChange} // Added change handler
                    />
                    {/* Visual toggle container */}
                    {/* Changed peer-checked:bg-blue-500 to peer-checked:bg-primary */}
                    <div className={`bg-gray-200 rounded-full w-10 h-5 flex items-center peer-checked:bg-primary transition-colors duration-200 ease-in-out`}>
                      <div
                        className={`toggle-dot bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${rememberMe ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    Se souvenir de moi
                  </span>
                </label>
              </div>
              {/* Changed text-blue-500 to text-primary */}
              <a href="#" className="text-sm text-primary hover:underline">
                Mot de passe oublié
              </a>
            </div>
            {/* --- End Remember Me Section --- */}


            <button
              type="submit"
              disabled={isLoading}
              // Changed bg-blue-500 to bg-primary, hover:bg-blue-600 remains (adjust if you have a primary-dark), changed focus:ring-blue-500 to focus:ring-primary
              className=" mx-auto cursor-pointer  w-1/2 bg-primary text-white py-2.5   rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              {isLoading ? (
                <span className="flex justify-center items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Connexion en cours...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="w-[40%]  shrink-0 p-2 flex">
        <img src="/assets/loginBg.png" alt="Login background" className=" w-full  " />
      </div>
    </div>
  )
}

export default LoginPage