const axios = require('axios');
const {PrismaClient} = require('@/generated/prisma/client');
const prisma = new PrismaClient();

const getAllGames = async (req, res) => {
    const { cursor } = req.query;
    try {

        if (cursor) {
            const games = await prisma.games.findMany({
                take: 20,
                skip: 1,
                cursor: {
                    id: parseInt(cursor)
                }
            });

            res.status(200).json({data: games, cursor: games[19].id});
        }

        const games = await prisma.games.findMany({
            take: 20
        });

        res.status(200).json({data: games, cursor: games[19].id});

    } catch (error) {
        console.error('Erro ao retornar todos os jogos do banco de dados: ', error);
        res.status(500).json({error: 'Não foi possível retornar a lista de jogos.'});
    }
}

module.exports = {
    getAllGames,
};