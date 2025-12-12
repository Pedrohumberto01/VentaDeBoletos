# VentaDeBoletos

Repositorio: [https://github.com/Pedrohumberto01/VentaDeBoletos](https://github.com/Pedrohumberto01/VentaDeBoletos)

**Resumen**

Este README explica, paso a paso, cómo instalar y ejecutar el proyecto `VentaDeBoletos`. El repositorio contiene tres carpetas principales:

* `DataBase` – scripts SQL para crear la base de datos y poblarla.
* `VentaDeBoletosAPI` – proyecto backend en ASP.NET 8 (API).
* `web_boletos` – proyecto frontend en React.

Las instrucciones a continuación asumen un entorno Windows (por la mención de Visual Studio 2022). Sin embargo, donde sea posible, también incluyo comandos `dotnet` / `npm` multiplataforma.

---

## Requisitos previos

Instala las siguientes herramientas antes de comenzar:

1. **MySQL 8.x** (servidor y cliente) – descargar e instalar MySQL Community Server 8. Asegúrate de recordar el usuario y contraseña de administrador (ej. `root` y una contraseña segura).
2. **Node.js** (recomendado LTS) – para el frontend. Comprueba con `node -v` y `npm -v`.
3. **Visual Studio 2022** (última actualización) con el workload de `.NET` y soporte para ASP.NET y desarrollo web. También puedes usar el SDK de .NET 8 con la CLI (`dotnet`) si prefieres no usar Visual Studio.
4. **.NET 8 SDK** – si usas la CLI `dotnet`. Comprueba con `dotnet --version`.
5. (Opcional) **MySQL Workbench** o **HeidiSQL** para ejecutar los scripts SQL con interfaz gráfica.
6. Git: `git` instalado para clonar el repo.

> Nota: Si trabajas en macOS o Linux, instala MySQL, Node.js y .NET 8 compatibles con tu SO y reemplaza comandos Windows por equivalentes en tu terminal.

---

## Paso 1 — Clonar el repositorio

Abre la terminal (o PowerShell) y clona el repositorio:

```bash
git clone https://github.com/Pedrohumberto01/VentaDeBoletos.git
cd VentaDeBoletos
```

---

## Paso 2 — Preparar la base de datos (MySQL 8)

1. Crea una base de datos vacía (ej. `VentaDeBoletosDB`) y un usuario con permisos apropiados o usa `root` (no recomendado en producción).

Puedes crear la base con MySQL CLI:

```bash
mysql -u root -p
-- en el prompt de mysql:
CREATE DATABASE VentaDeBoletosDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'vdbo_user'@'localhost' IDENTIFIED BY 'TuPasswordSeguro';
GRANT ALL PRIVILEGES ON VentaDeBoletosDB.* TO 'vdbo_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

2. Ejecuta los scripts SQL que están en la carpeta `DataBase`. Puedes hacerlo con MySQL Workbench o desde la CLI:

```bash
# desde la carpeta del repo
mysql -u vdbo_user -p VentaDeBoletosDB < DataBase/01_crear_tablas.sql
mysql -u vdbo_user -p VentaDeBoletosDB < DataBase/02_seed_datos.sql
```
---

## Paso 3 — Configurar el backend (VentaDeBoletosAPI)

1. Abre la carpeta `VentaDeBoletosAPI` en Visual Studio 2022 o en tu editor.

2. Copia/crea un archivo `appsettings.Development.json` (o modifica `appsettings.json`) para configurar la cadena de conexión a MySQL. Un ejemplo de entrada en `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=VentaDeBoletosDB;User Id=vdbo_user;Password=TuPasswordSeguro;TreatTinyAsBoolean=true;AllowPublicKeyRetrieval=True;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "AllowedHosts": "*"
}
```

**Puntos a revisar**

* `Server` puede ser `localhost` o la IP del servidor MySQL.
* `AllowPublicKeyRetrieval=True` y `TreatTinyAsBoolean=true` son útiles dependiendo de la configuración MySQL y del conector. Ajústalos según los errores que veas.

Con Visual Studio: abre la solución y presiona `Rebuild` o `Run`.

Con la CLI `dotnet`:

```bash
cd VentaDeBoletosAPI
dotnet restore
dotnet build
```

5. Ejecutar la API:

```bash
dotnet run --project .
```

La API debería arrancar en el puerto configurado en `launchSettings.json` (por ejemplo `http://localhost:5000` o `https://localhost:5001`). Revisa la salida para ver la URL exacta.


## Paso 4 — Configurar y ejecutar el frontend (web_boletos)

1. En una terminal, ve a la carpeta `web_boletos`:

```bash
cd ../web_boletos
```

2. Instala dependencias con npm 

```bash
npm install
```

3. Configura variables de entorno para que el frontend conozca la URL de la API. Crea un archivo `.env` (o `.env.development`) en `web_boletos` con el contenido (ejemplo):

```
REACT_APP_API_URL=http://localhost:5000/api
# u otra URL según el puerto de la API
```

4. Iniciar la app en modo desarrollo:

```bash
npm start
# o
# yarn start
```

Esto debería abrir `http://localhost:3000` (o el puerto configurado) y la aplicación React consumirá la API usando `process.env.REACT_APP_API_URL`.

---

## Paso 5 — Comprobaciones y pruebas básicas

1. Abre la API en el navegador o usa `curl` / Postman para probar un endpoint, por ejemplo:

```bash
curl http://localhost:5000/api/health
```

2. Asegúrate de que las rutas CORS estén habilitadas en la API para permitir peticiones desde el origen donde corre React. Si recibes errores CORS, agrega la política CORS en `Program.cs` o `Startup.cs`:

```csharp
builder.Services.AddCors(options => {
  options.AddPolicy("AllowFrontend", policy => {
    policy.WithOrigins("http://localhost:3000")
          .AllowAnyHeader()
          .AllowAnyMethod();
  });
});

app.UseCors("AllowFrontend");
```

3. Revisa la consola del frontend (DevTools) y los logs del backend para detectar errores de conexión o 500s.



