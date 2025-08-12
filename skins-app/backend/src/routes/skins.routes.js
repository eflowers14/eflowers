const express = require('express');
const router = express.Router();
const skinsController = require('../controllers/skins.controller');

/**
 * Sistema de enrutamiento RESTful
 * 
 * Buenas prácticas:
 * - Usar nombres en plural para recursos
 * - Usar verbos HTTP adecuados (GET, POST, PUT, DELETE)
 */
router.get('/', skinsController.getAllSkins);
router.post('/', skinsController.createSkin);
router.put('/:id', skinsController.updateSkin);
router.delete('/:id', skinsController.deleteSkin);

module.exports = router;