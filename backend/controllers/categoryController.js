const db = require('../config/db');

exports.getCategories = async (req, res) => {
  try {
    const categories = await db.asyncAll(`
      SELECT c.*, COUNT(q.id) as count
      FROM categories c
      LEFT JOIN quizzes q ON c.id = q.category_id
      GROUP BY c.id
    `);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required.' });

    const id = `cat-${Date.now()}`;
    await db.asyncRun(
      'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
      [id, name, description || '']
    );

    res.status(201).json({ id, name, description });
  } catch (err) {
    res.status(500).json({ message: 'Error creating category', error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    await db.asyncRun(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );

    res.json({ id, name, description });
  } catch (err) {
    res.status(500).json({ message: 'Error updating category', error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.asyncRun('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category', error: err.message });
  }
};
