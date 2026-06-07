import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

export const Cart = () => {
  const { items, total, updateQuantity, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-agua-deep via-agua-mid to-verde-deep pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-12">
            <p className="text-white/60 mb-4">Tu carrito está vacío</p>
            <Link to="/catalog" className="px-6 py-3 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white rounded-lg">
              Ver productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-agua-deep via-agua-mid to-verde-deep pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        
        <h1 className="text-4xl font-bold text-white mb-8">Mi Carrito</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white/5 border border-agua-claro/20 rounded-xl p-4 flex gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-verde-vivo/20 to-agua-vivo/20 rounded-lg flex items-center justify-center text-2xl">
                  <img src={item.imagenUrl} alt={item.nombre} className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{item.nombre}</h3>
                  <p className="text-agua-claro font-bold">${item.precio.toLocaleString('es-CO')}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.cantidad - 1)}
                      className="px-2 py-1 bg-white/10 rounded"
                    >-</button>
                    <span className="text-white">{item.cantidad}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.cantidad + 1)}
                      className="px-2 py-1 bg-white/10 rounded"
                    >+</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">${(item.precio * item.cantidad).toLocaleString('es-CO')}</p>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="text-white/40 text-sm mt-2"
                  >Eliminar</button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-agua-claro/20 rounded-xl p-6 h-fit">
            <h2 className="text-xl font-bold text-white mb-4">Resumen</h2>
            <div className="flex justify-between text-white/60 mb-2">
              <span>Subtotal</span>
              <span>${total.toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between text-white/60 mb-4">
              <span>Envío</span>
              <span className="text-verde-claro">Gratis</span>
            </div>
            <div className="border-t border-agua-claro/20 pt-4 mb-6">
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span className="text-agua-claro">${total.toLocaleString('es-CO')}</span>
              </div>
            </div>
            <Link to="/checkout" className="block w-full py-3 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white font-bold rounded-lg text-center">
              Proceder al pago
            </Link>
            <Link to="/catalog" className="block w-full py-3 text-agua-claro text-center mt-3">
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};