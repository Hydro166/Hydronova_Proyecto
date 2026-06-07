import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminNav = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed left-0 top-16 bottom-0 w-64 bg-gradient-to-b from-agua-deep to-verde-deep border-r border-agua-claro/20 overflow-y-auto z-40">
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Link
            to="/admin"
            className={`block px-4 py-3 rounded-lg transition ${
              isActive('/admin')
                ? 'bg-agua-claro text-agua-deep font-semibold'
                : 'text-white/75 hover:text-agua-claro hover:bg-white/10'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            className={`block px-4 py-3 rounded-lg transition ${
              isActive('/admin/products')
                ? 'bg-agua-claro text-agua-deep font-semibold'
                : 'text-white/75 hover:text-agua-claro hover:bg-white/10'
            }`}
          >
            Productos
          </Link>
          <Link
            to="/admin/orders"
            className={`block px-4 py-3 rounded-lg transition ${
              isActive('/admin/orders')
                ? 'bg-agua-claro text-agua-deep font-semibold'
                : 'text-white/75 hover:text-agua-claro hover:bg-white/10'
            }`}
          >
            Ordenes
          </Link>
          <Link
            to="/admin/users"
            className={`block px-4 py-3 rounded-lg transition ${
              isActive('/admin/users')
                ? 'bg-agua-claro text-agua-deep font-semibold'
                : 'text-white/75 hover:text-agua-claro hover:bg-white/10'
            }`}
          >
            Usuarios
          </Link>
          <Link
            to="/admin/messages"
            className={`block px-4 py-3 rounded-lg transition ${
              isActive('/admin/messages')
                ? 'bg-agua-claro text-agua-deep font-semibold'
                : 'text-white/75 hover:text-agua-claro hover:bg-white/10'
            }`}
          >
            Mensajes
          </Link>
        </div>

        <div className="border-t border-agua-claro/20 pt-6">
          <Link
            to="/"
            className="block px-4 py-3 rounded-lg text-white/75 hover:text-agua-claro hover:bg-white/10 transition"
          >
            Ver sitio
          </Link>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 mt-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition"
          >
            Cerrar Sesion
          </button>
        </div>
      </div>
    </nav>
  );
};