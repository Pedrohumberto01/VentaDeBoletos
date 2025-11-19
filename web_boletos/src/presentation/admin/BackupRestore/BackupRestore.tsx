import React, { useState } from "react";
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export default function BackupRestore() {
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState<"backup" | "restore" | null>(null);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);

  // Abrir modal
  const handleOpenDialog = (type: "backup" | "restore", file?: File) => {
    setActionType(type);
    if (file) setRestoreFile(file);
    setOpenDialog(true);
  };

  // Cerrar modal
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setActionType(null);
    setRestoreFile(null);
  };

  // Ejecutar acción confirmada
  const handleConfirmAction = async () => {
    setOpenDialog(false);

    if (actionType === "backup") {
      // Backup
      try {
        const response = await fetch("https://localhost:7082/api/Backup/backup");
        if (!response.ok) throw new Error("Error al generar el respaldo");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `backup_${new Date().toISOString()}.sql`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        alert("Respaldo generado   correctamente ✅");
      } catch (error: any) {
        console.error(error);
        alert("Error al generar el respaldo: " + error.message);
      }
    }

    if (actionType === "restore" && restoreFile) {
      // Restore
      const formData = new FormData();
      formData.append("file", restoreFile);

      try {
        const response = await fetch("https://localhost:7082/api/Backup/restauracion", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Error al restaurar la BD");
        }

        alert("Restauración completada con éxito ✅");
      } catch (error: any) {
        console.error(error);
        alert("Error al restaurar la BD: " + error.message);
      }
    }

    setRestoreFile(null);
    setActionType(null);
  };

  // Manejar selección de archivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleOpenDialog("restore", file);
    event.target.value = "";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        🛡️ Respaldo y Restauración de Base de Datos
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" color="success" onClick={() => handleOpenDialog("backup")}>
          📦 Descargar Respaldo
        </Button>

        <Button variant="contained" component="label" color="warning">
          📥 Restaurar BD
          <input hidden type="file" accept=".sql" onChange={handleFileChange} />
        </Button>
      </Box>

      {/* Dialog Modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{actionType === "backup" ? "Confirmar Respaldo" : "Confirmar Restauración"}</DialogTitle>
        <DialogContent>
          <Typography>
            {actionType === "backup"
              ? "¿Desea generar un respaldo de la base de datos?"
              : "⚠️ Esta acción reemplazará la base de datos actual. ¿Desea continuar?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancelar</Button>
          <Button onClick={handleConfirmAction} color="primary" variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}