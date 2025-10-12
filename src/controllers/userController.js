const bcrypt = require('bcrypt');
const {PrismaClient} = require('@/generated/prisma/client');
const prisma = new PrismaClient();

const getAllUser = async (req, res) => {
    try {
        const users = await prisma.users.findFirst({
            select: {
                nick_name: true,
                first_name: true,
                last_name: true,
                email: true,
                birth_date: true,
                role: true
            }
        });

        res.status(200).json({data: users});

    } catch (error) {
        console.error('Erro ao buscar usuários no banco de dados:', error);
        res.status(500).json({error: 'Não foi possível buscar a lista de usuários.'});
    }
}

const storeUser = async (req, res) => {
    let data = {nick_name, first_name, last_name, email, password, birth_date} = req.body;

    if (!nick_name || !first_name || !last_name || !email || !password || !birth_date) {
        return res.status(400).json({error: 'Todos os campos são obrigatórios.'});
    }

    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(data.password, saltRounds);

        data = {...data, password: passwordHash, role: 'USER'}

        const createUser = await prisma.users.create({data: data});

        delete createUser['password'];

        res.status(201).json({message: 'Usuário cadastrado com sucesso!', user: createUser});

    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({error: 'O e-mail informado já está em uso.'});
        }
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({error: 'Erro interno do servidor.'});
    }
};

module.exports = {
    getAllUser,
    storeUser,
};