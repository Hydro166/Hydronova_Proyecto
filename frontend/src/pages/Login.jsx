import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Debes ingresar email y contraseña',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      });
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Iniciaste sesión correctamente',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52',
        timer: 2000,
        showConfirmButton: false
      });

      const returnTo = location.state?.returnTo || '/';
      navigate(returnTo);
    } catch (error) {
      console.error('Error de login:', error);
      let mensajeError = 'Email o contraseña incorrectos';
      
      if (error?.response?.data?.error) {
        mensajeError = error.response.data.error;
      } else if (error?.error) {
        mensajeError = error.error;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error de inicio de sesión',
        text: mensajeError,
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-agua-deep via-agua-mid to-verde-deep pt-24 pb-16 flex items-center">
      <div className="max-w-md mx-auto px-4 w-full">
        <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-8">
          
          <Link to="/" className="flex justify-center mb-8">
            <span className="text-2xl font-bold text-white">Hydro<span className="text-agua-claro">Nova</span></span>
          </Link>

          <h1 className="text-3xl font-bold text-white text-center mb-2">Iniciar Sesión</h1>
          <p className="text-white/60 text-center mb-8">Accede a tu cuenta HydroNova</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-agua-claro transition"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-agua-claro transition"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="text-right mt-2">
              <Link to="/forgot-password" className="text-agua-claro hover:text-agua-claro/70 text-sm">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 transition"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-agua-claro/20"></div>
            <span className="text-white/60 text-sm">¿No tienes cuenta?</span>
            <div className="flex-1 h-px bg-agua-claro/20"></div>
          </div>

          <Link
            to="/register"
            className="block w-full py-3 border-2 border-agua-claro text-agua-claro font-bold rounded-lg text-center hover:bg-agua-claro/10 transition"
          >
            Crear Cuenta
          </Link>
        </div>

        <p className="text-center text-white/60 text-sm mt-8">
          <Link to="/" className="text-agua-claro hover:text-agua-claro/70 transition">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
};