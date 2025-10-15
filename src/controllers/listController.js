const {PrismaClient} = require('@/generated/prisma/client');
const prisma = new PrismaClient();

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