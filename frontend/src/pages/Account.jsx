import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import * as orderService from '../services/orderService';
import Swal from 'sweetalert2';
import { api } from '../services/api';

export const Account = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [tab, setTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      nombre: user?.nombre || '',
      telefono: user?.telefono || '',
      direccion: user?.direccion || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    if (user && !ordersLoaded) {
      loadOrders();
      reset({
        nombre: user.nombre,
        telefono: user.telefono,
        direccion: user.direccion
      });
      setOrdersLoaded(true);
    }
  }, [user, ordersLoaded, reset]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-agua-deep via-agua-mid to-verde-deep pt-24 pb-16">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Debes iniciar sesión</h2>
            <button
              onClick={() => navigate('/login')}
              className="w-full px-6 py-3 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white font-bold rounded-lg hover:shadow-lg transition"
            >
              Ir a Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders();
      setOrders(response);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularTiempoRestante = (fechaCreacion) => {
    const ahora = new Date();
    const creado = new Date(fechaCreacion);
    const diffMinutos = (ahora - creado) / (1000 * 60);
    return diffMinutos;
  };

  const handleCancelOrder = async (orderId, orderNumero) => {
    const result = await Swal.fire({
      title: '¿Cancelar pedido?',
      text: `¿Estás segura de que quieres cancelar el pedido ${orderNumero}? Esta acción no se puede deshacer.`,
      icon: 'warning',
      background: '#042533',
      color: '#ffffff',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#1a9e52',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, volver'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await api.patch(`/orders/${orderId}/cancel`);
        Swal.fire({
          icon: 'success',
          title: 'Pedido cancelado',
          text: `El pedido ${orderNumero} ha sido cancelado exitosamente.`,
          background: '#042533',
          color: '#ffffff',
          confirmButtonColor: '#1a9e52'
        });
        loadOrders();
      } catch (error) {
        console.error('Error cancelando orden:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.response?.data?.error || 'No se pudo cancelar el pedido',
          background: '#042533',
          color: '#ffffff',
          confirmButtonColor: '#1a9e52'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const onProfileSubmit = async (data) => {
    try {
      const updateData = {
        nombre: data.nombre,
        telefono: data.telefono,
        direccion: data.direccion
      };

      if (data.newPassword) {
        if (!data.currentPassword) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debes ingresar tu contraseña actual para cambiarla',
            background: '#042533',
            color: '#ffffff',
            confirmButtonColor: '#1a9e52'
          });
          return;
        }

        if (data.newPassword !== data.confirmPassword) {
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

        updateData.password = data.newPassword;
      }

      await updateProfile(updateData);

      Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'Tu perfil ha sido actualizado exitosamente',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52',
        timer: 2000,
        showConfirmButton: false
      });

      reset({
        nombre: data.nombre,
        telefono: data.telefono,
        direccion: data.direccion,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.error || 'Error al actualizar el perfil',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      });
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Cerrar sesión',
      text: 'Serás desconectado de tu cuenta',
      icon: 'question',
      background: '#042533',
      color: '#ffffff',
      showCancelButton: true,
      confirmButtonColor: '#1a9e52',
      cancelButtonColor: '#0d8fa8',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/');
      }
    });
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'EN_PREPARACION':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ENVIADO':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'ENTREGADO':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'CANCELADO':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-white/10 text-white/60';
    }
  };

  const getEstadoTexto = (estado) => {
    const textos = {
      PENDIENTE: 'Pendiente',
      EN_PREPARACION: 'En Preparación',
      ENVIADO: 'Enviado',
      ENTREGADO: 'Entregado',
      CANCELADO: 'Cancelado'
    };
    return textos[estado] || estado;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-agua-deep via-agua-mid to-verde-deep pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Mi Cuenta</h1>
          <p className="text-white/65">Bienvenido, {user.nombre}</p>
        </div>

        <div className="flex gap-4 mb-8 border-b border-agua-claro/20">
          <button
            onClick={() => setTab('profile')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              tab === 'profile'
                ? 'text-agua-claro border-agua-claro'
                : 'text-white/60 border-transparent hover:text-white'
            }`}
          >
            Mi Perfil
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              tab === 'orders'
                ? 'text-agua-claro border-agua-claro'
                : 'text-white/60 border-transparent hover:text-white'
            }`}
          >
            Mis Pedidos ({orders.length})
          </button>
        </div>

        {tab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onProfileSubmit)} className="bg-white/5 border border-agua-claro/20 rounded-2xl p-8 space-y-6">
                
                <h2 className="text-2xl font-bold text-white mb-8">Editar Perfil</h2>

                <div className="space-y-6 pb-8 border-b border-agua-claro/20">
                  <h3 className="text-lg font-semibold text-agua-claro">Datos Personales</h3>

                  <div>
                    <label className="block text-white font-semibold mb-2">Nombre Completo</label>
                    <input
                      {...register('nombre', { required: 'Campo requerido' })}
                      type="text"
                      className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-agua-claro transition"
                    />
                    {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre.message}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-3 text-white/50 cursor-not-allowed"
                    />
                    <p className="text-white/60 text-xs mt-1">No puedes cambiar tu email</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Teléfono</label>
                      <input
                        {...register('telefono')}
                        type="tel"
                        className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-agua-claro transition"
                        placeholder="+57 300 1234567"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Dirección</label>
                      <input
                        {...register('direccion')}
                        type="text"
                        className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-agua-claro transition"
                        placeholder="Cra 50 #30-15"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pb-8">
                  <h3 className="text-lg font-semibold text-agua-claro">Cambiar Contraseña</h3>

                  <div>
                    <label className="block text-white font-semibold mb-2">Contraseña Actual</label>
                    <input
                      {...register('currentPassword')}
                      type="password"
                      className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-agua-claro transition"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Nueva Contraseña</label>
                      <input
                        {...register('newPassword')}
                        type="password"
                        className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-agua-claro transition"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Confirmar Contraseña</label>
                      <input
                        {...register('confirmPassword')}
                        type="password"
                        className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-agua-claro transition"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <p className="text-white/60 text-xs">
                    Déjalo en blanco si no quieres cambiar tu contraseña
                  </p>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white font-bold rounded-lg hover:shadow-lg transition"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-1 px-6 py-3 border-2 border-red-500/50 text-red-400 font-bold rounded-lg hover:bg-red-500/10 transition"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-agua-vivo/20 to-verde-vivo/20 border border-agua-claro/30 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-agua-claro mb-4">Información de Cuenta</h3>
                <div className="space-y-3 text-white/60 text-sm">
                  <p><span className="font-semibold">Email:</span> {user.email}</p>
                  <p><span className="font-semibold">Rol:</span> {user?.rol === 'admin' ? 'Administrador' : 'Cliente'}</p>
                  <p><span className="font-semibold">Estado:</span> Activo</p>
                  <p><span className="font-semibold">Órdenes:</span> {orders.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agua-claro"></div>
                  <span className="text-white/60">Cargando pedidos...</span>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-12 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Sin pedidos aún</h3>
                <p className="text-white/60 mb-8 max-w-md mx-auto">
                  No tienes órdenes registradas. Comienza a comprar nuestros productos hidropónicos.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => {
                  const tiempoTranscurrido = calcularTiempoRestante(order.createdAt);
                  const puedeCancelar = order.estado === 'PENDIENTE' && tiempoTranscurrido < 120;
                  
                  return (
                    <div key={order.id} className="bg-white/5 border border-agua-claro/20 rounded-2xl overflow-hidden hover:border-agua-claro/50 transition">
                      <div className="bg-white/10 px-6 py-4 flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-bold text-white">{order.numero}</h3>
                          <p className="text-white/60 text-sm">
                            {new Date(order.fecha).toLocaleDateString('es-CO')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`inline-block px-4 py-2 rounded-full border text-sm font-semibold ${getEstadoColor(order.estado)}`}>
                            {getEstadoTexto(order.estado)}
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="mb-6 pb-6 border-b border-agua-claro/20">
                          <h4 className="text-white font-semibold mb-3">Productos:</h4>
                          <div className="space-y-2">
                            {order.items.map(item => (
                              <div key={item.id} className="flex justify-between text-white/60 text-sm">
                                <span>{item.product.nombre} x{item.cantidad}</span>
                                <span>${(item.precioUnitario * item.cantidad).toLocaleString('es-CO')}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div>
                            <p className="text-white/60 text-xs">Total</p>
                            <p className="text-agua-claro font-bold text-lg">${order.total.toLocaleString('es-CO')}</p>
                          </div>
                          <div>
                            <p className="text-white/60 text-xs">Dirección</p>
                            <p className="text-white text-sm line-clamp-2">{order.direccionEnvio}</p>
                          </div>
                          <div>
                            <p className="text-white/60 text-xs">Teléfono</p>
                            <p className="text-white font-semibold">{order.telefonoContacto}</p>
                          </div>
                          <div>
                            <p className="text-white/60 text-xs">Pago</p>
                            <p className="text-verde-claro font-semibold">Contra Entrega</p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                            className="text-agua-claro hover:text-agua-claro/70 text-sm font-semibold transition"
                          >
                            {selectedOrder === order.id ? 'Ocultar detalles' : 'Ver detalles'}
                          </button>
                          
                          {puedeCancelar && (
                            <button
                              onClick={() => handleCancelOrder(order.id, order.numero)}
                              className="text-red-400 hover:text-red-300 text-sm font-semibold transition"
                            >
                              Cancelar pedido
                            </button>
                          )}
                        </div>

                        {selectedOrder === order.id && (
                          <div className="mt-6 pt-6 border-t border-agua-claro/20 space-y-4">
                            <div className="bg-white/5 rounded-lg p-4">
                              <h4 className="text-white font-semibold mb-2">Datos de Contacto</h4>
                              <p className="text-white/60 text-sm">Email: {order.emailContacto}</p>
                              <p className="text-white/60 text-sm">Teléfono: {order.telefonoContacto}</p>
                            </div>
                            {order.notas && (
                              <div className="bg-white/5 rounded-lg p-4">
                                <h4 className="text-white font-semibold mb-2">Notas Especiales</h4>
                                <p className="text-white/60 text-sm">{order.notas}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};