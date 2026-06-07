import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesByDay, setSalesByDay] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
    loadLowStockProducts();
    loadRecentOrders();
    loadSalesByDay();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setDashboard(response);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const loadLowStockProducts = async () => {
    try {
      const response = await api.get('/admin/products?limit=100');
      const lowStock = response.data.filter(p => p.stock < 10 && p.stock > 0);
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error('Error loading low stock products:', error);
    }
  };

  const loadRecentOrders = async () => {
    try {
      const response = await api.get('/admin/orders?limit=5');
      setRecentOrders(response.data);
    } catch (error) {
      console.error('Error loading recent orders:', error);
    }
  };

  const loadSalesByDay = async () => {
    try {
      const response = await api.get('/admin/sales-by-day');
      setSalesByDay(response);
    } catch (error) {
      console.error('Error loading sales by day:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agua-claro"></div>
        <span className="text-white/60 ml-3">Cargando dashboard...</span>
      </div>
    );
  }

  const { resumen, productosMasVendidos, ordenesPorEstado } = dashboard || {};

  // Formatear números para el tooltip
  const formatYAxis = (value) => `$${(value / 1000).toFixed(0)}k`;
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-agua-deep border border-agua-claro/30 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-1">{label}</p>
          <p className="text-agua-claro font-bold">
            ${payload[0].value.toLocaleString('es-CO')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard Administrador</h1>
        <p className="text-white/65">Bienvenido, {user?.nombre}</p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-6 hover:border-agua-claro/50 transition">
          <p className="text-white/60 text-sm font-semibold">Total de Ventas</p>
          <p className="text-3xl font-bold text-agua-claro mt-2">
            ${resumen?.totalVentas?.toLocaleString('es-CO') || 0}
          </p>
        </div>

        <div className="bg-white/5 border border-verde-claro/20 rounded-2xl p-6 hover:border-verde-claro/50 transition">
          <p className="text-white/60 text-sm font-semibold">Ventas del Mes</p>
          <p className="text-3xl font-bold text-verde-claro mt-2">
            ${resumen?.ventasMes?.toLocaleString('es-CO') || 0}
          </p>
        </div>

        <div className="bg-white/5 border border-dorado/20 rounded-2xl p-6 hover:border-dorado/50 transition">
          <p className="text-white/60 text-sm font-semibold">Total Órdenes</p>
          <p className="text-3xl font-bold text-dorado mt-2">{resumen?.totalOrdenes || 0}</p>
        </div>

        <div className="bg-white/5 border border-amber-500/30 rounded-2xl p-6 hover:border-amber-500/50 transition">
          <p className="text-white/60 text-sm font-semibold">Pendientes</p>
          <p className="text-3xl font-bold text-amber-400 mt-2">{resumen?.ordenesPendientes || 0}</p>
        </div>

        <div className="bg-white/5 border border-pink-500/30 rounded-2xl p-6 hover:border-pink-500/50 transition">
          <p className="text-white/60 text-sm font-semibold">Clientes</p>
          <p className="text-3xl font-bold text-pink-400 mt-2">{resumen?.totalClientes || 0}</p>
        </div>
      </div>

      {/* Gráfico de Ventas por Día */}
      <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">📈 Ventas por Día (Últimos 7 días)</h2>
        {salesByDay.length === 0 ? (
          <p className="text-white/60 text-center py-8">No hay datos de ventas disponibles</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="dia" stroke="#ffffff80" />
              <YAxis stroke="#ffffff80" tickFormatter={formatYAxis} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="ventas"
                stroke="#1dd4e8"
                strokeWidth={2}
                dot={{ fill: '#1dd4e8', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Stock Bajo */}
        <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">⚠️ Stock Bajo</h2>
          {lowStockProducts.length === 0 ? (
            <p className="text-white/60 text-center py-8">No hay productos con stock bajo</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map(product => (
                <div key={product.id} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                  <div>
                    <p className="text-white font-semibold">{product.nombre}</p>
                    <p className="text-white/40 text-sm">Categoría: {product.categoria}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-bold text-xl">{product.stock}</p>
                    <p className="text-white/40 text-xs">unidades</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Productos más vendidos */}
        <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Top Productos Vendidos</h2>
          {productosMasVendidos?.length === 0 ? (
            <p className="text-white/60 text-center py-8">Sin datos aún</p>
          ) : (
            <div className="space-y-3">
              {productosMasVendidos?.map((prod, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-agua-vivo rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{prod.nombre}</p>
                      <p className="text-white/40 text-xs">${prod.precioUnitario?.toLocaleString('es-CO')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-agua-claro font-bold">{prod.cantidadVendida} uds</p>
                    <p className="text-white/40 text-xs">
                      ${(prod.cantidadVendida * prod.precioUnitario).toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Estados de órdenes y Últimas órdenes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Estados de órdenes */}
        <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Estados de Órdenes</h2>
          <div className="space-y-3">
            {ordenesPorEstado?.map((item, idx) => {
              const colors = {
                PENDIENTE: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Pendiente' },
                EN_PREPARACION: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'En Preparación' },
                ENVIADO: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Enviado' },
                ENTREGADO: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Entregado' },
                CANCELADO: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Cancelado' }
              };
              const color = colors[item.estado] || colors.PENDIENTE;
              return (
                <div key={idx} className={`${color.bg} border border-current rounded-lg p-4`}>
                  <div className="flex justify-between items-center">
                    <p className={`font-semibold ${color.text}`}>{color.label}</p>
                    <p className={`text-2xl font-bold ${color.text}`}>{item._count}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Últimas órdenes */}
        <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Últimas Órdenes</h2>
          {recentOrders.length === 0 ? (
            <p className="text-white/60 text-center py-8">No hay órdenes recientes</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                  <div>
                    <p className="text-white font-semibold">{order.numero}</p>
                    <p className="text-white/40 text-sm">{order.emailContacto}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-agua-claro font-bold">${order.total.toLocaleString('es-CO')}</p>
                    <p className={`text-xs font-semibold ${
                      order.estado === 'PENDIENTE' ? 'text-yellow-400' :
                      order.estado === 'EN_PREPARACION' ? 'text-blue-400' :
                      order.estado === 'ENVIADO' ? 'text-purple-400' :
                      'text-green-400'
                    }`}>{order.estado}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Última actualización */}
      <div className="mt-8 text-center text-white/40 text-xs">
        Dashboard actualizado en tiempo real
      </div>
    </div>
  );
};