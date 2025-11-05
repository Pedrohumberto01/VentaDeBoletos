import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Box, Typography, Button, Card, CardContent, Divider } from "@mui/material";

export default function ConfirmacionBoletos() {
  const location = useLocation();
  const navigate = useNavigate();
  const boletoContainerRef = useRef<HTMLDivElement>(null);

  // recibimos los boletos desde el estado del navigate
  const { boletos } = (location.state as { boletos: any[] }) || { boletos: [] };

  const downloadPDF = async () => {
    if (!boletoContainerRef.current) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const spacing = 10;

    const boletoElements = boletoContainerRef.current.querySelectorAll(".boleto-card");
    let y = margin;

    for (let i = 0; i < boletoElements.length; i++) {
      const boletoEl = boletoElements[i] as HTMLElement;
      const canvas = await html2canvas(boletoEl, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;

      if (y + imgHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }

      pdf.addImage(imgData, "PNG", margin, y, imgWidth, imgHeight);
      y += imgHeight + spacing;
    }

    pdf.save("Boletos.pdf");
  };

  if (!boletos || boletos.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h6" color="error">
          ❌ No se encontraron boletos para mostrar.
        </Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }} variant="outlined">
          Volver
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" textAlign="center" color="primary">
        ¡Pago exitoso! 🎉
      </Typography>
      <Typography textAlign="center" sx={{ mb: 4 }}>
        Estos son tus boletos, cada código QR es tu entrada digital al evento.
      </Typography>

      <Box
        ref={boletoContainerRef}
        sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}
      >
        {boletos.map((b) => (
          <Card key={b.id} className="boleto-card" sx={{ maxWidth: 600, width: "100%", boxShadow: 3 }}>
            <CardContent sx={{ display: "flex", gap: 3 }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <QRCode value={b.codigoQR} size={128} />
                <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                  {b.codigoQR}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
                <Typography variant="body1">
                  <strong>Evento ID:</strong> {b.eventoId}
                </Typography>
                <Typography variant="body1">
                  <strong>Zona ID:</strong> {b.zonaId}
                </Typography>
                <Typography variant="body1">
                  <strong>Asiento:</strong> {b.asiento.numeroAsiento}
                </Typography>
                <Typography variant="body1">
                  <strong>Precio:</strong> ${b.precio}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  Este boleto es digital y válido solo para el día del evento. ¡No lo pierdas!
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button onClick={downloadPDF} variant="contained" color="primary" size="large">
          Descargar boletos en PDF
        </Button>
      </Box>
    </Box>
  );
}
