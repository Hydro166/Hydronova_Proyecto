import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Swal from 'sweetalert2';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}`, { estado: newStatus });
      Swal.fire({ icon: 'success', title: 'Estado actualizado', background: '#042533', color: '#fff' });
      loadOrders();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar', background: '#042533', color: '#fff' });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agua-claro"></div></div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-8">Gestión de Órdenes</h1>
      <div className="bg-white/5 border border-agua-claro/20 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-white">ID</th>
              <th className="px-6 py-4 text-left text-white">Cliente</th>
              <th className="px-6 py-4 text-left text-white">Total</th>
              <th className="px-6 py-4 text-left text-white">Estado</th>
              <th className="px-6 py-4 text-left text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t border-agua-claro/20">
                <td className="px-6 py-4 text-white/60">{order.numero || order.id.slice(-6)}</td>
                <td className="px-6 py-4 text-white/60">{order.emailContacto}</td>
                <td className="px-6 py-4 text-agua-claro font-bold">${order.total.toLocaleString('es-CO')}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.estado === 'PENDIENTE' ? 'bg-yellow-500/20 text-yellow-400' :
                    order.estado === 'EN_PREPARACION' ? 'bg-blue-500/20 text-blue-400' :
                    order.estado === 'ENVIADO' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>{order.estado}</span>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={order.estado} 
                    onChange={(e) => updateStatus(order.id, e.target.value)} 
                    className="bg-agua-deep border border-agua-claro/30 rounded-lg px-3 py-1 text-white text-sm"
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN_PREPARACION">En Preparación</option>
                    <option value="ENVIADO">Enviado</option>
                    <option value="ENTREGADO">Entregado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};