const Attendance = require('../models/attendance');
const Student = require('../models/student');
const mongoose = require('mongoose');

const registerAttendance = async (req, res) => {
  try {
    const { studentId, date, present } = req.body;

    // Verifica se o ID do aluno é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: 'ID do aluno inválido' });
    }

    // Cria um novo registro de falta
    const newAttendance = new Attendance({
      studentId,
      date: new Date(date), // Certifique-se de que a data é um objeto Date válido
      present
    });

    // Salva o registro de falta
    await newAttendance.save();

    // Adiciona a falta ao aluno
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { $push: { faltas: newAttendance._id } },
      { new: true } // Retorna o aluno atualizado
    );

    // Verifica se o aluno foi encontrado e atualizado
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    res.status(201).json({ message: 'Falta registrada com sucesso', attendance: newAttendance });
  } catch (error) {
    console.error('Erro ao registrar falta:', error); // Adiciona logging detalhado
    res.status(500).json({ message: 'Erro ao registrar falta', error: error.message });
  }
};

module.exports = {
  registerAttendance
};
