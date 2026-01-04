import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import apiRoutes from './routes/route.js';

// Configuración
const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a BD
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rutas
app.use('/api', apiRoutes);

// Iniciar
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});