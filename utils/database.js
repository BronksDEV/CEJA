const mongoose = require('mongoose');

// String de conexão com o MongoDB Atlas
const dbUrl = 'mongodb+srv://ferzinteixeira:q2h8A0qCa2rNGbF5@ceja.99wlr.mongodb.net/school-attendance?retryWrites=true&w=majority&appName=ceja';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado ao MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB Atlas:', err.message);
  });

const db = mongoose.connection;
db.on('error', (err) => {
  console.error('Erro de conexão com o MongoDB:', err.message);
});

module.exports = mongoose;
