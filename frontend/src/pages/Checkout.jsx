import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import Swal from 'sweetalert2';

export const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const getCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('hydronova_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  };
  
  const items = getCartFromLocalStorage();
  const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || '',
    ciudad: 'Medellín',
    notas: ''
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-agua-deep via-agua-mid to-verde-deep pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Debes iniciar sesión</h2>
            <button onClick={() => navigate('/login')} className="px-6 py-3 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white rounded-lg">
              Ir a Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-agua-deep via-agua-mid to-verde-deep pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Carrito vacío</h2>
            <button onClick={() => navigate('/catalog')} className="px-6 py-3 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white rounded-lg">
              Ver productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async () => {
    // Validar campos obligatorios antes de enviar
    if (!formData.nombre || !formData.email || !formData.telefono || !formData.direccion) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos del formulario de envío (nombre, email, teléfono y dirección).',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      });
      return;
    }

    try {
      setLoading(true);
      
      const orderData = {
        direccionEnvio: formData.direccion,
        telefonoContacto: formData.telefono,
        emailContacto: formData.email,
        metodoPago: 'CONTRAENTREGA',
        notas: formData.notas,
        items: items.map(item => ({
          productId: item.productId,
          cantidad: item.cantidad,
          precioUnitario: item.precio
        }))
      };
      
      const response = await api.post('/orders', orderData);
      
      localStorage.removeItem('hydronova_cart');
      
      Swal.fire({
        icon: 'success',
        title: 'Pedido creado',
        html: `Tu pedido ha sido confirmado`,
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      }).then(() => {
        window.location.href = '/account';
      });
      
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.response?.data?.error || 'Error al crear el pedido. Verifica que todos los datos sean correctos.',
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
      <div className="max-w-6xl mx-auto px-4">
        
        <h1 className="text-4xl font-bold text-white mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-8">
              
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-6">Datos de Envío</h2>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-3 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-3 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-3 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-3 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Ciudad</label>
                    <input
                      type="text"
                      name="ciudad"
                      value={formData.ciudad}
                      disabled
                      className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-3 text-white/50 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Notas Especiales</label>
                    <textarea
                      name="notas"
                      value={formData.notas}
                      onChange={handleChange}
                      rows="3"
                      className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-3 text-white resize-none"
                      placeholder="Ej: Entregar después de las 5pm"
                    />
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-3 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white font-bold rounded-lg mt-4"
                  >
                    Continuar
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-6">Confirmar Orden</h2>
                  
                  <div className="bg-white/5 rounded-lg p-4 space-y-2">
                    <p><span className="text-white/60">Nombre:</span> {formData.nombre}</p>
                    <p><span className="text-white/60">Email:</span> {formData.email}</p>
                    <p><span className="text-white/60">Teléfono:</span> {formData.telefono}</p>
                    <p><span className="text-white/60">Dirección:</span> {formData.direccion}</p>
                    {formData.notas && <p><span className="text-white/60">Notas:</span> {formData.notas}</p>}
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-agua-claro font-semibold mb-2">Método de Pago</p>
                    <p className="text-white">Contra Entrega (paga al recibir)</p>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 border-2 border-agua-claro text-agua-claro font-bold rounded-lg"
                    >
                      Editar
                    </button>
                    <button
                      onClick={handleSubmitOrder}
                      disabled={loading}
                      className="flex-1 py-3 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white font-bold rounded-lg disabled:opacity-50"
                    >
                      {loading ? 'Procesando...' : 'Confirmar Orden'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-gradient-to-br from-agua-vivo/20 to-verde-vivo/20 border border-agua-claro/30 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Resumen de Orden</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-agua-claro/20">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-white/60 text-sm">
                    <span>{item.nombre} x{item.cantidad}</span>
                    <span>${(item.precio * item.cantidad).toLocaleString('es-CO')}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-agua-claro/20">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Envío</span>
                  <span className="text-verde-claro">Gratis</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Impuestos</span>
                  <span>Incluido</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-white">Total</span>
                <span className="text-3xl font-bold text-agua-claro">
                  ${total.toLocaleString('es-CO')}
                </span>
              </div>

              <div className="mt-6 text-center text-white/60 text-xs">
                <p>Envío gratis en Medellín</p>
                <p>Pago contra entrega</p>
                <p>Entrega en 24-48 horas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};