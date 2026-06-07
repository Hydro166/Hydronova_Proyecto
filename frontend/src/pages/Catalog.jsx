import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import * as productService from '../services/productService';
import Swal from 'sweetalert2';

export const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['Todos']);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (selectedCategory !== 'Todos') {
        filters.categoria = selectedCategory;
      }
      const response = await productService.getProducts(filters);
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await productService.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Sin stock',
        text: `${product.nombre} no está disponible`,
        background: '#042533',
        color: '#ffffff',
        confirmButtonColor: '#1a9e52'
      });
      return;
    }

    addToCart(product, 1);
    Swal.fire({
      icon: 'success',
      title: 'Agregado',
      text: `${product.nombre} fue agregado al carrito`,
      timer: 2000,
      showConfirmButton: false,
      background: '#042533',
      color: '#ffffff'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-agua-deep via-agua-mid to-verde-deep pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Nuestros Productos</h1>
        <p className="text-white/65 mb-8">Productos hidropónicos frescos, cultivados sin pesticidas</p>

        <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-verde-vivo to-agua-vivo text-white'
                  : 'bg-white/10 text-white/75 hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agua-claro"></div>
              <span className="text-white/60">Cargando productos...</span>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-12 text-center">
            <p className="text-white/60">No hay productos en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white/5 border border-agua-claro/20 rounded-xl overflow-hidden hover:border-agua-claro/50 transition group">
                <div 
                  className="h-48 bg-gradient-to-br from-verde-vivo/20 to-agua-vivo/20 cursor-pointer overflow-hidden"
                  onClick={() => window.location.href = `/product/${product.id}`}
                >
                  <img 
                    src={product.imagenUrl} 
                    alt={product.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">{product.nombre}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-agua-claro">
                        ${(product.precioOferta || product.precio).toLocaleString('es-CO')}
                      </span>
                      <p className="text-white/40 text-xs">por {product.unidadMedida || 'unidad'}</p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="px-4 py-2 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};