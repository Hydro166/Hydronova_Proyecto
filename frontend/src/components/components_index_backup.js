// HydroNova v1.0 - Frontend Components
// src/components/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/uiStore';
import { useCartStore } from '../store/cartStore';

export const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { cartOpen, toggleCart } = useUIStore();
  const { items } = useCartStore();
  const itemCount = items.length;

  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-agua-deep to-verde-deep backdrop-blur-sm border-b border-agua-claro/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <svg viewBox="0 0 42 42" fill="none" className="w-10 h-10">
              <circle cx="21" cy="21" r="20" stroke="url(#g1)" strokeWidth="1.5"/>
              <path d="M21 8 C21 8 10 16 10 24 C10 30.6 15 36 21 36 C27 36 32 30.6 32 24 C32 16 21 8 21 8Z" 
                    fill="url(#g2)" opacity="0.9"/>
              <path d="M21 14 C21 14 15 20 15 25 C15 28.3 17.7 31 21 31 C24.3 31 27 28.3 27 25 C27 20 21 14 21 14Z" 
                    fill="url(#g3)"/>
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
            <span className="text-xl font-bold text-white">
              Hydro<span className="text-agua-claro">Nova</span>
            </span>
          </Link>

          {/* Menu Links */}
          <div className="hidden md:flex gap-8">
            <Link to="/" className="text-white/75 hover:text-agua-claro transition">Inicio</Link>
            <Link to="/catalog" className="text-white/75 hover:text-agua-claro transition">Catálogo</Link>
            <a href="/#about" className="text-white/75 hover:text-agua-claro transition">Nosotros</a>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            
            {auth.isAuthenticated ? (
              <>
                {auth.isAdmin && (
                  <Link to="/admin" className="px-3 py-2 bg-verde-vivo/20 border border-verde-claro text-verde-claro rounded-full text-sm hover:bg-verde-vivo/30 transition">
                    Panel Admin
                  </Link>
                )}
                <div className="relative group">
                  <button className="text-white/75 hover:text-agua-claro transition">
                    👤 {auth.user?.nombre?.split(' ')[0]}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-agua-deep border border-agua-claro/30 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                    <Link to="/account" className="block px-4 py-2 text-white/75 hover:text-agua-claro">Mi Cuenta</Link>
                    <Link to="/orders" className="block px-4 py-2 text-white/75 hover:text-agua-claro">Mis Pedidos</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-white/75 hover:text-agua-claro border-t border-agua-claro/20">
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white/75 hover:text-agua-claro transition">Iniciar Sesión</Link>
                <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white rounded-full font-semibold hover:shadow-lg transition">
                  Registrarse
                </Link>
              </>
            )}

            {/* Carrito */}
            <button 
              onClick={toggleCart}
              className="relative p-2 text-white/75 hover:text-agua-claro transition"
            >
              <span className="text-2xl">🛒</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-agua-claro text-agua-deep text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// ============================================
// src/components/ProductCard.jsx
// ============================================
export const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const precioFinal = product.precioOferta || product.precio;
  const descuento = product.precioFinal ? 
    Math.round((1 - product.precioFinal / product.precio) * 100) : 0;

  return (
    <div className="bg-white/5 border border-agua-claro/20 rounded-2xl overflow-hidden hover:border-agua-claro/50 transition transform hover:-translate-y-2 group">
      
      {/* Imagen */}
      <div className="relative h-48 bg-gradient-to-br from-verde-vivo/10 to-agua-vivo/10 overflow-hidden cursor-pointer"
           onClick={() => navigate(`/product/${product.id}`)}>
        <img 
          src={product.imagenUrl} 
          alt={product.nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition"
        />
        
        {descuento > 0 && (
          <div className="absolute top-3 left-3 bg-verde-vivo text-white text-xs font-bold px-3 py-1 rounded-full">
            -{descuento}%
          </div>
        )}

        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Sin Stock</span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-2">{product.nombre}</h3>
        
        <p className="text-white/60 text-sm mb-3 line-clamp-2">{product.descripcion}</p>

        {/* Precios */}
        <div className="flex items-end gap-2 mb-4">
          <span className="text-2xl font-bold text-agua-claro">
            ${precioFinal.toLocaleString('es-CO')}
          </span>
          {product.precioOferta && (
            <span className="text-white/40 line-through text-sm">
              ${product.precio.toLocaleString('es-CO')}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="text-xs text-white/50 mb-3">
          {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
        </div>

        {/* Botones */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex-1 px-3 py-2 bg-white/10 border border-agua-claro/30 text-agua-claro rounded-lg hover:bg-agua-claro/10 transition text-sm"
          >
            Ver detalle
          </button>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition text-sm font-semibold"
          >
            + Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// src/components/Footer.jsx
// ============================================
export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-agua-deep via-verde-deep to-agua-deep border-t border-agua-claro/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg viewBox="0 0 42 42" fill="none" className="w-8 h-8">
                <circle cx="21" cy="21" r="20" stroke="url(#g1)" strokeWidth="1.5"/>
                <path d="M21 8 C21 8 10 16 10 24 C10 30.6 15 36 21 36 C27 36 32 30.6 32 24 C32 16 21 8 21 8Z" 
                      fill="url(#g2)" opacity="0.9"/>
              </svg>
              <span className="font-bold text-white">HydroNova</span>
            </div>
            <p className="text-white/50 text-sm">Del agua, vida. De la vida, innovación.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-3">Empresa</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#about" className="hover:text-agua-claro transition">Quiénes somos</a></li>
              <li><a href="#contact" className="hover:text-agua-claro transition">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Productos</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/catalog" className="hover:text-agua-claro transition">Catálogo</Link></li>
              <li><a href="#about" className="hover:text-agua-claro transition">Garantía</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-3">Contacto</h4>
            <p className="text-sm text-white/60 mb-2">📧 hydronova166@gmail.com</p>
            <p className="text-sm text-white/60">📍 Medellín, Colombia</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-agua-claro/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/40">
          <span>© 2026 HydroNova — Medellín, Colombia</span>
          <span>Hecho con ♥ por Jantevis Johanna Aguirre</span>
        </div>
      </div>
    </footer>
  );
};