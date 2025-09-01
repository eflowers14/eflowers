const express = require('express');
const router = express.Router();
const skinsController = require('../controllers/skins.controller');
const { skinValidation, idValidation } = require('../middleware/validation');
const auth = require('../middleware/auth'); // Asumiendo que tenemos middleware de autenticación

// Rutas públicas
router.get('/', skinsController.getAllSkins);
router.get('/:id', idValidation, skinsController.getSkinById);

// Rutas protegidas (requieren autenticación)
router.post('/', auth, skinValidation, skinsController.createSkin);
router.put('/:id', auth, idValidation, skinsController.updateSkin);
router.delete('/:id', auth, idValidation, skinsController.deleteSkin);
router.post('/purchase', auth, skinsController.purchaseSkin);

module.exports = router;