import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Swal from 'sweetalert2';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: 'Vegetales',
    unidadMedida: 'unidad',
    imagenUrl: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/admin/products/${editing}`, formData);
        Swal.fire({ icon: 'success', title: 'Actualizado', background: '#042533', color: '#fff' });
      } else {
        await api.post('/admin/products', formData);
        Swal.fire({ icon: 'success', title: 'Creado', background: '#042533', color: '#fff' });
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ nombre: '', descripcion: '', precio: '', stock: '', categoria: 'Vegetales', unidadMedida: 'unidad', imagenUrl: '' });
      loadProducts();
    } catch (error) {
      console.error('Error detallado:', error);
      Swal.fire({ 
        icon: 'error', 
        title: 'Error', 
        text: error?.response?.data?.error || 'No se pudo guardar', 
        background: '#042533', 
        color: '#fff' 
      });
    }
  };

  const handleEdit = (product) => {
    setEditing(product.id);
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion || '',
      precio: product.precio,
      stock: product.stock,
      categoria: product.categoria || 'Vegetales',
      unidadMedida: product.unidadMedida || 'unidad',
      imagenUrl: product.imagenUrl || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      icon: 'warning',
      background: '#042533',
      color: '#fff',
      showCancelButton: true,
      confirmButtonColor: '#1a9e52'
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/products/${id}`);
        Swal.fire({ icon: 'success', title: 'Eliminado', background: '#042533', color: '#fff' });
        loadProducts();
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar', background: '#042533', color: '#fff' });
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agua-claro"></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Gestión de Productos</h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setFormData({ nombre: '', descripcion: '', precio: '', stock: '', categoria: 'Vegetales', unidadMedida: 'unidad', imagenUrl: '' }); }} className="px-6 py-3 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white font-bold rounded-lg">
          Nuevo Producto
        </button>
      </div>

      {showForm && (
        <div className="bg-white/5 border border-agua-claro/20 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">{editing ? 'Editar' : 'Crear'} Producto</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-2 text-white" required />
            <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} rows="3" className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-2 text-white"></textarea>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" name="precio" placeholder="Precio" value={formData.precio} onChange={handleChange} className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-2 text-white" required />
              <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-2 text-white" required />
            </div>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="bg-agua-deep border border-agua-claro/30 rounded-lg px-4 py-2 text-white w-full"
            >
              <option value="Vegetales" className="text-white">Vegetales</option>
              <option value="Hierbas" className="text-white">Hierbas</option>
              <option value="Combos" className="text-white">Combos</option>
              <option value="Superfoods" className="text-white">Superfoods</option>
            </select>
            <select
              name="unidadMedida"
              value={formData.unidadMedida}
              onChange={handleChange}
              className="bg-agua-deep border border-agua-claro/30 rounded-lg px-4 py-2 text-white w-full"
            >
              <option value="unidad">Unidad</option>
              <option value="manojo">Manojo</option>
              <option value="100g">100 gramos</option>
              <option value="200g">200 gramos</option>
              <option value="500g">500 gramos</option>
              <option value="kg">Kilogramo</option>
              <option value="paquete">Paquete</option>
            </select>
            <input type="text" name="imagenUrl" placeholder="URL de Imagen (Cloudinary)" value={formData.imagenUrl} onChange={handleChange} className="w-full bg-white/10 border border-agua-claro/30 rounded-lg px-4 py-2 text-white" />
            {formData.imagenUrl && <img src={formData.imagenUrl} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />}
            <div className="flex gap-4 pt-4">
              <button type="submit" className="px-6 py-2 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white rounded-lg">Guardar</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border border-agua-claro text-agua-claro rounded-lg">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white/5 border border-agua-claro/20 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-white">Nombre</th>
              <th className="px-6 py-4 text-left text-white">Unidad</th>
              <th className="px-6 py-4 text-left text-white">Precio</th>
              <th className="px-6 py-4 text-left text-white">Stock</th>
              <th className="px-6 py-4 text-left text-white">Categoría</th>
              <th className="px-6 py-4 text-left text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-t border-agua-claro/20">
                <td className="px-6 py-4 text-white/60">{product.nombre}</td>
                <td className="px-6 py-4 text-white/60">{product.unidadMedida || 'unidad'}</td>
                <td className="px-6 py-4 text-agua-claro">${product.precio.toLocaleString('es-CO')}</td>
                <td className="px-6 py-4 text-white/60">{product.stock}</td>
                <td className="px-6 py-4 text-white/60">{product.categoria}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleEdit(product)} className="text-agua-claro mr-3">Editar</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-400">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};