const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/studentsController');
const Student = require('../models/student');

// Rota para adicionar o campo "faltas" aos documentos existentes
router.post('/update-faltas', async (req, res) => {
  try {
    await Student.updateMany({}, { $set: { faltas: [] } });
    res.status(200).json({ message: 'Campo "faltas" adicionado a todos os alunos' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar alunos', error: error.message });
  }
});

// Rota para listar todos os alunos
router.get('/', studentsController.getAllStudents);

// Rota para criar um novo aluno
router.post('/', studentsController.createStudent);

// Rota para calcular a frequência de um aluno específico
router.post('/:studentId/frequencia', studentsController.calculateAttendance);

module.exports = router;
