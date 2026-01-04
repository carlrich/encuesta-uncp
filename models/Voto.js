import mongoose from 'mongoose';

const votoSchema = new mongoose.Schema({
  rol: { type: String, required: true },
  opcion_id: { type: Number, required: true },
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model('Voto', votoSchema);