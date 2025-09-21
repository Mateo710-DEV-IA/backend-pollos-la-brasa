import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(express.json());

// Crear servidor HTTP y conectar con Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ pon aquí tu dominio de Vercel
  },
});

// Evento cuando un frontend se conecta
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado al WebSocket:", socket.id);
});

// Ruta para recibir de n8n y reenviar al front
app.post('/webhook', (req: Request, res: Response) => {
  const data = req.body;
  console.log('📩 Datos recibidos desde n8n:', data);

  // Emitir evento en tiempo real al front
  io.emit("nuevoDato", data);

  res.status(200).json({ message: 'Datos enviados al frontend', received: data });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Backend escuchando en puerto ${PORT}`);
});

