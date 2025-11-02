const { PrismaClient } = require('@/generated/prisma/client');
const prisma = new PrismaClient();

/**
 * @function getLists
 * @description Retrieves all lists belonging to the authenticated user, sorted from newest to oldest.
 * @async
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @response 200 {object} data - An array containing the user's lists.
 * @response 500 {object} error - Error message if something goes wrong on the server.
 */
const getLists = async (req, res) => {

    try {

        const lists = await prisma.lists.findMany({
            where: {user_id: req.user_id},
            orderBy: {created_at: 'desc'}
        });

        res.status(200).json({data: lists});

    } catch (error) {
        console.error('Erro ao buscar listas no banco de dados:', error);
        res.status(500).json({error: 'Não foi possível buscar a lista de listas.'});
    }
}

/**
 * @function createList
 * @description Creates a new list for the authenticated user.
 * @async
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @requestBody {string} name - The name of the new list.
 * @requestBody {string} icon - An icon representing the list.
 * @requestBody {string} color - A color code associated with the list.
 * @response 201 {object} data - The newly created list and a success message.
 * @response 400 {object} error - Error message when required fields are missing.
 * @response 500 {object} error - Error message if something goes wrong on the server.
 */
const createList = async (req, res) => {

    const user_id = req.user_id;
    const {name, icon, color} = req.body || {};

    if (!name || !icon || !color) {
        return res.status(400).json({error: 'Todos os campos são obrigatórios.'});
    }

    try {
        
        const newList = await prisma.lists.create({
            data: { user_id, name, icon, color }
        });

        res.status(201).json({message: 'Lista criada com sucesso!', data: newList});

    } catch (error) {
        console.error('Erro ao criar lista no banco de dados:', error);
        res.status(500).json({error: 'Não foi possível criar a lista.'});
    }
}

/**
 * @function updateList
 * @description Updates an existing list belonging to the authenticated user.
 * @async
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @requestParam {number} id - The ID of the list to be updated.
 * @requestBody {string} name - The new name of the list.
 * @requestBody {string} icon - The new icon representing the list.
 * @requestBody {string} color - The new color code for the list.
 * @response 200 {object} data - The updated list and a success message.
 * @response 400 {object} error - Error message when required fields are missing.
 * @response 500 {object} error - Error message if something goes wrong on the server.
 */
const updateList = async (req, res) => {
    
    const {name, icon, color} = req.body || {};

    if (!name || !icon || !color) {
        return res.status(400).json({error: 'Todos os campos são obrigatórios.'});
    }

    try {

        const updatedList = await prisma.lists.update({
            where: {
                id: parseInt(req.params.id),
                user_id: req.user_id
            },
            data: {name, icon, color, updated_at: new Date()}
        });

        res.status(200).json({message: 'Lista atualizada com sucesso!', data: updatedList});
        
    } catch (error) {
        console.error('Erro ao atualizar lista no banco de dados:', error);
        res.status(500).json({error: 'Não foi possível atualizar a lista.'});   
    }
}

/**
 * @function deleteList
 * @description Deletes an existing list belonging to the authenticated user.
 * @async
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @requestParam {number} id - The ID of the list to be deleted.
 * @response 200 {object} message - Success message when the list is successfully deleted.
 * @response 500 {object} error - Error message if something goes wrong on the server.
 */
const deleteList = async (req, res) => {

    try {

        await prisma.lists.delete({
            where: {
                id: parseInt(req.params.id),
                user_id: req.user_id
            }
        });

        res.status(200).json({message: 'Lista deletada com sucesso!'});

    } catch (error) {
        console.error('Erro ao deletar lista no banco de dados:', error);
        res.status(500).json({error: 'Não foi possível deletar a lista.'});   
    }
}

module.exports = {
    getLists,
    createList,
    updateList,
    deleteList
};
