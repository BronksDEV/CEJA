const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  turma: { type: String, required: true },
  faltas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }] // Campo para armazenar as faltas
});

module.exports = mongoose.model('Student', studentSchema);
