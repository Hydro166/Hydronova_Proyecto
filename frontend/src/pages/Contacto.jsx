import { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '../services/api';

export const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos del formulario',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Email inválido',
        text: 'Ingresa un correo electrónico válido',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      });
      return;
    }

    try {
      setLoading(true);
      await api.post('/messages', formData);

      Swal.fire({
        icon: 'success',
        title: 'Mensaje enviado',
        text: 'Gracias por contactarnos. Te responderemos a la brevedad.',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      });

      setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el mensaje. Intenta de nuevo más tarde.',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-agua-deep via-agua-mid to-verde-deep pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-8">
          
          <h1 className="text-3xl font-bold text-white mb-2">Contacto</h1>
          <p className="text-white/65 mb-8">¿Tienes preguntas, sugerencias o necesitas ayuda? Escríbenos y te responderemos pronto.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold text-lg mb-3">Información de contacto</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-white/40 text-sm">Email</p>
                    <p className="text-agua-claro">hydronova166@gmail.com</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-sm">Teléfono</p>
                    <p className="text-agua-claro">+57 300 000 0000</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-sm">Dirección</p>
                    <p className="text-agua-claro">Medellín, Colombia</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-sm">Horario de atención</p>
                    <p className="text-agua-claro">Lunes a viernes, 8:00 am - 6:00 pm</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">Nombre completo *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-agua-claro transition"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2 text-sm">Correo electrónico *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-agua-claro transition"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2 text-sm">Asunto *</label>
                <input
                  type="text"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-agua-claro transition"
                  placeholder="¿Sobre qué trata tu mensaje?"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2 text-sm">Mensaje *</label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-agua-claro transition resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 transition"
              >
                {loading ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          </div>

          <div className="mt-8 pt-6 border-t border-agua-claro/20">
            <Link to="/" className="text-agua-claro hover:text-agua-claro/70 transition">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};