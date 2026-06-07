import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-agua-deep via-agua-mid to-verde-deep pt-24 pb-16 flex items-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-black text-agua-claro mb-4">404</h1>
          <p className="text-white/40 text-4xl font-bold">Página no encontrada</p>
        </div>

        <div className="space-y-6 mb-12">
          <p className="text-white/65 text-lg">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <div className="relative">
            <div className="text-8xl opacity-20 mb-4">🔍</div>
            <p className="text-white/60">
              Pero encontramos algunos productos que podrían interesarte...
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-verde-vivo to-agua-vivo text-white font-bold rounded-full hover:shadow-lg transition transform hover:-translate-y-1"
          >
            ← Ir al Inicio
          </button>
          <button
            onClick={() => navigate('/catalog')}
            className="px-8 py-4 border-2 border-agua-claro text-agua-claro font-bold rounded-full hover:bg-agua-claro/10 transition"
          >
            Ver Catálogo →
          </button>
        </div>

        <div className="mt-16 bg-white/5 border border-agua-claro/20 rounded-2xl p-8">
          <p className="text-white/60 text-sm mb-4">
            Error Code: <span className="text-agua-claro font-mono">ERR_404_HIDROPONIA_NO_ENCONTRADA</span>
          </p>
          <p className="text-white/40 text-xs">
            "El agua fluye hacia donde debe ir, pero esta página se perdió en el camino 💧"
          </p>
        </div>
      </div>
    </div>
  );
};