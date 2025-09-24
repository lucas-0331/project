const pool = require('../database/connection');
const bcrypt = require('bcrypt');

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

    console.log(result);

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
  storeUser,
};