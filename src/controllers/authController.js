const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {PrismaClient} = require('@/generated/prisma/client');
const prisma = new PrismaClient();
const {JWT_SECRET, JWT_EXPIRES_IN} = process.env;

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
            expiresIn: "24h"
        }
    );

    return res.json({token});
}

module.exports = {
    loginUser
}