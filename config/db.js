import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js'; // Importamos el modelo para crear el admin default

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // --- Crear Admin por defecto (Seed) ---
    const adminExiste = await Admin.findOne({ username: 'admin' });
    if (!adminExiste) {
      await Admin.create({ username: 'admin', password: '123456' }); // En prod usa hash!
      console.log('👤 Usuario admin creado por defecto');
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error);
    process.exit(1);
  }
};

export default connectDB;