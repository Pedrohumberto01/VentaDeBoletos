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
  TablePagination,
  TextField,
} from "@mui/material";
import QRCode from "react-qr-code";

interface Payment {
  id: number;
  pagoId: number;
  boletoId: number;
  codigoQR: string;
  numeroAsiento: string;
  fechaPago: string;
  idUsuario: number;
}

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  const [back, setBack] = useState("#FFFFFF");
  const [fore, setFore] = useState("#000000");
  const [size, setSize] = useState(54);

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
  }, []);

  // 🔹 Filtrado de pagos
  const filteredPayments = payments.filter((p) =>
    p.id.toString().includes(search.toLowerCase()) ||
    p.numeroAsiento.toLowerCase().includes(search.toLowerCase()) ||
    p.fechaPago.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Datos paginados
  const paginatedPayments = filteredPayments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // 🔹 Cambiar página
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // 🔹 Cambiar cantidad de filas
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🏟️ Listado de Pagos
      </Typography>

      {/* 🔍 Filtro */}
      <TextField
        label="Buscar pago..."
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por ID, asiento o fecha..."
      />

      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          {loading ? (
            <Typography>Historial de pagos...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>ID de Pago</TableCell>
                    <TableCell>ID de Boleto</TableCell>
                    <TableCell>Código QR</TableCell>
                    <TableCell>Número de Asiento</TableCell>
                    <TableCell align="center">Fecha de Pago</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPayments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.id}</TableCell>
                      <TableCell>{p.pagoId}</TableCell>
                      <TableCell>{p.boletoId}</TableCell>
                      <TableCell>
                        <QRCode
                          title="QRCode"
                          value={
                            "https://localhost:7082/client/pago_exitoso?id=" +
                            p.pagoId +
                            "Codigo absoluto=" +
                            p.codigoQR +
                            "&BoletoId=" +
                            p.boletoId +
                            "&NumeroAsiento=" +
                            p.numeroAsiento +
                            "&FechaPago=" +
                            p.fechaPago +
                            "&idUsuario=" +
                            p.idUsuario
                          }
                          bgColor={back}
                          fgColor={fore}
                          size={size === 1 ? 0 : size}
                        />
                      </TableCell>
                      <TableCell>{p.numeroAsiento}</TableCell>
                      <TableCell align="center">{p.fechaPago}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* 🔹 Paginación */}
              <TablePagination
                component="div"
                count={filteredPayments.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página"
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentHistory;
