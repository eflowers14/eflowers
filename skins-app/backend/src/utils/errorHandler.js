/**
 * Middleware para manejo centralizado de errores
 * 
 * ¿Por qué es importante?
 * - Evita duplicación de código try/catch
 * - Proporciona una respuesta consistente en errores
 */
module.exports = (err, req, res, next) => {
  console.error('🔥 Error:', err.message);
  
  // Errores de base de datos
  if (err.code === '23505') {
    return res.status(409).json({ 
      error: 'Skin duplicada: el nombre ya existe' 
    });
  }
  
  res.status(500).json({ 
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};