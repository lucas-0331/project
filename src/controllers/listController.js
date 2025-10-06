const pool = require('../database/connection');

// Listar todas as listas do usuário autenticado
exports.getLists = async (req, res) => {
	const userId = req.user.id;
	try {
		const result = await pool.query('SELECT * FROM lists WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ message: 'Erro ao buscar listas', error: err.message });
	}
};

// Buscar uma lista pelo id
exports.getListById = async (req, res) => {
	const userId = req.user.id;
	const { id } = req.params;
	try {
		const result = await pool.query('SELECT * FROM lists WHERE id = $1 AND user_id = $2', [id, userId]);
		if (result.rows.length === 0) {
			return res.status(404).json({ message: 'Lista não encontrada' });
		}
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ message: 'Erro ao buscar lista', error: err.message });
	}
};

// Criar nova lista
exports.createList = async (req, res) => {
	const userId = req.user.id;
	const { name, icon } = req.body;
	try {
		const result = await pool.query(
			'INSERT INTO lists (user_id, name, icon, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
			[userId, name, icon]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ message: 'Erro ao criar lista', error: err.message });
	}
};

// Atualizar lista
exports.updateList = async (req, res) => {
	const userId = req.user.id;
	const { id } = req.params;
	const { name, icon } = req.body;
	try {
		const result = await pool.query(
			'UPDATE lists SET name = $1, icon = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING *',
			[name, icon, id, userId]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ message: 'Lista não encontrada ou não pertence ao usuário' });
		}
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ message: 'Erro ao atualizar lista', error: err.message });
	}
};

// Deletar lista
exports.deleteList = async (req, res) => {
	const userId = req.user.id;
	const { id } = req.params;
	try {
		const result = await pool.query('DELETE FROM lists WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
		if (result.rows.length === 0) {
			return res.status(404).json({ message: 'Lista não encontrada ou não pertence ao usuário' });
		}
		res.json({ message: 'Lista deletada com sucesso' });
	} catch (err) {
		res.status(500).json({ message: 'Erro ao deletar lista', error: err.message });
	}
};
