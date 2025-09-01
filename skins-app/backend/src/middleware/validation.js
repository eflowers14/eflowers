const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      errors: errors.array(),
      message: 'Datos de entrada inválidos'
    });
  }
  next();
};

const skinValidation = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('El nombre debe tener entre 1 y 100 caracteres'),
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('El precio debe ser un número positivo'),
  body('rarity')
    .isIn(['common', 'uncommon', 'rare', 'epic', 'legendary'])
    .withMessage('Rareza inválida'),
  body('game')
    .isLength({ min: 1, max: 50 })
    .withMessage('El juego debe tener entre 1 y 50 caracteres'),
  handleValidationErrors
];

const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID debe ser un número entero positivo'),
  handleValidationErrors
];

module.exports = {
  skinValidation,
  idValidation,
  handleValidationErrors
};