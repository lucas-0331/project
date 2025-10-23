const {PrismaClient} = require('@/generated/prisma/client');
const prisma = new PrismaClient();

const getGames = async (req, res) => {
    const take = 30;
    const {cursor, sortBy = 'id', setOrder = 'asc', search} = req.query;

    if (setOrder === 'desc' && sortBy === 'id' && !search) {
        return res.status(500).json({
            error: 'Não foi possível retornar a lista de jogos, pois a ordenação está decrescente e a coluna está por ID, gerando um problema na busca dos jogos.'
        });
    }

    const orderByClause = {
        [sortBy]: setOrder
    };

    try {
        if (search) {
            const games = await prisma.games.findMany({
                where: {
                    name: {contains: search, mode: 'insensitive'}
                }
            });

            return res.status(200).json({data: games, cursor: games[games.length - 1].id});
        }

        if (cursor) {
            const games = await prisma.games.findMany({
                take: take,
                skip: 1,
                cursor: {
                    id: parseInt(cursor)
                },
                orderBy: orderByClause
            });

            return res.status(200).json({data: games, cursor: games[games.length - 1].id});
        }

        const games = await prisma.games.findMany({
            take: take,
            orderBy: orderByClause
        });

        return res.status(200).json({data: games, cursor: games[games.length - 1].id});
    } catch (error) {
        console.error('Erro ao retornar todos os jogos do banco de dados: ', error);
        return res.status(500).json({error: 'Não foi possível retornar a lista de jogos.'});
    }
}

module.exports = {
    getGames,
};