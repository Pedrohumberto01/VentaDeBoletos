import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)

  const navigate = useNavigate() // 👈 Hook para navegar

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (username === "admin" && password === "1234") {
      alert("✅ Bienvenido al sistema de boletos")
      navigate("/dashboard") // 👈 Navega al dashboard
    } else {
      alert("❌ Usuario o contraseña incorrectos")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-3xl shadow-lg flex max-w-4xl w-full overflow-hidden">
        {/* Imagen de béisbol */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://www.el19digital.com/files/articulos/381504.jpg"
            alt="Béisbol"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Formulario */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-500">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
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

            {/* Password */}
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

            {/* Remember Me */}
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

            {/* Botón Sign In */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition"
            >
              Sign In
            </button>

            {/* Enlaces de ayuda y registro */}
            <div className="flex flex-col items-center mt-4 text-sm text-gray-600 space-y-1">
              <a href="#" className="hover:underline">
                Need help signing in?
              </a>
              <span>
                Don't have an account?{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  Sign up
                </a>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
