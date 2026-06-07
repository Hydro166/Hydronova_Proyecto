import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '../services/api';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setValidToken(false);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Debes ingresar la nueva contraseña',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      });
      return;
    }

    if (newPassword.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña muy corta',
        text: 'La contraseña debe tener al menos 6 caracteres',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Las contraseñas no coinciden',
        text: 'Verifica que ambas contraseñas sean iguales',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      });
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/reset-password', { token, newPassword });
      
      Swal.fire({
        icon: 'success',
        title: 'Contraseña actualizada',
        text: 'Tu contraseña ha sido cambiada exitosamente. Ahora puedes iniciar sesión.',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      console.error('Error:', error);
      let mensajeError = 'No se pudo restablecer la contraseña';
      
      if (error?.response?.data?.error) {
        mensajeError = error.response.data.error;
      }
      
      Swal.fire({
        icon: 'error',
       title: 'Error',
        text: mensajeError,
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-agua-deep via-agua-mid to-verde-deep pt-24 pb-16 flex items-center">
        <div className="max-w-md mx-auto px-4 w-full">
          <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Enlace inválido</h2>
            <p className="text-white/60 mb-6">
              El enlace de recuperación no es válido o ha sido mal copiado.
            </p>
            <Link
              to="/forgot-password"
              className="inline-block px-6 py-3 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white font-bold rounded-lg hover:shadow-lg transition"
            >
              Solicitar nuevo enlace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-agua-deep via-agua-mid to-verde-deep pt-24 pb-16 flex items-center">
      <div className="max-w-md mx-auto px-4 w-full">
        <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-8">
          
          <Link to="/" className="flex justify-center mb-8">
            <span className="text-2xl font-bold text-white">Hydro<span className="text-agua-claro">Nova</span></span>
          </Link>

          <h1 className="text-3xl font-bold text-white text-center mb-2">Crear nueva contraseña</h1>
          <p className="text-white/60 text-center mb-8">
            Ingresa tu nueva contraseña
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Nueva contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-agua-claro transition"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Confirmar contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-agua-claro transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 transition"
            >
              {loading ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-agua-claro hover:text-agua-claro/70 text-sm">
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};