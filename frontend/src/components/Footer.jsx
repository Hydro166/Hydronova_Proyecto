import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-agua-deep via-verde-deep to-agua-deep border-t border-agua-claro/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold text-white">
                Hydro<span className="text-agua-claro">Nova</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Del agua, vida. De la vida, innovación. Cultivamos el futuro de la alimentación saludable en Colombia.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#quienes-somos" className="text-white/60 hover:text-agua-claro transition">
                  Quiénes somos
                </a>
              </li>
              <li>
                <Link to="/contacto" className="text-white/60 hover:text-agua-claro transition">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Productos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/catalog" className="text-white/60 hover:text-agua-claro transition">
                  Catálogo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Mi cuenta</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="text-white/60 hover:text-agua-claro transition">
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-white/60 hover:text-agua-claro transition">
                  Registrarse
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-white/60 hover:text-agua-claro transition">
                  Mi carrito
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-white/60 hover:text-agua-claro transition">
                  Mis pedidos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-agua-claro/10 pt-8 text-center text-white/40 text-xs">
          <span>© 2026 HydroNova — Medellín, Colombia</span>
        </div>
      </div>
    </footer>
  );
};