const { PrismaClient } = require('@/generated/prisma/client');
const prisma = new PrismaClient();

const PAGINATION_LIMIT = 30;

/**
 * @function getGamesList
 * @description Retrieves all games in a specific list belonging to the authenticated user.
 * @async
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @response 200 {object} data - An array containing the games in the specified list.
 * @response 404 {object} error - Error message if the list is not found.
 * @response 500 {object} error - Error message if something goes wrong on the server.
 */
const getGamesList = async (req, res) => {

    const userId = req.user_id;
    const listId = parseInt(req.params.id);
    const { cursor, sortBy = 'id', setOrder = 'asc', search } = req.query;

    const queryOptions = {
        take: PAGINATION_LIMIT,
        orderBy: {},
        where: {
            list_id: listId
        },
        include: {
            game: true
        }
    };

    // Search by game name (case-insensitive)
    if (search) {
        queryOptions.where.game = {
            name: {
                contains: search,
                mode: 'insensitive'
            }
        };
    }

    // Cursor-based pagination (only when not searching)
    if (!search && cursor) {
        queryOptions.skip = 1;
        queryOptions.cursor = { id: parseInt(cursor) };
    }

    // Normalize order direction
    const direction = (String(setOrder).toLowerCase() === 'desc') ? 'desc' : 'asc';

    // Decide whether to order by a field on the join table (ListsGames) or on the related game
    const listsGamesFields = ['id', 'game_id', 'created_at', 'updated_at'];
    const gamesFields = ['appId', 'name'];

    if (listsGamesFields.includes(sortBy)) {
        queryOptions.orderBy[sortBy] = direction;
    } else if (gamesFields.includes(sortBy)) {
        queryOptions.orderBy = {
            game: {
                [sortBy]: direction
            }
        };
    }

    try {

        const list = await prisma.lists.findFirst({ where: { id: listId, user_id: userId } });

        if (!list) {
            return res.status(404).json({ error: 'Lista não encontrada.' });
        }

        const listGames = await prisma.listsGames.findMany(queryOptions);

        const games = listGames.map(item => item.game);

        const nextCursor = listGames.length > 0 ? listGames[listGames.length - 1].id : null;

        let responseData = { data: games };

        if (!search) {
            responseData.cursor = nextCursor;
        }

        return res.status(200).json(responseData);

    } catch (error) {
        console.error('Erro ao buscar os jogos da lista:', error);
        return res.status(500).json({ error: 'Não foi possível buscar os jogos da lista.' });
    }
}

/**
 * @function addGamesToList
 * @description Adds multiple games to a specific list belonging to the authenticated user.
 * @async
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @requestBody {array} gameIds - An array of game IDs to be added to the list.
 * @response 200 {object} message - Success message upon adding games.
 * @response 400 {object} error - Error message when required fields are missing.
 * @response 404 {object} error - Error message if the list is not found.
 * @response 500 {object} error - Error message if something goes wrong on the server.
 */
const addGamesToList = async (req, res) => {

    const userId = req.user_id;
    const listId = parseInt(req.params.id);
    const { gameIds } = req.body || {};

    if (!Array.isArray(gameIds) || gameIds.length === 0) {
        return res.status(400).json({ error: 'É necessário informar um array com os IDs dos jogos!' });
    }

    try {

        const list = await prisma.lists.findFirst({ where: { id: listId, user_id: userId } });

        if (!list) {
            return res.status(404).json({ error: 'Lista não encontrada.' });
        }

        const createData = gameIds.map(gameId => ({
            list_id: listId,
            game_id: gameId
        }));

        await prisma.listsGames.createMany({ data: createData, skipDuplicates: true });

        return res.status(200).json({ message: 'Jogos adicionados à lista com sucesso!' });

    } catch (error) {
        console.error('Erro ao adicionar jogos à lista:', error);
        return res.status(500).json({ error: 'Não foi possível adicionar os jogos à lista.' });
    }
}

/**
 * @function removeGamesFromList
 * @description Removes multiple games from a specific list belonging to the authenticated user.
 * @async
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @requestBody {array} gameIds - An array of game IDs to be removed from the list.
 * @response 200 {object} message - Success message upon removing games.
 * @response 400 {object} error - Error message when required fields are missing.
 * @response 404 {object} error - Error message if the list is not found.
 * @response 500 {object} error - Error message if something goes wrong on the server.
 */
const removeGamesFromList = async (req, res) => {
    
    const userId = req.user_id;
    const listId = parseInt(req.params.id);
    const { gameIds } = req.body || {};

    if (!Array.isArray(gameIds) || gameIds.length === 0) {
        return res.status(400).json({ error: 'É necessário informar um array com os IDs dos jogos!' });
    }

    try {

        const list = await prisma.lists.findFirst({ where: { id: listId, user_id: userId } });

        if (!list) {
            return res.status(404).json({ error: 'Lista não encontrada.' });
        }

        await prisma.listsGames.deleteMany({
            where: {
                list_id: listId,
                game_id: { in: gameIds }
            }
        });

        return res.status(200).json({ message: 'Jogos removidos da lista com sucesso!' });
        
    } catch (error) {
        console.error('Erro ao remover jogos da lista:', error);
        return res.status(500).json({ error: 'Não foi possível remover os jogos da lista.' });
    }
}

module.exports = {
    getGamesList,
    addGamesToList,
    removeGamesFromList
};
