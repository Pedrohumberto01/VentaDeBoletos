import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import PagoImg from "../../../assets/estadio.webp"; // 💡 Usa una imagen que tengas en assets

export default function PagoBoletos() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventoId, zona, boletos } = location.state || {};

  // Campos del formulario
  const [nombre, setNombre] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [expiracion, setExpiracion] = useState("");
  const [cvv, setCvv] = useState("");

  // Validación y confirmación del pago
  const confirmarPago = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !tarjeta || !expiracion || !cvv) {
      alert("⚠️ Por favor, complete todos los campos del formulario.");
      return;
    }

    if (tarjeta.replace(/\s/g, "").length < 16) {
      alert("⚠️ El número de tarjeta debe tener al menos 16 dígitos.");
      return;
    }

    alert(`✅ Pago confirmado para ${boletos.length} boletos en zona ${zona}. ¡Gracias por su compra!`);
    navigate("/");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl">
        {/* 🖼️ Imagen lateral */}
        <div className="md:w-1/2 hidden md:block">
          <img
            src={PagoImg}
            alt="Pago de boletos"
            className="w-full h-full object-cover"
            style={{ objectFit: "cover",width:"100%", height:"100%", borderRadius:"10px", alignContent:"center"}}
          />
        </div>

        {/* 💳 Formulario de pago */}
        <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
            💳 Pago de boletos
          </h2>

          {/* Resumen del pedido */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm">
            <p className="text-gray-700 mb-1">
              <strong>Evento ID:</strong> {eventoId}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Zona:</strong> {zona}
            </p>
            <p className="text-gray-700">
              <strong>Boletos:</strong> {boletos.join(", ")}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={confirmarPago} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del titular
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Pedro Romero"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de tarjeta
              </label>
              <input
                type="text"
                value={tarjeta}
                onChange={(e) =>
                  setTarjeta(
                    e.target.value
                      .replace(/[^\d]/g, "")
                      .replace(/(.{4})/g, "$1 ")
                      .trim()
                  )
                }
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de expiración
                </label>
                <input
                  type="text"
                  value={expiracion}
                  onChange={(e) => setExpiracion(e.target.value)}
                  placeholder="MM/AA"
                  maxLength={5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  placeholder="123"
                  maxLength={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>
            </div>

            {/* Botones */}
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
            >
              Confirmar pago
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg shadow-sm transition"
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
