import { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '../services/api';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Campo requerido',
        text: 'Debes ingresar tu correo electrónico',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      });
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      Swal.fire({
        icon: 'success',
        title: 'Correo enviado',
        text: 'Si el correo está registrado, recibirás un enlace para recuperar tu contraseña',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo procesar la solicitud. Intenta de nuevo más tarde.',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-agua-deep via-agua-mid to-verde-deep pt-24 pb-16 flex items-center">
        <div className="max-w-md mx-auto px-4 w-full">
          <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-2xl font-bold text-white mb-4">Revisa tu correo</h2>
            <p className="text-white/60 mb-6">
              Te hemos enviado un enlace para recuperar tu contraseña a <strong>{email}</strong>.
              Si no lo encuentras, revisa la carpeta de spam.
            </p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white font-bold rounded-lg hover:shadow-lg transition"
            >
              Volver al inicio de sesión
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

          <h1 className="text-3xl font-bold text-white text-center mb-2">Recuperar contraseña</h1>
          <p className="text-white/60 text-center mb-8">
            Ingresa tu correo electrónico y te enviaremos un enlace para crear una nueva contraseña
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-agua-claro transition"
                placeholder="tu@email.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 transition"
            >
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
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