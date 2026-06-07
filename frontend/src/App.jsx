import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Paginas publicas
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Contacto } from './pages/Contacto';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';

// Paginas privadas
import { Account } from './pages/Account';

// Paginas de administracion
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/Products';
import { AdminOrders } from './pages/admin/Orders';
import { AdminUsers, AdminMessages } from './pages/admin/UsersMessages';

// Componente AdminNav (menú lateral)
const AdminNav = () => {
  const { logout } = useAuth();
  
  return (
    <nav className="fixed left-0 top-16 bottom-0 w-64 bg-gradient-to-b from-agua-deep to-verde-deep border-r border-agua-claro/20 overflow-y-auto z-40">
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Link to="/admin" className="block px-4 py-3 rounded-lg text-white/75 hover:text-agua-claro hover:bg-white/10 transition">Dashboard</Link>
          <Link to="/admin/products" className="block px-4 py-3 rounded-lg text-white/75 hover:text-agua-claro hover:bg-white/10 transition">Productos</Link>
          <Link to="/admin/orders" className="block px-4 py-3 rounded-lg text-white/75 hover:text-agua-claro hover:bg-white/10 transition">Ordenes</Link>
          <Link to="/admin/users" className="block px-4 py-3 rounded-lg text-white/75 hover:text-agua-claro hover:bg-white/10 transition">Usuarios</Link>
          <Link to="/admin/messages" className="block px-4 py-3 rounded-lg text-white/75 hover:text-agua-claro hover:bg-white/10 transition">Mensajes</Link>
        </div>
        <div className="border-t border-agua-claro/20 pt-6">
          <Link to="/" className="block px-4 py-3 rounded-lg text-white/75 hover:text-agua-claro hover:bg-white/10 transition">Ver sitio</Link>
          <button onClick={logout} className="w-full text-left px-4 py-3 mt-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition">Cerrar Sesion</button>
        </div>
      </div>
    </nav>
  );
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.email !== 'admin@hydronova.com') return <Navigate to="/" replace />;
  
  return children;
};

const AdminLayout = ({ children }) => (
  <div className="flex min-h-screen bg-gradient-to-br from-agua-deep via-agua-mid to-verde-deep">
    <AdminNav />
    <div className="flex-1 ml-64 p-8 pt-24">{children}</div>
  </div>
);

export default function App() {
  const { verifyToken } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    }
  }, [verifyToken]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/account" element={<Account />} />
            
            <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
            <Route path="/admin/messages" element={<AdminRoute><AdminLayout><AdminMessages /></AdminLayout></AdminRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}