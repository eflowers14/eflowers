const { pool } = require('../services/db');

module.exports = {
  // Obtener todas las skins con filtros
  getAllSkins: async (req, res, next) => {
    try {
      const { game, rarity, min_price, max_price, page = 1, limit = 10 } = req.query;
      
      let query = 'SELECT * FROM skins WHERE 1=1';
      let countQuery = 'SELECT COUNT(*) FROM skins WHERE 1=1';
      const values = [];
      let paramCount = 0;

      if (game) {
        paramCount++;
        query += ` AND game = $${paramCount}`;
        countQuery += ` AND game = $${paramCount}`;
        values.push(game);
      }

      if (rarity) {
        paramCount++;
        query += ` AND rarity = $${paramCount}`;
        countQuery += ` AND rarity = $${paramCount}`;
        values.push(rarity);
      }

      if (min_price) {
        paramCount++;
        query += ` AND price >= $${paramCount}`;
        countQuery += ` AND price >= $${paramCount}`;
        values.push(parseFloat(min_price));
      }

      if (max_price) {
        paramCount++;
        query += ` AND price <= $${paramCount}`;
        countQuery += ` AND price <= $${paramCount}`;
        values.push(parseFloat(max_price));
      }

      // Paginación
      const offset = (page - 1) * limit;
      paramCount++;
      query += ` ORDER BY id DESC LIMIT $${paramCount}`;
      values.push(parseInt(limit));
      
      paramCount++;
      query += ` OFFSET $${paramCount}`;
      values.push(offset);

      // Ejecutar ambas consultas en paralelo
      const [skinsResult, countResult] = await Promise.all([
        pool.query(query, values),
        pool.query(countQuery, values.slice(0, -2)) // Remover limit y offset para count
      ]);

      res.json({
        skins: skinsResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].count),
          pages: Math.ceil(countResult.rows[0].count / limit)
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // Obtener una skin por ID
  getSkinById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { rows, rowCount } = await pool.query(
        'SELECT * FROM skins WHERE id = $1',
        [id]
      );
      
      if (rowCount === 0) {
        return res.status(404).json({ error: 'Skin no encontrada' });
      }
      
      res.json(rows[0]);
    } catch (err) {
      next(err);
    }
  },

  // Crear una nueva skin
  createSkin: async (req, res, next) => {
    try {
      const { name, description, price, rarity, game, image_url } = req.body;
      
      const { rows } = await pool.query(
        `INSERT INTO skins (name, description, price, rarity, game, image_url) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [name, description, price, rarity, game, image_url]
      );
      
      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  },

  // Actualizar una skin
  updateSkin: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description, price, rarity, game, image_url } = req.body;
      
      // Construir consulta dinámica para actualizar solo los campos proporcionados
      const fields = [];
      const values = [];
      let paramCount = 0;

      if (name !== undefined) {
        paramCount++;
        fields.push(`name = $${paramCount}`);
        values.push(name);
      }

      if (description !== undefined) {
        paramCount++;
        fields.push(`description = $${paramCount}`);
        values.push(description);
      }

      if (price !== undefined) {
        paramCount++;
        fields.push(`price = $${paramCount}`);
        values.push(price);
      }

      if (rarity !== undefined) {
        paramCount++;
        fields.push(`rarity = $${paramCount}`);
        values.push(rarity);
      }

      if (game !== undefined) {
        paramCount++;
        fields.push(`game = $${paramCount}`);
        values.push(game);
      }

      if (image_url !== undefined) {
        paramCount++;
        fields.push(`image_url = $${paramCount}`);
        values.push(image_url);
      }

      if (fields.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
      }

      paramCount++;
      values.push(id);
      
      const { rows, rowCount } = await pool.query(
        `UPDATE skins SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $${paramCount} RETURNING *`,
        values
      );
      
      if (rowCount === 0) {
        return res.status(404).json({ error: 'Skin no encontrada' });
      }
      
      res.json(rows[0]);
    } catch (err) {
      next(err);
    }
  },

  // Eliminar una skin
  deleteSkin: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const { rowCount } = await pool.query(
        'DELETE FROM skins WHERE id = $1',
        [id]
      );
      
      if (rowCount === 0) {
        return res.status(404).json({ error: 'Skin no encontrada' });
      }
      
      res.status(204).send();
    } catch (err) {
      // Manejar error de clave foránea
      if (err.code === '23503') {
        return res.status(409).json({ 
          error: 'No se puede eliminar la skin porque está asociada a transacciones existentes' 
        });
      }
      next(err);
    }
  },

  // Comprar una skin
  purchaseSkin: async (req, res, next) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      const userId = req.user.id; // Asumiendo que tenemos autenticación
      const { skinId } = req.body;
      
      // Obtener información de la skin y el usuario
      const skinQuery = 'SELECT * FROM skins WHERE id = $1 FOR UPDATE';
      const userQuery = 'SELECT * FROM users WHERE id = $1 FOR UPDATE';
      
      const [skinResult, userResult] = await Promise.all([
        client.query(skinQuery, [skinId]),
        client.query(userQuery, [userId])
      ]);
      
      if (skinResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Skin no encontrada' });
      }
      
      if (userResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      const skin = skinResult.rows[0];
      const user = userResult.rows[0];
      
      // Verificar si el usuario tiene suficiente saldo
      if (user.balance < skin.price) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Saldo insuficiente' });
      }
      
      // Actualizar saldo del usuario
      await client.query(
        'UPDATE users SET balance = balance - $1 WHERE id = $2',
        [skin.price, userId]
      );
      
      // Añadir skin al inventario del usuario
      const inventoryQuery = `
        INSERT INTO user_skins (user_id, skin_id, purchase_price) 
        VALUES ($1, $2, $3) RETURNING *
      `;
      const inventoryResult = await client.query(inventoryQuery, [
        userId, skinId, skin.price
      ]);
      
      // Registrar transacción
      const transactionQuery = `
        INSERT INTO transactions (user_id, skin_id, type, amount) 
        VALUES ($1, $2, 'purchase', $3)
      `;
      await client.query(transactionQuery, [userId, skinId, skin.price]);
      
      await client.query('COMMIT');
      res.status(201).json(inventoryResult.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      next(err);
    } finally {
      client.release();
    }
  }
};