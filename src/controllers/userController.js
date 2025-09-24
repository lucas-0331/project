const pool = require('../database/connection');
const bcrypt = require('bcrypt');

const getAllUser = async (req, res) => {
  try {
    const result = await pool.query('SELECT nick_name, first_name, last_name, email, birth_date FROM users');

    const allUsers = result.rows;

    res.status(200).json({ data: allUsers });

  } catch (error) {
    console.error('Erro ao buscar usuários no banco de dados:', error);
    res.status(500).json({ error: 'Não foi possível buscar a lista de usuários.' });
  }
}

const storeUser = async (req, res) => {
  const { nickName, firstName, lastName, email, password, birthDate } = req.body;

  if (!nickName || !firstName || !lastName || !email || !password || !birthDate) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const query = `
        INSERT INTO users (nick_name, first_name, last_name, email, password, birth_date)
        VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
    `;
    const values = [nickName, firstName, lastName, email, passwordHash, birthDate];

    const result = await pool.query(query, values);

    const newUser = result.rows[0];
    delete newUser.password;

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: newUser });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'O e-mail informado já está em uso.' });
    }
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = {
  getAllUser,
  storeUser,
};