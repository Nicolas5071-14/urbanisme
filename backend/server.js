const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
const routes = require('./routes');
// const errorHandler = require('./middlewares/errorHandler');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api', routes);

// Middleware de gestion des erreurs
// app.use(errorHandler);

// Configuration de la base de données
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

// Tester la connexion à la base de données
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
  }
}

testDatabaseConnection();

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT} en mode ${process.env.NODE_ENV}`);
});
// Dans app.js (avant les routes)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
module.exports = app;