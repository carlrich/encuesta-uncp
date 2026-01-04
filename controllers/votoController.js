import Voto from '../models/Voto.js';
import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

// Registrar Voto
export const registrarVoto = async (req, res) => {
  try {
    const { rol, opcion_id } = req.body;
    if (!rol || opcion_id === undefined) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const nuevoVoto = new Voto({ rol, opcion_id });
    await nuevoVoto.save();
    res.json({ message: 'Voto registrado exitosamente' });

  } catch (error) {
    res.status(500).json({ error: 'Error al registrar voto' });
  }
};

// Obtener Resultados (Agrupados como lo hacía SQL)
export const obtenerResultados = async (req, res) => {
  try {
    // Usamos Aggregate de Mongo para simular el GROUP BY de SQL
    const resultados = await Voto.aggregate([
      {
        $group: {
          _id: { opcion_id: "$opcion_id", rol: "$rol" },
          cantidad: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          opcion_id: "$_id.opcion_id",
          rol: "$_id.rol",
          cantidad: 1
        }
      }
    ]);
    res.json({ data: resultados });
  } catch (error) {
      res.status(500).json({ error: 'Error al obtener resultados' });
  }
};

// Descargar Excel
export const descargarExcel = async (req, res) => {
  try {
    const votos = await Voto.find().lean(); // .lean() lo hace más rápido

    const nombresListas = {
      1: "Universidad 4.0", 2: "Eco Smart UNCP", 3: "Huallallo",
      4: "Unidad Universitaria", 5: "Leal", 6: "Quipu",
      7: "Calidad 2030", 8: "Innóvate", 9: "ADU", 0: "Ninguno/Viciado"
    };

    const datos = votos.map(v => ({
      ID: v._id.toString(), // Mongo usa _id
      Rol: v.rol,
      Lista: nombresListas[v.opcion_id] || "Desconocido",
      Numero: v.opcion_id,
      Fecha: v.fecha
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datos);
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");

    // Guardar temporalmente
    const tempPath = path.resolve('reporte_temp.xlsx');
    XLSX.writeFile(wb, tempPath);

    res.download(tempPath, 'reporte_votos.xlsx', (err) => {
      if (err) console.error(err);
      // Borrar archivo después de descargar para no llenar el servidor
      fs.unlinkSync(tempPath);
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error generando Excel");
  }
};