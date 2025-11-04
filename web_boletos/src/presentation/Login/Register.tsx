
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../modal/Modal"; // 🔹 Importa el modal

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalMessage, setModalMessage] = useState(""); 
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    setModalMessage("⚠️ Las contraseñas no coinciden");
    return;
  }

  const datos = {
    nombre,
    cedula,
    email: username,
    contrasenia: password,
    rol: "cliente",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch("https://localhost:7082/api/Usuarios/CrearUsuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(datos),
    });

    console.log("Enviado:", datos);

    if (!response.ok) throw new Error(`Error en la petición: ${response.status}`);

        const resultado = await response.json();
    console.log("Respuesta:", resultado);

    if (response.status === 201 && resultado.id) {
    setModalMessage("✅ Usuario creado exitosamente"); 
    navigate("/client"); 
    } else {
    setModalMessage("❌ Error al crear el usuario");
    }

  } catch (error) {
    console.error("Error al registrar usuario:", error);
    setModalMessage("❌ Error al conectar con el servidor");
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
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-500">Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Correo electronico</label>
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
              <label className="block text-sm font-medium mb-1">Cedula</label>
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Confirm Password"
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

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={modalMessage !== ""}
        message={modalMessage}
        onClose={() => setModalMessage("")}
      />
    </div>
  );
}       
