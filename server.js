// server.js (ACTUALIZADO)
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const XLSX = require('xlsx');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./votos.db', (err) => {
    if (err) console.error(err.message);
    console.log('Conectado a SQLite.');
});

// Crear tablas
db.serialize(() => {
    // Tabla de Votos
    db.run(`CREATE TABLE IF NOT EXISTS votos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rol TEXT NOT NULL,
        opcion_id INTEGER NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de Administrador (Usuario y Contraseña)
    db.run(`CREATE TABLE IF NOT EXISTS admin (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL
    )`);

    // Insertar usuario por defecto si no existe (Usuario: admin, Clave: 123456)
    const stmt = db.prepare("INSERT OR IGNORE INTO admin (username, password) VALUES (?, ?)");
    stmt.run("admin", "123456");
    stmt.finalize();
});

// --- RUTAS VOTO ---
app.post('/api/votar', (req, res) => {
    const { rol, opcion_id } = req.body;
    if (!rol || opcion_id === undefined) return res.status(400).json({ error: 'Datos incompletos' });
    
    db.run(`INSERT INTO votos (rol, opcion_id) VALUES (?, ?)`, [rol, opcion_id], function(err) {
        if (err) return console.error(err.message);
        res.json({ message: 'Voto registrado' });
    });
});

app.get('/api/resultados', (req, res) => {
    db.all(`SELECT opcion_id, rol, COUNT(*) as cantidad FROM votos GROUP BY opcion_id, rol`, [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ data: rows });
    });
});

app.get('/api/descargar-excel', (req, res) => {
    const sql = `SELECT id, rol, opcion_id, fecha FROM votos`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).send("Error BD");

        const nombresListas = {
            1: "Universidad 4.0", 2: "Eco Smart UNCP", 3: "Huallallo",
            4: "Unidad Universitaria", 5: "Leal", 6: "Quipu",
            7: "Calidad 2030", 8: "Innóvate", 9: "ADU", 0: "Ninguno/Viciado"
        };

        const datos = rows.map(row => ({
            ID: row.id, Rol: row.rol, Lista: nombresListas[row.opcion_id], Numero: row.opcion_id, Fecha: row.fecha
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(datos);
        XLSX.utils.book_append_sheet(wb, ws, "Resultados");
        
        const tempPath = path.join(__dirname, 'reporte.xlsx');
        XLSX.writeFile(wb, tempPath);
        res.download(tempPath);
    });
});

// --- RUTAS DE AUTENTICACIÓN (NUEVO) ---

// 1. Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM admin WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) return res.status(500).json({ error: "Error de servidor" });
        
        if (row) {
            res.json({ success: true, message: "Login exitoso" });
        } else {
            res.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }
    });
});

// 2. Cambiar Contraseña
app.post('/api/admin/cambiar-password', (req, res) => {
    const { username, newPassword } = req.body; // En un sistema real, pedirías la contraseña anterior también
    
    db.run(`UPDATE admin SET password = ? WHERE username = ?`, [newPassword, username], function(err) {
        if (err) return res.status(500).json({ error: "No se pudo actualizar" });
        res.json({ success: true, message: "Contraseña actualizada correctamente" });
    });
});

app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));