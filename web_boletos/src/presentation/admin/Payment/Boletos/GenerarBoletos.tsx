
const handlePago = async () => {
  const payload = {
    usuarioId: 1, // ← temporalmente fijo
    eventoId,
    zonaId,
    asientosSeleccionados,
    precioAsiento,
    total,
  };

  try {
    const res = await fetch("https://localhost:7082/api/Boleto/Generar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Error al generar boletos");

    const data = await res.json();
    console.log("✅ Boletos generados:", data.boletos);

    alert("Boletos generados exitosamente 🎟️");
    navigate("/confirmacion", { state: { boletos: data.boletos } });
  } catch (err) {
    console.error(err);
    alert("❌ No se pudieron generar los boletos");
  }
};
