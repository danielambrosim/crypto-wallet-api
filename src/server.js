const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const walletRoutes = require('./routes/walletRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao banco de dados
connectDB();

app.use(bodyParser.json());

// Rotas
app.use('/api/wallets', walletRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

