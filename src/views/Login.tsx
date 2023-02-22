import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import bus from '../assets/bus.png';
import Spinner from '../components/Spinner/Spinner';
import { useAuth } from '../context/AuthContex';
import { login } from '../utils/api';

export default function Login() {
  const [loadImage, setLoadImage] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false
  });
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [loginForm, setLoginForm] = React.useState<{ email: string; password: string }>({
    email: '',
    password: ''
  });

  const { login: loginContext } = useAuth();

  const navigate = useNavigate();

  const { mutate } = useMutation(login, {
    onSuccess: (data) => {
      Swal.fire('Autenticacion exitosa', '', 'success');
      setLoading(false);
      setTimeout(() => {
        loginContext(data);
        navigate('/routes');
      }, 1000);
    },
    onError: () => {
      Swal.fire('Autenticacion fallida', '', 'error');
      setLoading(false);
    }
  });

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const errors = {
      email: !loginForm.email ?? true,
      password: !loginForm.password ?? true
    };

    if (Object.values(errors).includes(true)) {
      setFormError(errors);
      setLoading(false);
      return;
    }

    mutate(loginForm);
  };

  return (
    <div
      className={`${
        loadImage ? 'opacity-100' : 'opacity-0'
      } w-full min-h-screen flex items-center justify-center transition-opacity duration-300 bg-slate-50`}
    >
      <div className="fixed flex flex-col md:flex-row gap-4 top-5 left-8 transition-all duration-150 ease-in-out z-50">
        <button
          className="p-2 flex flex-nowrap gap-2 outline-none  bg-sky-500 text-white rounded-lg font-medium"
          onClick={() => navigate('/')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 rotate-180"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
              clipRule="evenodd"
            />
          </svg>
          Inicio
        </button>
      </div>
      <div className="lg:flex items-center space-x-16">
        <div className="w-5/6 md:w-3/4 lg:w-2/3 xl:w-[500px] 2xl:w-[550px] mt-8 mx-auto px-16 py-8 rounded-lg">
          <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">
            Inicio de sesión
          </h2>

          <form className="my-8 text-sm" onSubmit={(e) => handleSubmit(e)}>
            <div className="flex flex-col my-4">
              <label htmlFor="email" className="text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className={`mt-2 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900 ${
                  formError.email ? 'border border-red-500' : ''
                }`}
                placeholder="Enter your email"
                onChange={handleChangeForm}
              />
            </div>

            <div className="flex flex-col my-4">
              <label htmlFor="password" className="text-gray-700">
                Password
              </label>
              <div className="relative flex items-center mt-2">
                <input
                  name="password"
                  id="password"
                  className={`mt-2 p-2 w-full  border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900 ${
                    formError.password ? 'border border-red-500' : ''
                  }`}
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  onChange={handleChangeForm}
                />
                <button
                  type="button"
                  className="absolute right-2 bg-transparent flex items-center justify-center text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="my-4 flex items-center justify-center space-x-4 w-full">
              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-600 rounded-lg px-8 py-2 text-gray-100 hover:shadow-xl transition duration-150 uppercase"
              >
                {isLoading ? <Spinner /> : 'Ingresar'}
              </button>
            </div>
          </form>
        </div>
        <div className="flex w-1/2 items-center justify-center">
          <img src={bus} alt="busimage" onLoad={() => setLoadImage(true)} />
        </div>
      </div>
    </div>
  );
}
