const {PrismaClient} = require('@/generated/prisma/client');
const prisma = new PrismaClient();

const PAGINATION_LIMIT = 30;

const getGames = async (req, res) => {
    const {cursor, sortBy = 'id', setOrder = 'asc', search} = req.query;

    const queryOptions = {
        take: PAGINATION_LIMIT,
        orderBy: {
            [sortBy]: setOrder
        },
        where: {}
    }

    if (search) {
        queryOptions.where.name = {
            contains: search,
            mode: 'insensitive'
        }
    }

    if (!search && cursor) {
        queryOptions.skip = 1;
        queryOptions.cursor = {
            id: parseInt(cursor)
        }
    }

    if (typeof queryOptions.orderBy[sortBy] !== 'string') {
        queryOptions.orderBy[sortBy] = 'asc';
    }

    try {
        const games = await prisma.games.findMany(queryOptions);

        const nextCursor = games.length > 0 ? games[games.length - 1].id : null;

        return res.status(200).json({data: games, cursor: nextCursor});
    } catch (error) {
        console.error('Erro ao retornar todos os jogos do banco de dados: ', error);
        return res.status(500).json({error: 'Não foi possível retornar a lista de jogos.'});
    }
}

module.exports = {
    getGames,
};