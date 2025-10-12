import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../modal/Modal"; // 🔹 Importa el modal

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const datos = { email: username, contrasenia: password };

    try {
      const response = await fetch(
        "https://localhost:7082/api/Auth/VerificarCredenciales",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "text/plain",
          },
          body: JSON.stringify(datos),
        }
      );

      if (!response.ok) throw new Error(`Error en la petición: ${response.status}`);

      const resultado = await response.text();

      // Mostrar modal según respuesta
      switch (resultado) {
        case "admin":
          setModalMessage("✅ Bienvenido al sistema de boletos");
          setShowModal(true);
          setTimeout(() => navigate("/dashboard"), 1500); // redirige después de 1.5s
          break;
        case "cliente":
          setModalMessage("✅ Bienvenido Cliente");
          setShowModal(true);
          setTimeout(() => navigate("/client"), 1500);
          break;
        case "no_existe":
          setModalMessage("❌ Usuario o contraseña incorrectos");
          setShowModal(true);
          break;
        default:
          setModalMessage("❌ Error desconocido");
          setShowModal(true);
          break;
      }
    } catch (error) {
      console.error("Error al verificar credenciales:", error);
      setModalMessage("❌ Error al conectar con el servidor");
      setShowModal(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-3xl shadow-lg flex max-w-4xl w-full overflow-hidden">
        {/* Imagen */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://www.el19digital.com/files/articulos/381504.jpg"
            alt="Béisbol"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Formulario */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-500">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                id="remember"
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
              />
              <label htmlFor="remember" className="text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
