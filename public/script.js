document.addEventListener('DOMContentLoaded', () => {
  const addStudentForm = document.getElementById('addStudentForm');
  const loadStudentsButton = document.getElementById('loadStudents');
  const studentsList = document.getElementById('studentsList');
  const studentIdInput = document.getElementById('studentId');
  const attendanceStudentIdInput = document.getElementById('attendanceStudentId');
  const totalSchoolDaysInput = document.getElementById('totalSchoolDays');
  const attendanceResult = document.getElementById('attendanceResult');

  // Adicionar aluno
  addStudentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentName = document.getElementById('studentName').value;
    const studentClass = document.getElementById('studentClass').value;

    try {
      const response = await fetch('http://localhost:3000/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: studentName,
          turma: studentClass,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao adicionar aluno');
      }

      const newStudent = await response.json();
      alert(`Aluno adicionado com sucesso: ${newStudent._id}`);
      
      await loadStudents(); // Atualiza a tabela após adicionar um novo aluno
    } catch (error) {
      console.error('Erro ao adicionar aluno:', error);
      alert('Erro ao adicionar aluno. Veja o console para mais detalhes.');
    }
  });

  // Função para carregar alunos e exibir na tabela
  async function loadStudents() {
    try {
      const response = await fetch('http://localhost:3000/students');
      const data = await response.json();

      console.log('Resposta completa da API /students:', data);

      if (!Array.isArray(data)) {
        throw new Error('Formato inesperado de resposta da API. Esperado um array.');
      }

      studentsList.innerHTML = '';

      data.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${student._id}</td>
          <td>${student.nome}</td>
          <td>${student.turma}</td>
          <td>${student.faltas.length}</td> <!-- Exibe o número de faltas -->
        `;
        row.dataset.id = student._id;
        studentsList.appendChild(row);
      });
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  }

  // Carregar alunos ao clicar no botão
  loadStudentsButton.addEventListener('click', loadStudents);

  // Selecionar o ID do aluno ao clicar na tabela
  studentsList.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (row) {
      const studentId = row.dataset.id;
      studentIdInput.value = studentId;
      attendanceStudentIdInput.value = studentId;
    }
  });

  // Registrar falta
  document.getElementById('addAttendanceForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentId = document.getElementById('studentId').value;
    const date = document.getElementById('attendanceDate').value;
    const present = document.getElementById('present').value === "true"; // Corrige para o valor correto do <select>

    try {
      const response = await fetch('http://localhost:3000/attendances/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId, date, present }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao registrar falta');
      }

      const data = await response.json();
      alert(data.message);
      await loadStudents(); // Atualiza a tabela após registrar a falta
    } catch (error) {
      console.error('Erro ao registrar falta:', error);
      alert('Erro ao registrar falta. Veja o console para mais detalhes.');
    }
  });

  // Calcular frequência
  document.getElementById('calculateAttendanceForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentId = attendanceStudentIdInput.value;
    const totalSchoolDays = totalSchoolDaysInput.value;

    try {
      const response = await fetch(`http://localhost:3000/students/${studentId}/frequencia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ totalDiasLetivos: totalSchoolDays }),
      });

      if (!response.ok) {
        throw new Error('Falha ao calcular frequência');
      }

      const result = await response.json();
      attendanceResult.textContent = `Frequência: ${result.frequencia}%`;
    } catch (error) {
      console.error('Erro ao calcular frequência:', error);
      alert('Erro ao calcular frequência. Veja o console para mais detalhes.');
    }
  });
});
