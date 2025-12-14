const { PrismaClient } = require('@/generated/prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

/**
 * @function getAvatars
 * @description Retrieves the list of available avatars.
 * @async
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @response 200 {object} message - Success message.
 * @response 500 {object} error - Error message if something goes wrong on the server.
 */
const getAvatars = async (req, res) => {

    try {

        const avatars = await prisma.avatars.findMany();

        res.status(200).json({data: avatars});

    } catch (error) {
        console.error('Erro ao listar os avatares:', error);
        return res.status(500).json({ error: 'Não foi possível listar os avatares.' });
    }
}

/**
 * @function saveAvatar
 * @description Saves a new avatar to the database.
 * @async
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @response 201 {object} message - Success message.
 * @response 500 {object} error - Error message if something goes wrong on the server.
 */
const saveAvatar = async (req, res) => {

    const { link } = req.body || {};

    try {

        const avatar = await prisma.avatars.create({ data: { link } });

        res.status(201).json({message: 'Avatar criado com sucesso!', data: avatar});
        
    } catch (error) {
        console.error('Erro ao salvar avatar:', error);
        return res.status(500).json({ error: 'Não foi possível salvar o avatar.' });
    }
}

/**
 * @function deleteAvatar
 * @description Deletes an avatar from the database.
 * @async
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @response 200 {object} message - Success message.
 * @response 500 {object} error - Error message if something goes wrong on the server.
 */
const deleteAvatar = async (req, res) => {

    const { id } = req.params || {};

    try {

        await prisma.avatars.delete({ where: { id: Number(id) } });

        res.status(200).json({message: 'Avatar deletado com sucesso!'});

    } catch (error) {
        console.error('Erro ao deletar avatar:', error);
        return res.status(500).json({ error: 'Não foi possível deletar o avatar.' });
    }
}

/**
 * @function updateAvatar
 * @description Updates an existing avatar in the database.
 * @async
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @response 200 {object} message - Success message.
 * @response 404 {object} error - Error message if avatar not found.
 * @response 500 {object} error - Error message if something goes wrong on the server.
 */
const updateAvatar = async (req, res) => {

    const { id } = req.params || {};
    const { link } = req.body || {};
    
    try {

        const avatar = await prisma.avatars.update({
            where: { id: Number(id) },
            data: { link }
        });

        if (!avatar) {
            return res.status(404).json({ error: 'Avatar não encontrado.' });
        }

        res.status(200).json({message: 'Avatar atualizado com sucesso!', data: avatar});

    } catch (error) {
        console.error('Erro ao atualizar avatar:', error);
        return res.status(500).json({ error: 'Não foi possível atualizar o avatar.' });
    }
}

module.exports = {
    getAvatars,
    saveAvatar,
    updateAvatar,
    deleteAvatar
};