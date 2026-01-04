import Admin from '../models/Admin.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, password });

    if (admin) {
      res.json({ success: true, message: "Login exitoso" });
    } else {
      res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
  } catch (error) {
      res.status(500).json({ error: "Error de servidor" });
  }
};

export const cambiarPassword = async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    await Admin.findOneAndUpdate({ username }, { password: newPassword });
    res.json({ success: true, message: "Contraseña actualizada" });
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar" });
  }
};