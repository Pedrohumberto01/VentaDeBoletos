import { useLocation } from "react-router-dom";

export default function PagoExitoso() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const qrs = params.get("qrs")?.split(",") || [];

  return (
    <div>
      <h2>Pago exitoso 🎉</h2>
      <p>Estos son tus códigos QR:</p>
      <ul>
        {qrs.map((qr) => (
          <li key={qr}>{qr}</li>
        ))}
      </ul>
    </div>
  );
}
