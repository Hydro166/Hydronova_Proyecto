import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import * as productService from '../services/productService';
import Swal from 'sweetalert2';

export const Home = () => {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await productService.getProducts({ limit: 3 });
      setFeaturedProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-agua-deep via-agua-mid to-verde-deep pt-16">
      
      {/* ===== HERO SECTION ===== */}
      <div className="relative min-h-screen flex items-center overflow-hidden">
        
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-verde-vivo rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-agua-vivo rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://res.cloudinary.com/dceo7bqhd/image/upload/v1779585635/6_eejp4c.jpg" 
            alt="Microgreens" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 bg-agua-claro/10 border border-agua-claro/30 px-3 py-1 sm:px-4 sm:py-2 rounded-full">
                <span className="text-agua-claro text-xs sm:text-sm font-semibold">Cultivos 100% Hidropónicos</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                Nutrición que <br/>
                <span className="bg-gradient-to-r from-verde-claro to-agua-claro bg-clip-text text-transparent">
                  nace del agua
                </span>
              </h1>

              <p className="text-white/65 text-base sm:text-lg md:text-xl leading-relaxed">
                Productos frescos, orgánicos y sostenibles cultivados con tecnología hidropónica en Medellín. 
                Llevamos la innovación del campo directamente a tu mesa.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 sm:pt-8">
                <Link 
                  to="/catalog"
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white font-bold rounded-full text-center hover:shadow-2xl transition transform hover:-translate-y-1"
                >
                  Ver productos
                </Link>
                <button
                  onClick={() => document.getElementById('quienes-somos').scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3 sm:px-8 sm:py-4 border-2 border-agua-claro text-agua-claro font-bold rounded-full hover:bg-agua-claro/10 transition"
                >
                  Conocer más
                </button>
              </div>

              <div className="flex flex-wrap gap-6 sm:gap-8 pt-8 sm:pt-12 border-t border-agua-claro/20">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-agua-claro">100%</div>
                  <div className="text-white/50 text-xs sm:text-sm">Orgánico Certificado</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-agua-claro">5+</div>
                  <div className="text-white/50 text-xs sm:text-sm">Productos Disponibles</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-agua-claro">Medellín</div>
                  <div className="text-white/50 text-xs sm:text-sm">Colombia</div>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-center items-center">
              <img 
                src="https://res.cloudinary.com/dceo7bqhd/image/upload/v1779585635/7_p7g4a7.jpg" 
                alt="Cultivo hidropónico"
                className="rounded-2xl shadow-2xl border border-agua-claro/30 w-full max-w-md object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== QUIÉNES SOMOS ===== */}
      <section id="quienes-somos" className="py-16 sm:py-20 bg-gradient-to-b from-transparent via-agua-deep to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-agua-claro text-xs sm:text-sm font-bold uppercase mb-2">Quiénes Somos</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Una empresa nacida de la <span className="text-agua-claro">pasión por la vida</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
            <div className="order-2 lg:order-1">
              <img 
                src="https://res.cloudinary.com/dceo7bqhd/image/upload/v1779585636/8_hrqmo0.jpg" 
                alt="Sistema hidropónico"
                className="rounded-2xl shadow-xl border border-agua-claro/20 w-full"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-4 sm:space-y-6">
              <p className="text-white/65 text-sm sm:text-base leading-relaxed">
                HydroNova es una empresa medellinense dedicada al cultivo y comercialización de productos hidropónicos 
                de alta calidad. Nacimos con la visión de revolucionar la forma en que las personas acceden a alimentos 
                frescos y nutritivos.
              </p>
              <p className="text-white/65 text-sm sm:text-base leading-relaxed">
                Nuestro sistema de cultivo sin tierra utiliza soluciones nutritivas precisas y controladas, lo que nos 
                permite producir alimentos más nutritivos, con menor uso de agua y sin pesticidas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white/5 border border-verde-claro/30 rounded-2xl p-6 sm:p-8 hover:border-verde-claro/50 transition">
              <h3 className="text-xl sm:text-2xl font-bold text-verde-claro mb-3 sm:mb-4">Misión</h3>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                Ofrecer productos hidropónicos frescos, nutritivos y sostenibles que mejoren la calidad de vida de 
                nuestros clientes, promoviendo hábitos de alimentación saludable en Colombia.
              </p>
            </div>

            <div className="bg-white/5 border border-agua-claro/30 rounded-2xl p-6 sm:p-8 hover:border-agua-claro/50 transition">
              <h3 className="text-xl sm:text-2xl font-bold text-agua-claro mb-3 sm:mb-4">Visión</h3>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                Ser la empresa líder en cultivos hidropónicos de Colombia para 2030, expandiendo nuestra presencia a 
                nivel nacional e internacional con tecnología innovadora y productos de clase mundial.
              </p>
            </div>

            <div className="bg-white/5 border border-dorado/30 rounded-2xl p-6 sm:p-8 hover:border-dorado/50 transition">
              <h3 className="text-xl sm:text-2xl font-bold text-dorado mb-3 sm:mb-4">Valores</h3>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                Sostenibilidad, innovación, calidad y compromiso con el bienestar de nuestros clientes y el planeta 
                son los pilares que guían cada decisión en HydroNova.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POR QUÉ ELEGIRNOS ===== */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-transparent via-verde-deep/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-verde-claro text-xs sm:text-sm font-bold uppercase mb-2">Ventajas</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">¿Por qué elegirnos?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white/5 border border-agua-claro/20 rounded-xl p-4 sm:p-6 hover:border-agua-claro/50 hover:-translate-y-2 transition">
              <h3 className="text-lg sm:text-xl font-bold text-agua-claro mb-2">Ahorro Hídrico</h3>
              <p className="text-white/60 text-xs sm:text-sm">Hasta 90% menos agua vs. agricultura tradicional</p>
            </div>
            <div className="bg-white/5 border border-agua-claro/20 rounded-xl p-4 sm:p-6 hover:border-agua-claro/50 hover:-translate-y-2 transition">
              <h3 className="text-lg sm:text-xl font-bold text-agua-claro mb-2">Sin Pesticidas</h3>
              <p className="text-white/60 text-xs sm:text-sm">100% libres de químicos nocivos</p>
            </div>
            <div className="bg-white/5 border border-agua-claro/20 rounded-xl p-4 sm:p-6 hover:border-agua-claro/50 hover:-translate-y-2 transition">
              <h3 className="text-lg sm:text-xl font-bold text-agua-claro mb-2">Cosecha Rápida</h3>
              <p className="text-white/60 text-xs sm:text-sm">2x más rápido que siembra tradicional</p>
            </div>
            <div className="bg-white/5 border border-agua-claro/20 rounded-xl p-4 sm:p-6 hover:border-agua-claro/50 hover:-translate-y-2 transition">
              <h3 className="text-lg sm:text-xl font-bold text-agua-claro mb-2">Entrega Fresca</h3>
              <p className="text-white/60 text-xs sm:text-sm">Cosechamos y entregamos el mismo día</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTOS DESTACADOS ===== */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
            <div>
              <p className="text-agua-claro text-xs sm:text-sm font-bold uppercase mb-2">Catálogo</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Lo mejor de la <span className="text-agua-claro">naturaleza</span>
              </h2>
            </div>
            <Link to="/catalog" className="text-agua-claro hover:text-agua-claro/70 font-semibold text-sm">
              Ver catálogo completo →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agua-claro"></div>
                <span className="text-white/60">Cargando productos...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(product => (
                <div key={product.id} className="bg-white/5 border border-agua-claro/20 rounded-xl overflow-hidden hover:border-agua-claro/50 hover:-translate-y-2 transition group">
                  <div className="h-48 bg-gradient-to-br from-verde-vivo/20 to-agua-vivo/20 overflow-hidden">
                    <img 
                      src={product.imagenUrl} 
                      alt={product.nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-2 line-clamp-2">{product.nombre}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl sm:text-2xl font-bold text-agua-claro">
                        ${(product.precioOferta || product.precio).toLocaleString('es-CO')}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition text-sm"
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
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-verde-deep via-agua-deep to-verde-deep">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            ¿Listo para comer <span className="text-verde-claro">más saludable</span>?
          </h2>
          <p className="text-white/65 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Regístrate hoy y accede a nuestro catálogo completo de productos hidropónicos frescos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white font-bold rounded-full hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              Crear cuenta gratis
            </Link>
            <Link
              to="/catalog"
              className="px-6 py-3 sm:px-8 sm:py-4 border-2 border-agua-claro text-agua-claro font-bold rounded-full hover:bg-agua-claro/10 transition"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};