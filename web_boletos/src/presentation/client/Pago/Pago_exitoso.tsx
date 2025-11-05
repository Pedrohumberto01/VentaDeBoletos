import React, { useRef } from "react";
import QRCode from "react-qr-code";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PagoExitoso() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const qrs = params.get("codigosQR")?.split(",") || [];

  const boletoContainerRef = useRef<HTMLDivElement>(null);

  const back = "#ffffff";
  const fore = "#000000";
  const qrSize = 128;

  const downloadPDF = async () => {
    if (!boletoContainerRef.current) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    const boletos = boletoContainerRef.current.querySelectorAll(".boleto-card");

    let x = margin;
    let y = margin;
    const spacing = 10;

    for (let i = 0; i < boletos.length; i++) {
      const boleto = boletos[i] as HTMLElement;

      const canvas = await html2canvas(boleto, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;

      if (y + imgHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }

      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      y += imgHeight + spacing;
    }

    pdf.save("Boletos.pdf");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#2E7D32" }}>¡Pago exitoso! 🎉</h2>
      <p style={{ textAlign: "center" }}>Estos son tus boletos con sus códigos QR:</p>

      <div
        ref={boletoContainerRef}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginTop: "20px",
          width: "100%",
          alignItems: "center",
        }}
      >
        {qrs.map((codigo, idx) => (
          <div
            key={codigo}
            className="boleto-card"
            style={{
              border: "2px solid #2E7D32",
              borderRadius: "12px",
              padding: "15px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              backgroundColor: "#f1f8e9",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              width: "600px",
            }}
          >
            {/* Contenedor horizontal para QR y mensaje */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <QRCode
                title="Boleto QR"
                value={codigo}
                bgColor={back}
                fgColor={fore}
                size={qrSize}
              />
              <p
                style={{
                  margin: "0 0 5px 0",
                  wordBreak: "break-word",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                {codigo}
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>Boleto #{idx + 1}</p>
            </div>

            {/* Información del boleto */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
              
              <span style={{ marginTop: "5px", fontSize: "14px", color: "#d32f2f", textAlign: "center" }}>
                Boleto digital, este código QR es su entrada al evento. valido solo para el día del evento. no lo pierdas.
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={downloadPDF}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#2E7D32",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Descargar boletos en PDF
        </button>
      </div>
    </div>
  );
}
