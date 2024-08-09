const Student = require('../models/student');
const Attendance = require('../models/attendance');
const mongoose = require('mongoose');

// Lista todos os alunos
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('faltas');
    console.log('Dados retornados pela API:', students); 
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Adiciona um novo aluno
exports.createStudent = async (req, res) => {
  const student = new Student({
    nome: req.body.nome,
    turma: req.body.turma,
  });

  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Calcular a frequência do aluno
exports.calculateAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { totalDiasLetivos } = req.body;

    // Verifica se o ID do aluno é válido
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: 'ID do aluno inválido' });
    }

    // Verifica se o total de dias letivos é um número positivo
    if (totalDiasLetivos <= 0) {
      return res.status(400).json({ message: 'O total de dias letivos deve ser maior que zero' });
    }

    // Encontra o aluno e popula as faltas
    const student = await Student.findById(studentId).populate('faltas');

    // Verifica se o aluno foi encontrado
    if (!student) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    // Conta o número de faltas
    const faltas = student.faltas.length;

    // Calcula a frequência
    const frequencia = ((totalDiasLetivos - faltas) / totalDiasLetivos) * 100;

    res.status(200).json({ frequencia: frequencia.toFixed(2) });
  } catch (error) {
    console.error('Erro ao calcular frequência:', error);
    res.status(500).json({ message: 'Erro ao calcular frequência', error: error.message });
  }
};
