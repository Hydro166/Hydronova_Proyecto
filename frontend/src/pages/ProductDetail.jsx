import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import * as productService from '../services/productService';
import Swal from 'sweetalert2';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProduct(id);
      setProduct(response);
    } catch (error) {
      console.error('Error loading product:', error);
      Swal.fire({
        icon: 'error',
        title: 'Producto no encontrado',
        text: 'El producto que buscas no existe',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      }).then(() => navigate('/catalog'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Sin stock',
        text: 'Este producto no está disponible en este momento',
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      });
      return;
    }

    addToCart(product, quantity);
    Swal.fire({
      icon: 'success',
      title: 'Agregado',
      text: `${product.nombre} x${quantity} agregado al carrito`,
      timer: 2000,
      showConfirmButton: false,
      background: '#042533',
      color: '#ffffff'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-agua-deep via-agua-mid to-verde-deep pt-24 pb-16 flex items-center justify-center">
        <div className="inline-flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agua-claro"></div>
          <span className="text-white/60">Cargando producto...</span>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-agua-deep via-agua-mid to-verde-deep pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate(-1)} className="text-agua-claro hover:text-agua-claro/70 text-sm font-semibold mb-8">
          ← Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Imagen */}
          <div className="flex items-center justify-center">
            <div className="w-full h-96 bg-gradient-to-br from-verde-vivo/20 to-agua-vivo/20 rounded-2xl border border-agua-claro/20 flex items-center justify-center overflow-hidden">
              <img
                src={product.imagenUrl}
                alt={product.nombre}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Información */}
          <div className="space-y-6">
            <div>
              <p className="text-agua-claro text-sm font-bold uppercase mb-2">{product.categoria}</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{product.nombre}</h1>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-agua-claro">
                  ${(product.precioOferta || product.precio).toLocaleString('es-CO')}
                </span>
                {product.precioOferta && (
                  <span className="text-2xl text-white/40 line-through">
                    ${product.precio.toLocaleString('es-CO')}
                  </span>
                )}
              </div>
              <p className="text-white/60">Precio por {product.unidadMedida || 'unidad'}</p>
            </div>

            <div className="bg-white/5 border border-agua-claro/20 rounded-lg p-4">
              <p className="text-white/60 text-sm mb-2">Disponibilidad</p>
              {product.stock > 0 ? (
                <p className="text-verde-claro font-bold">{product.stock} unidades disponibles</p>
              ) : (
                <p className="text-red-400 font-bold">Producto agotado</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-3">Descripción</h3>
              <p className="text-white/65 leading-relaxed">{product.descripcion}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-verde-vivo/10 border border-verde-vivo/30 rounded-lg p-4">
                <p className="text-verde-claro font-bold text-sm">Hidrópónico</p>
                <p className="text-white/60 text-xs mt-1">Cultivo sin pesticidas</p>
              </div>
              <div className="bg-agua-vivo/10 border border-agua-vivo/30 rounded-lg p-4">
                <p className="text-agua-claro font-bold text-sm">Entrega Rápida</p>
                <p className="text-white/60 text-xs mt-1">24 horas en Medellín</p>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div>
                <label className="block text-white font-semibold mb-3">Cantidad</label>
                <div className="flex items-center border border-agua-claro/30 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-agua-claro hover:bg-agua-claro/10 transition"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center bg-transparent text-white border-l border-r border-agua-claro/30 py-3 focus:outline-none"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-3 text-agua-claro hover:bg-agua-claro/10 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full px-8 py-4 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 transition text-lg"
              >
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};