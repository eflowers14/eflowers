const { Pool } = require('pg');
require('dotenv').config();

/**
 * Configuración del pool de conexiones a PostgreSQL
 * 
 * ¿Por qué usar un pool?
 * - Reutiliza conexiones en lugar de abrir/cerrar en cada request
 * - Mejora el rendimiento en aplicaciones con múltiples solicitudes
 */
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Verificación de conexión al iniciar
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error conectando a PostgreSQL:', err);
  } else {
    console.log('✅ PostgreSQL conectado a las:', res.rows[0].now);
  }
});

module.exports = pool;