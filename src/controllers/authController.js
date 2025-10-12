const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {PrismaClient} = require('@/generated/prisma/client');
const prisma = new PrismaClient();
const {JWT_SECRET, JWT_EXPIRES_IN} = process.env;

/**
 * @function loginUser
 * @async
 * @param {object} req - Request Object.
 * @param {object} req.body - Body Request.
 * @param {string} req.body.email - Email User.
 * @param {string} req.body.password - Password User.
 * @param {object} res - Response Object.
 * @returns {object} 200: {data: token}.
 * @returns {object} 401: {error: string}.
 */
const loginUser = async (req, res) => {
    const {email, password} = req.body;

    const user = await prisma.users.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
            nick_name: true,
            email: true,
            password: true,
        }
    });

    if (!user) {
        return res.status(401).json({error: 'Credenciais inválidas.'});
    }

    const passwordMatch = await bcrypt.compare(password, user['password']);

    if (!passwordMatch) {
        return res.status(401).json({error: 'Credenciais inválidas.'});
    }

    const token = jwt.sign(
        {
            id: user['id'],
            nick_name: user['nick_name'],
            email: user['email']
        },
        JWT_SECRET,
        {
            expiresIn: JWT_EXPIRES_IN || "24h"
        }
    );

    return res.json({token});
}

module.exports = {
    loginUser
}