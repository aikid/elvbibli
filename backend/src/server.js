require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const { iniciarJobs } = require('./jobs/scheduler');

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`API: http://localhost:${PORT}/books`);
      
      // Iniciar jobs agendados
      iniciarJobs();
    });
  })
  .catch((err) => {
    console.error('Falha ao iniciar:', err);
    process.exit(1);
  });
