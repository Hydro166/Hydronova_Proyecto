import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Swal from 'sweetalert2';

// ============================================
// ADMIN USERS - TABLA DE CLIENTES
// ============================================
export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, total: 1 });

  useEffect(() => {
    loadUsers();
  }, [pagination.current]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users', {
        params: { page: pagination.current, limit: 15 }
      });
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'activar' : 'desactivar';

    const result = await Swal.fire({
      title: `¿${action} este usuario?`,
      text: `El usuario ${action === 'desactivar' ? 'no podrá iniciar sesión' : 'volverá a tener acceso'}.`,
      icon: 'question',
      background: '#042533',
      color: '#fff',
      showCancelButton: true,
      confirmButtonColor: '#1a9e52',
      cancelButtonColor: '#0d8fa8',
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/admin/users/${userId}/toggle-status`, { activo: newStatus });
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: `Usuario ${action}do exitosamente`,
          background: '#042533',
          color: '#fff',
          timer: 2000,
          showConfirmButton: false
        });
        loadUsers();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cambiar el estado',
          background: '#042533',
          color: '#fff'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agua-claro"></div>
        <span className="text-white/60 ml-3">Cargando usuarios...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Gestión de Clientes</h1>
        <p className="text-white/65">Total: {pagination.totalItems || 0} clientes registrados</p>
      </div>

      <div className="bg-white/5 border border-agua-claro/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-white">Nombre</th>
                <th className="px-6 py-4 text-left text-white">Email</th>
                <th className="px-6 py-4 text-left text-white">Teléfono</th>
                <th className="px-6 py-4 text-left text-white">Dirección</th>
                <th className="px-6 py-4 text-left text-white">Registro</th>
                <th className="px-6 py-4 text-left text-white">Estado</th>
                <th className="px-6 py-4 text-center text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t border-agua-claro/20 hover:bg-white/5 transition">
                  <td className="px-6 py-4 text-white/80">{user.nombre}</td>
                  <td className="px-6 py-4 text-white/80">{user.email}</td>
                  <td className="px-6 py-4 text-white/80">{user.telefono || '—'}</td>
                  <td className="px-6 py-4 text-white/80">{user.direccion || '—'}</td>
                  <td className="px-6 py-4 text-white/80">
                    {new Date(user.createdAt).toLocaleDateString('es-CO')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.activo
                        ? 'bg-verde-vivo/20 text-verde-claro border border-verde-vivo/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleUserStatus(user.id, user.activo)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                        user.activo
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                          : 'bg-verde-vivo/20 text-verde-claro hover:bg-verde-vivo/30 border border-verde-vivo/30'
                      }`}
                    >
                      {user.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.total > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setPagination({ ...pagination, current: Math.max(1, pagination.current - 1) })}
            disabled={pagination.current === 1}
            className="px-4 py-2 border border-agua-claro/30 text-agua-claro rounded-lg hover:bg-agua-claro/10 disabled:opacity-50 transition"
          >
            ← Anterior
          </button>
          <div className="flex gap-2">
            {Array.from({ length: Math.min(5, pagination.total) }, (_, i) => {
              const page = pagination.current - 2 + i;
              if (page < 1 || page > pagination.total) return null;
              return (
                <button
                  key={page}
                  onClick={() => setPagination({ ...pagination, current: page })}
                  className={`w-10 h-10 rounded-lg transition ${
                    pagination.current === page
                      ? 'bg-agua-claro text-agua-deep font-bold'
                      : 'bg-white/10 text-agua-claro hover:bg-white/20'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setPagination({ ...pagination, current: Math.min(pagination.total, pagination.current + 1) })}
            disabled={pagination.current === pagination.total}
            className="px-4 py-2 border border-agua-claro/30 text-agua-claro rounded-lg hover:bg-agua-claro/10 disabled:opacity-50 transition"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// ADMIN MESSAGES - MENSAJES DE CONTACTO (CORREGIDO)
// ============================================
export const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, total: 1 });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filters, setFilters] = useState({ respondido: 'todos' });

  useEffect(() => {
    loadMessages();
  }, [filters, pagination.current]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      // ✅ CORREGIDO: cambiar '/admin/messages' a '/messages'
      const response = await api.get('/messages', {
        params: {
          page: pagination.current,
          limit: 10,
          respondido: filters.respondido === 'todos' ? undefined : filters.respondido === 'true'
        }
      });
      setMessages(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (messageId) => {
    const { value: respuesta } = await Swal.fire({
      title: 'Responder Mensaje',
      input: 'textarea',
      inputLabel: 'Tu respuesta',
      inputPlaceholder: 'Escribe tu respuesta aquí...',
      background: '#042533',
      color: '#fff',
      confirmButtonColor: '#1a9e52',
      showCancelButton: true,
      cancelButtonColor: '#0d8fa8',
      confirmButtonText: 'Enviar'
    });

    if (respuesta) {
      try {
        // ✅ CORREGIDO: cambiar POST y ruta a PATCH con ruta correcta
        await api.patch(`/messages/${messageId}`, { respuesta });
        Swal.fire({
          icon: 'success',
          title: 'Respondido',
          text: 'Mensaje respondido exitosamente',
          background: '#042533',
          color: '#fff',
          timer: 2000,
          showConfirmButton: false
        });
        loadMessages();
        setSelectedMessage(null);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al responder',
          background: '#042533',
          color: '#fff'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agua-claro"></div>
        <span className="text-white/60 ml-3">Cargando mensajes...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Mensajes de Contacto</h1>
        <p className="text-white/65">{pagination.totalItems || 0} mensajes totales</p>
      </div>

      <div className="mb-8 flex gap-4">
        <select
          value={filters.respondido}
          onChange={(e) => {
            setFilters({ ...filters, respondido: e.target.value });
            setPagination({ ...pagination, current: 1 });
          }}
          className="px-4 py-2 bg-agua-deep border border-agua-claro/30 rounded-lg text-white focus:outline-none focus:border-agua-claro transition"
        >
          <option value="todos">Todos los mensajes</option>
          <option value="false">Sin responder</option>
          <option value="true">Respondidos</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`bg-white/5 border rounded-xl overflow-hidden hover:border-agua-claro/50 transition cursor-pointer ${
              selectedMessage === msg.id ? 'border-agua-claro' : 'border-agua-claro/20'
            }`}
            onClick={() => setSelectedMessage(selectedMessage === msg.id ? null : msg.id)}
          >
            <div className="bg-white/10 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold">{msg.nombre}</h3>
                <p className="text-white/40 text-xs">{msg.email}</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-xs">
                  {new Date(msg.createdAt).toLocaleDateString('es-CO')}
                </p>
                <span className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                  msg.respondido
                    ? 'bg-verde-vivo/20 text-verde-claro border border-verde-vivo/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {msg.respondido ? 'Respondido' : 'Pendiente'}
                </span>
              </div>
            </div>

            <div className="px-6 py-3 border-b border-agua-claro/20">
              <p className="text-agua-claro text-sm font-semibold">Asunto: {msg.asunto}</p>
            </div>

            <div className="px-6 py-3">
              <p className="text-white/60 text-sm line-clamp-2">{msg.mensaje}</p>
            </div>

            {selectedMessage === msg.id && (
              <div className="px-6 py-4 border-t border-agua-claro/20 bg-white/5 space-y-4">
                <div>
                  <p className="text-agua-claro font-semibold mb-2">Mensaje completo</p>
                  <p className="text-white/60 text-sm whitespace-pre-wrap bg-white/5 p-3 rounded-lg">
                    {msg.mensaje}
                  </p>
                </div>

                {msg.respondido && msg.respuesta && (
                  <div>
                    <p className="text-verde-claro font-semibold mb-2">Tu respuesta</p>
                    <p className="text-white/60 text-sm whitespace-pre-wrap bg-verde-vivo/10 p-3 rounded-lg">
                      {msg.respuesta}
                    </p>
                  </div>
                )}

                {!msg.respondido && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRespond(msg.id);
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white font-bold rounded-lg hover:shadow-lg transition"
                  >
                    Responder Mensaje
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-12 text-center">
          <p className="text-white/60">No hay mensajes para mostrar</p>
        </div>
      )}

      {pagination.total > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setPagination({ ...pagination, current: Math.max(1, pagination.current - 1) })}
            disabled={pagination.current === 1}
            className="px-4 py-2 border border-agua-claro/30 text-agua-claro rounded-lg hover:bg-agua-claro/10 disabled:opacity-50 transition"
          >
            ← Anterior
          </button>
          <div className="flex gap-2">
            {Array.from({ length: Math.min(5, pagination.total) }, (_, i) => {
              const page = pagination.current - 2 + i;
              if (page < 1 || page > pagination.total) return null;
              return (
                <button
                  key={page}
                  onClick={() => setPagination({ ...pagination, current: page })}
                  className={`w-10 h-10 rounded-lg transition ${
                    pagination.current === page
                      ? 'bg-agua-claro text-agua-deep font-bold'
                      : 'bg-white/10 text-agua-claro hover:bg-white/20'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setPagination({ ...pagination, current: Math.min(pagination.total, pagination.current + 1) })}
            disabled={pagination.current === pagination.total}
            className="px-4 py-2 border border-agua-claro/30 text-agua-claro rounded-lg hover:bg-agua-claro/10 disabled:opacity-50 transition"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};