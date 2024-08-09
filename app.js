const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Adicione esta linha
const app = express();
const port = 3000;

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para CORS
app.use(cors({
  origin: 'https://bronksdev.github.io' // Substitua pelo domínio onde seu frontend está hospedado
}));

// Importa as rotas
const studentRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendance');

// Usa as rotas
app.use('/students', studentRoutes);
app.use('/attendances', attendanceRoutes); // Certifique-se de que o prefixo está correto

// Conecta ao banco de dados
mongoose.connect('mongodb+srv://ferzinteixeira:q2h8A0qCa2rNGbF5@ceja.99wlr.mongodb.net/school-attendance?retryWrites=true&w=majority&appName=ceja', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB Atlas'))
.catch(err => console.error('Erro ao conectar ao MongoDB Atlas:', err.message));

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
