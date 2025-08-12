const pool = require('../services/db');

/**
 * Controlador para operaciones CRUD de skins
 * 
 * Patrón MVC: 
 * - Los controllers manejan la lógica de negocios
 * - Separan la lógica de las rutas y de la base de datos
 */
module.exports = {
  // Obtener todas las skins
  getAllSkins: async (req, res, next) => {
    try {
      const { rows } = await pool.query('SELECT * FROM skins ORDER BY id DESC');
      res.json(rows);
    } catch (err) {
      next(err); // Pasa el error al manejador centralizado
    }
  },

  // Crear una nueva skin
  createSkin: async (req, res, next) => {
    const { name, price } = req.body;
    
    // Validación básica
    if (!name || !price) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }

    try {
      const { rows } = await pool.query(
        'INSERT INTO skins (name, price) VALUES ($1, $2) RETURNING *',
        [name, parseFloat(price)]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  },

  // Actualizar una skin
  updateSkin: async (req, res, next) => {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;

    try {
      const { rowCount } = await pool.query(
        'UPDATE skins SET name = $1, price = $2 WHERE id = $3',
        [name, price, id]
      );
      
      if (rowCount === 0) {
        return res.status(404).json({ error: 'Skin no encontrada' });
      }
      
      res.json({ message: 'Skin actualizada correctamente' });
    } catch (err) {
      next(err);
    }
  },

  // Eliminar una skin
  deleteSkin: async (req, res, next) => {
    const id = parseInt(req.params.id);
    
    try {
      const { rowCount } = await pool.query(
        'DELETE FROM skins WHERE id = $1',
        [id]
      );
      
      if (rowCount === 0) {
        return res.status(404).json({ error: 'Skin no encontrada' });
      }
      
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
};