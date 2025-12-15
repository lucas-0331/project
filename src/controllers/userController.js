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

/**
 * @function storeUser
 * @async
 * @param {object} req - Request Object.
 * @param {object} req.body - Body Request.
 * @param {string} req.body.nick_name - Nick Name User.
 * @param {string} req.body.first_name - First Name User.
 * @param {string} req.body.last_name - Last Name User.
 * @param {string} req.body.email - Email User.
 * @param {string} req.body.password - Password User.
 * @param {date} req.body.birth_date - Birth Date User.
 * @param {object} res - Response Object.
 * @returns {object} 201: {message: string, user: object}.
 * @returns {object} 400: {error: string}.
 * @returns {object} 409: {error: string}.
 * @returns {object} 500: {error: string}.
 */
const storeUser = async (req, res) => {
    let data = {nick_name, first_name, last_name, avatar_id, email, password, birth_date} = req.body;

    if (!nick_name || !first_name || !last_name || !email || !password || !birth_date) {
        return res.status(400).json({error: 'Com exceção do ID do avatar, todos os campos são obrigatórios.'});
    }

    try {
        const passwordHash = await hashPassword(data.password)

        data = {...data, password: passwordHash, role: 'USER'}

        if (avatar_id) {
            const avatarExists = await prisma.avatars.findUnique({where: {id: Number(avatar_id)}});
            if (avatarExists) {
                data.avatar = avatarExists.link;
            }
            delete data['avatar_id'];
        }

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

const updateUser = async (req, res) => {
    const {id} = req.params;
    const {avatar_id, email, password} = req.body;

    let dataUpdate = {};

    try {
        const user = await prisma.users.findFirst({where: {id: Number(id)}});

        if (!user) {
            return res.status(404).json({error: 'Usuário não encontrado.'});
        }

        if (email && email !== user.email) {
            const emailExists = await prisma.users.findUnique(
                {where: {email: email}}
            );

            if (emailExists) {
                return res.status(400).json({error: 'O e-mail informado já está em uso.'})
            }

            dataUpdate.email = email;
        }

        if (password) {
            dataUpdate.password = await hashPassword(password);
        }

        if (avatar_id) {
            const avatarExists = await prisma.avatars.findUnique({where: {id: Number(avatar_id)}});
            if (avatarExists) {
                dataUpdate.avatar = avatarExists.link;
            }
        }

        if (Object.keys(dataUpdate).length === 0) {
            return res.status(200).json({success: 'Nenhum dado para atualizar.'});
        }

        dataUpdate.updated_at = new Date();

        const updateUser = await prisma.users.update({
            where: {id: Number(id)},
            data: dataUpdate
        });

        delete updateUser['password'];

        res.status(200).json({message: 'Usuário atualizado com sucesso!', user: updateUser});

    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        return res.status(500).json({ error: 'Erro interno ao atualizar usuário.' });
    }
}

async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

/**
 * @function getUserDetails
 * @description Retrieves details of the authenticated user.
 * @async
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @response 200 {object} data - The user details.
 * @response 404 {object} error - Error message if user not found.
 * @response 500 {object} error - Error message if something goes wrong on the server.
 */
const getUserDetails = async (req, res) => {

    const user_id = req.user_id;

    try {

        const user = await prisma.users.findUnique({
            where: { id: Number(user_id) },
            select: {
                id: true,
                nick_name: true,
                first_name: true,
                last_name: true,
                email: true,
                birth_date: true,
                avatar: true,
                role: true,
                created_at: true,
                updated_at: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        return res.status(200).json({ data: user });

    } catch (error) {
        console.error('Erro ao buscar detalhes do usuário:', error);
        return res.status(500).json({ error: 'Não foi possível buscar os detalhes do usuário.' });
    }
}

module.exports = {
    getAllUser,
    getUserDetails,
    storeUser,
    updateUser
};