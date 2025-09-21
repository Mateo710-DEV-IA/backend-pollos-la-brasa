import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// -------------------- Configuración Express --------------------
const app = express();
app.use(express.json());

// Middleware CORS para peticiones HTTP normales (fetch, axios, etc.)
app.use(
  cors({
    origin: "*", // Aquí puedes poner tu frontend en producción, ej: "https://mi-app.vercel.app"
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// -------------------- Servidor HTTP y Socket.IO --------------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Permitir cualquier frontend Socket.IO
    methods: ["GET", "POST"],
  },
});

// Evento cuando un cliente se conecta por WebSocket
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado al WebSocket:", socket.id);

  // Evento opcional para recibir mensajes del frontend
  socket.on("mensajeCliente", (msg) => {
    console.log("📨 Mensaje del cliente:", msg);
  });

  // Evento de desconexión
  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});

// -------------------- Ruta webhook --------------------
app.post("/webhook", (req: Request, res: Response) => {
  const data = req.body;
  console.log("📩 Datos recibidos desde n8n:", data);

  // Emitir evento en tiempo real al frontend
  io.emit("nuevoDato", data);

  res.status(200).json({ message: "Datos enviados al frontend", received: data });
});

// -------------------- Arrancar servidor --------------------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Backend escuchando en puerto ${PORT}`);
});
