import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Edit, Visibility } from "@mui/icons-material";

interface Payment {
  id: number;
  pagoId: number;       
  boletoId: number;
  codigoQR: string;
  numeroAsiento: string;
  fechaPago: string;
}

const PaymentHistory: React.FC = () => {

    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    // 🔹 Obtener payments desde API
    const obtenerPayments = async () => {
      try {
        const response = await fetch("https://localhost:7082/ObtenerHistorialdePagos");
        if (!response.ok) throw new Error("Error al obtener payments");
        const data = await response.json();
        setPayments(data);
        console.log("Datos de payments:", data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      obtenerPayments();
    },
    []);

    const handleOpenDialog = (payments?: Payment) => {

    };

      // 🔹 Filtrado de pagos
    const filteredPayments = payments.filter((p) =>
        p.id.toString().includes(search.toLowerCase())
    );

    return (
    <Box sx={{ p: 3 }}>

      <Typography variant="h4" gutterBottom>
        🏟️ Listado de Pagos
      </Typography>

      {/* Tabla de zonas */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          {loading ? (
            <Typography>Historial de pagos...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>ID de Pago</TableCell>
                  <TableCell>ID de Boleto</TableCell>
                  <TableCell>Código QR</TableCell>
                  <TableCell>Número de Asiento</TableCell>
                  <TableCell align="center">Fecha de Pago</TableCell>
                  <TableCell align="center">Detalles</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                    {filteredPayments.map((payments) => (
                        <TableRow key={payments.id}>
                        <TableCell>{payments.id}</TableCell>
                        <TableCell>{payments.pagoId}</TableCell>
                        <TableCell>{payments.boletoId}</TableCell>
                        <TableCell>{payments.codigoQR}</TableCell>
                        <TableCell>{payments.numeroAsiento}</TableCell>
                        <TableCell align="center">
                            {payments.fechaPago}
                        </TableCell>
                        <TableCell align="center">
                            <IconButton color="primary" onClick={() => handleOpenDialog(payments)}>
                                <Visibility />
                            </IconButton>
                        </TableCell>
                        </TableRow>
                    ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

    </Box>
    );
};

export default PaymentHistory;