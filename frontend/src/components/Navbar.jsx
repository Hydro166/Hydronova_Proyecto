import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCartStore } from '../store/cartStore';
import { useState } from 'react';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { items } = useCartStore();
  const itemCount = items.length;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-agua-deep to-verde-deep border-b border-agua-claro/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link to="/" className="flex items-center">
            <span className="text-xl sm:text-2xl font-bold text-white">
              Hydro<span className="text-agua-claro">Nova</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-white/75 hover:text-agua-claro transition">Inicio</Link>
            <Link to="/catalog" className="text-white/75 hover:text-agua-claro transition">Catálogo</Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            
            <Link to="/cart" className="relative p-2 text-white/75 hover:text-agua-claro transition">
              <span className="hidden sm:inline">Carrito</span>
              <span className="sm:hidden text-sm">Carrito</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-agua-claro text-agua-deep text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-white/75 hover:text-agua-claro transition text-sm sm:text-base"
                >
                  {user?.nombre?.split(' ')[0] || 'Usuario'}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-agua-deep border border-agua-claro/30 rounded-lg shadow-lg z-50">
                    <Link to="/account" className="block px-4 py-2 text-white/75 hover:text-agua-claro" onClick={() => setMenuOpen(false)}>
                      Mi Cuenta
                    </Link>
                    {user?.rol === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-verde-claro hover:text-verde-claro/80" onClick={() => setMenuOpen(false)}>
                        Panel Admin
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-white/75 hover:text-agua-claro border-t border-agua-claro/20">
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link to="/login" className="text-white/75 hover:text-agua-claro transition text-sm sm:text-base">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white rounded-full font-semibold text-xs sm:text-sm">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};