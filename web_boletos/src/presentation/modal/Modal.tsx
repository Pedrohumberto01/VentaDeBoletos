

interface ModalProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export default function Modal({ show, message, onClose }: ModalProps) {
  if (!show) return null; // No renderiza nada si show es false

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h3 className="text-xl font-semibold mb-4">Mensaje</h3>
        <p className="mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
