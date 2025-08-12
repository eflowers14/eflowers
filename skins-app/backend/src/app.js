const express = require('express');
const app = express();
const skinsRouter = require('./routes/skins.routes');
const errorHandler = require('./utils/errorHandler');

// Configuración básica
require('dotenv').config();

/**
 * Middlewares esenciales
 * 
 * 1. express.json(): Para parsear cuerpos JSON en requests
 * 2. Ruta principal para skins
 * 3. Manejo centralizado de errores (siempre al final)
 */
app.use(express.json());
app.use('/api/skins', skinsRouter);
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});