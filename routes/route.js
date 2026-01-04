import express from 'express';
import { registrarVoto, obtenerResultados, descargarExcel } from '../controllers/votoController.js';
import { login, cambiarPassword } from '../controllers/authController.js';

const router = express.Router();

// Rutas de Votos
router.post('/votar', registrarVoto);
router.get('/resultados', obtenerResultados);
router.get('/descargar-excel', descargarExcel);

// Rutas de Admin
router.post('/login', login);
router.post('/admin/cambiar-password', cambiarPassword);

export default router;