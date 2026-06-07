import { useNavigate } from 'react-router-dom';

export const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const precioFinal = product.precioOferta || product.precio;
  const descuento = product.precioOferta ? 
    Math.round((1 - product.precioOferta / product.precio) * 100) : 0;

  return (
    <div className="bg-white/5 border border-agua-claro/20 rounded-2xl overflow-hidden hover:border-agua-claro/50 transition transform hover:-translate-y-2 group">
      <div 
        className="relative h-48 bg-gradient-to-br from-verde-vivo/20 to-agua-vivo/20 overflow-hidden cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
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

      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-2">{product.nombre}</h3>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-2xl font-bold text-agua-claro">
            ${precioFinal.toLocaleString('es-CO')}
          </span>
          {product.precioOferta && (
            <span className="text-white/40 line-through text-sm">
              ${product.precio.toLocaleString('es-CO')}
            </span>
          )}
        </div>
        <div className="text-xs text-white/50 mb-3">
          {product.unidadMedida || 'unidad'} | Stock: {product.stock}
        </div>
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