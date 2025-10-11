import { useLocation, useNavigate } from "react-router-dom";

export default function PagoBoletos() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventoId, zona, boletos } = location.state || {};

  const confirmarPago = () => {
    alert(`✅ Pago confirmado para ${boletos.length} boletos en zona ${zona}`);
    navigate("/client"); // Redirigir al inicio o a otra vista
  };

  if (!boletos || boletos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          No hay boletos seleccionados 😅
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          💳 Confirmar compra
        </h2>

        <p className="text-gray-700 mb-2">
          <strong>Evento ID:</strong> {eventoId}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Zona:</strong> {zona}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Boletos:</strong> {boletos.join(", ")}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={confirmarPago}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
          >
            Confirmar pago
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
