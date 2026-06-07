import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';

export const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      nombre: '',
      telefono: '',
      direccion: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      });
      return;
    }

    try {
      setLoading(true);
      await registerUser(
        data.email,
        data.password,
        data.nombre,
        data.telefono,
        data.direccion
      );

      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Tu cuenta ha sido creada exitosamente',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52',
        timer: 2000,
        showConfirmButton: false
      });

      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de registro',
        text: error?.error || 'Error al crear la cuenta',
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
        <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-8 backdrop-blur-sm">
          <Link to="/" className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 42 42" fill="none" className="w-10 h-10">
                <circle cx="21" cy="21" r="20" stroke="url(#g1)" strokeWidth="1.5"/>
                <path d="M21 8 C21 8 10 16 10 24 C10 30.6 15 36 21 36 C27 36 32 30.6 32 24 C32 16 21 8 21 8Z" fill="url(#g2)" opacity="0.9"/>
                <path d="M21 14 C21 14 15 20 15 25 C15 28.3 17.7 31 21 31 C24.3 31 27 28.3 27 25 C27 20 21 14 21 14Z" fill="url(#g3)"/>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="42" y2="42">
                    <stop offset="0%" stopColor="#2dce7a"/>
                    <stop offset="100%" stopColor="#1dd4e8"/>
                  </linearGradient>
                  <linearGradient id="g2" x1="10" y1="8" x2="32" y2="36">
                    <stop offset="0%" stopColor="#1dd4e8" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#1a9e52" stopOpacity="0.8"/>
                  </linearGradient>
                  <linearGradient id="g3" x1="15" y1="14" x2="27" y2="31">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
                    <stop offset="100%" stopColor="#2dce7a" stopOpacity="0.7"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-xl font-bold text-white">HydroNova</span>
            </div>
          </Link>

          <h1 className="text-3xl font-bold text-white text-center mb-2">Crear Cuenta</h1>
          <p className="text-white/60 text-center mb-8">Únete a la revolución de cultivos hidropónicos</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Nombre Completo</label>
              <input
                {...register('nombre', { required: 'Campo requerido' })}
                type="text"
                className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-agua-claro transition text-sm"
                placeholder="Juan Pérez"
              />
              {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre.message}</p>}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Email</label>
              <input
                {...register('email', {
                  required: 'Campo requerido',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' }
                })}
                type="email"
                className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-agua-claro transition text-sm"
                placeholder="tu@email.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Teléfono</label>
              <input
                {...register('telefono')}
                type="tel"
                className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-agua-claro transition text-sm"
                placeholder="+57 300 1234567"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Dirección</label>
              <input
                {...register('direccion')}
                type="text"
                className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-agua-claro transition text-sm"
                placeholder="Cra 50 #30-15"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Contraseña</label>
              <input
                {...register('password', {
                  required: 'Campo requerido',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                })}
                type="password"
                className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-agua-claro transition text-sm"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Confirmar Contraseña</label>
              <input
                {...register('confirmPassword', {
                  required: 'Campo requerido',
                  validate: value => value === password || 'Las contraseñas no coinciden'
                })}
                type="password"
                className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-agua-claro transition text-sm"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 transition mt-6"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-agua-claro/20"></div>
            <span className="text-white/60 text-sm">¿Ya tienes cuenta?</span>
            <div className="flex-1 h-px bg-agua-claro/20"></div>
          </div>

          <Link
            to="/login"
            className="block w-full px-6 py-3 border-2 border-agua-claro text-agua-claro font-bold rounded-lg hover:bg-agua-claro/10 transition text-center"
          >
            Iniciar Sesión
          </Link>
        </div>

        <p className="text-center text-white/60 text-sm mt-8">
          <Link to="/" className="text-agua-claro hover:text-agua-claro/70 transition">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
};