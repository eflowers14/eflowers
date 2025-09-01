module.exports = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body
  });
  
  // Errores de base de datos
  if (err.code === '23505') {
    return res.status(409).json({ 
      error: 'Recurso duplicado: el valor ya existe' 
    });
  }
  
  if (err.code === '23503') {
    return res.status(409).json({ 
      error: 'Violación de clave foránea: recurso relacionado no existe' 
    });
  }
  
  if (err.code === '23502') {
    return res.status(400).json({ 
      error: 'Violación de restricción NOT NULL: campo obligatorio faltante' 
    });
  }
  
  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Datos de entrada inválidos',
      details: err.details 
    });
  }
  
  // Error de autenticación
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      error: 'Token de autenticación inválido' 
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      error: 'Token de autenticación expirado' 
    });
  }
  
  // Error por defecto
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ 
    error: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { 
      details: err.message,
      stack: err.stack 
    })
  });
};