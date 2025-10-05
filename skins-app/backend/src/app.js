const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const app = express();
const skinsRouter = require('./routes/skins.routes');
const authRouter = require('./routes/auth.routes');
const errorHandler = require('./utils/errorHandler');
const { verifyConnection } = require('./services/db');

// Configuración
require('dotenv').config();

// Middlewares de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Límite de peticiones
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 peticiones por ventana por IP
});
app.use(limiter);

// Middlewares de análisis de cuerpo de petición
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Verificar conexión a la base de datos al iniciar
verifyConnection();

// Rutas
app.use('/api/skins', skinsRouter);
app.use('/api/auth', authRouter);

// Ruta de salud
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo centralizado de errores
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});

// Ruta de prueba
app.get('/api/skins', (req, res) => {
  res.json({
    success: true,
    message: 'Skins obtenidas correctamente',
    data: [
      {
        id: 1,
        name: 'AK-47 | Redline',
        description: 'Una skin clásica de AK-47',
        price: 25.99,
        rarity: 'Classified',
        image_url: 'https://example.com/ak47-redline.jpg',
        created_at: new Date().toISOString()
      }
    ]
  });
});
module.exports = app; // Para testing